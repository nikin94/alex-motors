import { useEffect, useRef, useState, type FormEvent } from 'react'

import { CONTACT_LIMITS, isEmail, isPhone } from '../../shared/contact'
import { Button } from './Button'
import { useI18n } from '../i18n/context'

/* Contact form posting to the site's own Worker endpoint (worker/index.ts).
   Delivery rides Cloudflare Email Routing, which needs the production domain
   on Cloudflare — until that is wired up the endpoint answers 503 and the
   form shows its call/WhatsApp fallback line, so nothing here changes when
   delivery goes live. The `contact_ref` field is a honeypot: visually hidden
   and out of the tab order, so a human never fills it and a form-stuffing bot
   does — the server quietly drops those. Its name is deliberately meaningless
   so password managers never autofill it (autofill tokens like "company"
   would drop a real enquiry).
   Validation is ours (noValidate): required name/phone/message plus phone and
   email shape checks, so the messages come localised from the dictionary
   instead of the browser chrome. Required labels carry a * explained by the
   note at the card's bottom.
   Turnstile (interaction-only) runs invisibly for legitimate visitors and
   hands the form a token the Worker verifies server-side; only when Cloudflare
   suspects a bot does a visible challenge unfold above the submit button. */

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Field = 'name' | 'phone' | 'email' | 'message'

/* The sitekey is public by design (it only identifies the widget; the secret
   lives server-side). Dev and CI use Cloudflare's documented always-pass test
   key so local runs never need real keys or show challenges. */
const TURNSTILE_SITEKEY = import.meta.env.DEV
  ? '1x00000000000000000000AA'
  : '0x4AAAAAAEGfqh3u6KRtYyUq'

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    onTurnstileReady?: () => void
  }
}

/* Loads the Turnstile script once and renders one widget into `el`, feeding
   fresh tokens to `onToken` (and '' on expiry). Returns the widget id. */
function useTurnstile(onToken: (token: string) => void) {
  const elRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    const render = () => {
      if (!elRef.current || widgetId.current !== null || !window.turnstile) return
      widgetId.current = window.turnstile.render(elRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        theme: 'dark',
        size: 'flexible',
        appearance: 'interaction-only',
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      })
    }
    if (window.turnstile) {
      render()
      return
    }
    window.onTurnstileReady = render
    if (!document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) {
      const script = document.createElement('script')
      script.src = TURNSTILE_SRC
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  const reset = () => {
    onTokenRef.current('')
    if (widgetId.current !== null) window.turnstile?.reset(widgetId.current)
  }

  return { elRef, reset }
}

const FIELDS: Field[] = ['name', 'phone', 'email', 'message']

const inputClass =
  'w-full rounded-md border border-amber-100/20 bg-black/40 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 transition-colors focus:border-amber-300/60 focus:outline-none sm:text-base'

const labelClass = 'mb-1.5 block text-xs tracking-[0.08em] text-amber-100/70 sm:text-sm'

function RequiredMark() {
  return (
    <span aria-hidden className="text-amber-300">
      *
    </span>
  )
}

export function ContactForm() {
  const { t } = useI18n()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  // Ref, not state: the token is read only at submit time and must never
  // re-render the form while the visitor is typing.
  const turnstileToken = useRef('')
  const turnstile = useTurnstile((token) => {
    turnstileToken.current = token
  })

  const validate = (data: Record<string, string>) => {
    const rules = t.contact.validation
    const found: Partial<Record<Field, string>> = {}
    if (!data.name.trim()) found.name = rules.required
    if (!data.phone.trim()) found.phone = rules.required
    else if (!isPhone(data.phone.trim())) found.phone = rules.phone
    if (data.email.trim() && !isEmail(data.email.trim())) found.email = rules.email
    if (!data.message.trim()) found.message = rules.required
    return found
  }

  // A field's stale message disappears as soon as the visitor edits it.
  const clearError = (field: Field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  // aria-* wiring only; each field clears its own error in its onInput, so
  // the one field with a sanitizer (phone) doesn't silently discard a second
  // handler this helper would otherwise attach.
  const ariaFor = (field: Field) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  })

  /* type="tel" does not restrict input, so letters are stripped as they are
     typed; validation still guards paste-arounds and too-few digits. */
  const sanitizePhone = (event: FormEvent<HTMLInputElement>) => {
    const el = event.currentTarget
    const clean = el.value.replace(/[^\d\s()./+-]/g, '')
    if (el.value !== clean) el.value = clean
    clearError('phone')
  }

  const errorFor = (field: Field) =>
    errors[field] ? (
      <p id={`contact-${field}-error`} className="mt-1 text-xs text-red-300">
        {errors[field]}
      </p>
    ) : null

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('idle')
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const found = validate(data)
    setErrors(found)
    const firstInvalid = FIELDS.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken: turnstileToken.current }),
        // A hung request (flaky mobile network) must not pin the form on
        // "Sending…" forever — after this it falls into the error state,
        // whose copy already points at call/WhatsApp.
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    } finally {
      // Tokens are single-use: get a fresh one for a possible second enquiry
      // (and for a retry after an error).
      turnstile.reset()
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-amber-100/15 bg-black/55 p-6 sm:p-8 lg:max-w-none"
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t.contact.name}
          <RequiredMark />
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={CONTACT_LIMITS.name}
          autoComplete="name"
          placeholder={t.contact.placeholders.name}
          className={inputClass}
          {...ariaFor('name')}
          onInput={() => clearError('name')}
        />
        {errorFor('name')}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {t.contact.phone}
            <RequiredMark />
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            maxLength={CONTACT_LIMITS.phone}
            autoComplete="tel"
            placeholder={t.contact.placeholders.phone}
            className={inputClass}
            {...ariaFor('phone')}
            onInput={sanitizePhone}
          />
          {errorFor('phone')}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t.contact.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            maxLength={CONTACT_LIMITS.email}
            autoComplete="email"
            placeholder={t.contact.placeholders.email}
            className={inputClass}
            {...ariaFor('email')}
            onInput={() => clearError('email')}
          />
          {errorFor('email')}
        </div>
      </div>

      {/* flex-1 lets the message soak up whatever height the column has to
          spare, keeping the submit button pinned toward the card's bottom. */}
      <div className="flex min-h-0 flex-1 flex-col">
        <label htmlFor="contact-message" className={labelClass}>
          {t.contact.message}
          <RequiredMark />
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={CONTACT_LIMITS.message}
          rows={4}
          placeholder={t.contact.placeholders.message}
          className={`${inputClass} flex-1 resize-none`}
          {...ariaFor('message')}
          onInput={() => clearError('message')}
        />
        {errorFor('message')}
      </div>

      {/* Honeypot — humans never see or reach it. sr-only (clipped, not
          display:none) so bots that skip display:none fields still fill it;
          aria-hidden + tabIndex keep it out of the a11y tree and tab order. */}
      <input
        type="text"
        name="contact_ref"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="sr-only"
      />

      {/* Turnstile mounts here. interaction-only keeps it collapsed and
          invisible for normal visitors; a suspected bot sees the challenge
          unfold in this slot, above the submit button. */}
      <div ref={turnstile.elRef} className="empty:hidden" />

      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t.contact.sending : t.contact.submit}
      </Button>

      {/* One small line at the card's very bottom: the required-fields note
          gives way to the submit outcome. The negative margin pulls it in
          under the button (the form's gap-4 is too roomy for a footnote); its
          box (-mt-2 + min-h-4) is mirrored under Get Directions in the other
          column so both CTA buttons sit level. */}
      <p role="status" className="-mt-2 min-h-4 text-left text-xs text-stone-500">
        {status === 'sent' ? (
          <span className="text-amber-200">{t.contact.success}</span>
        ) : status === 'error' ? (
          <span className="text-red-300">{t.contact.error}</span>
        ) : (
          t.contact.requiredNote
        )}
      </p>
    </form>
  )
}
