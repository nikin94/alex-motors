import { useState, type FormEvent } from 'react'

import { useI18n } from '../i18n/context'

/* Contact form posting to the site's own Worker endpoint (worker/index.ts).
   Delivery rides Cloudflare Email Routing, which needs the production domain
   on Cloudflare — until that is wired up the endpoint answers 503 and the
   form shows its call/WhatsApp fallback line, so nothing here changes when
   delivery goes live. The `company` field is a honeypot: visually hidden and
   out of the tab order, so a human never fills it and a form-stuffing bot
   does — the server quietly drops those. */

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full rounded-md border border-amber-100/20 bg-black/40 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 transition-colors focus:border-amber-300/60 focus:outline-none sm:text-base'

const labelClass = 'mb-1.5 block text-xs tracking-[0.08em] text-amber-100/70 sm:text-sm'

export function ContactForm() {
  const { t } = useI18n()
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-amber-100/15 bg-black/55 p-6 sm:p-8"
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t.contact.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {t.contact.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            maxLength={40}
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t.contact.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            maxLength={200}
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t.contact.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot — humans never see or reach it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="font-display inline-flex items-center justify-center gap-2 rounded-md border border-amber-300/40 bg-amber-400/10 px-5 py-3 text-lg tracking-[0.12em] text-amber-100 transition-colors hover:border-amber-300/70 hover:bg-amber-400/20 hover:text-amber-50 disabled:pointer-events-none disabled:opacity-60"
      >
        {status === 'sending' ? t.contact.sending : t.contact.submit}
      </button>

      {/* Live region so screen readers announce the outcome. */}
      <p role="status" className="min-h-5 text-center text-sm">
        {status === 'sent' && <span className="text-amber-200">{t.contact.success}</span>}
        {status === 'error' && <span className="text-red-300">{t.contact.error}</span>}
      </p>
    </form>
  )
}
