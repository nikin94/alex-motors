import { useEffect, useRef, useState } from 'react'
import { FaPhone, FaWhatsapp } from 'react-icons/fa6'

import { useI18n } from '../i18n/context'
import { LANGS } from '../i18n/dictionary'

/* Persistent CTA cluster — call, WhatsApp and the language switcher — hidden
   while the hero is on screen: the hero already leads with the phone number
   and its entrance sequence stays clean, so the cluster only appears once the
   visitor scrolls into the content screens (same rule on desktop and mobile).
   Mobile stacks icon circles in the corner (language on top), desktop lays
   them in a row (language rightmost). The language trigger shows the current
   code (EN/GA/RU); pressing it slides a vertical menu up from the trigger —
   the current language stays in the trigger's spot, highlighted, with the
   other two above it. The hidden states are inert and aria-hidden, keeping
   every control out of the tab order. */

const SHOW_BELOW_HERO_RATIO = 0.35

/* One shell for every button in the cluster: slightly larger circles on
   mobile (thumb targets), the original size from md up. */
const CIRCLE =
  'flex size-11 items-center justify-center rounded-full border border-amber-300/50 bg-black/70 text-amber-100 backdrop-blur-sm transition-colors hover:border-amber-300/80 hover:bg-black/80 hover:text-amber-50 md:size-10'

function LangMenu() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on any press outside the widget, and on Escape.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  /* The current language renders LAST so it sits exactly where the trigger
     is; the other two stack above it and the whole column slides up. */
  const stack = [...LANGS.filter(({ code }) => code !== lang), ...LANGS.filter(({ code }) => code === lang)]

  return (
    /* order-first puts the trigger on top of the mobile column; md:order-none
       returns it to DOM order — rightmost in the desktop row. */
    <div ref={wrapRef} className="relative order-first md:order-none">
      <button
        type="button"
        lang="en"
        aria-label={t.a11y.selectLanguage}
        title={t.a11y.selectLanguage}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${CIRCLE} font-display text-base tracking-[0.08em] md:text-sm`}
      >
        {LANGS.find(({ code }) => code === lang)?.label}
      </button>

      {/* Bottom-anchored over the trigger, so the current language's button
          lands in the trigger's exact spot when the menu is open. */}
      <nav
        aria-label={t.a11y.selectLanguage}
        aria-hidden={!open}
        inert={!open}
        className={`absolute right-0 bottom-0 flex flex-col gap-2 motion-safe:transition-all motion-safe:duration-200 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        {stack.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            lang="en"
            aria-current={lang === code ? 'true' : undefined}
            onClick={() => {
              setLang(code)
              setOpen(false)
            }}
            className={`${CIRCLE} font-display text-base tracking-[0.08em] md:text-sm ${
              lang === code ? 'border-amber-300/90 bg-amber-400/20 text-amber-50' : ''
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export function StickyCall({
  phoneE164,
  whatsappUrl,
}: {
  phoneE164: string
  whatsappUrl: string
}) {
  const { t } = useI18n()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // The hero is addressed by id: relying on "first .snap-screen" would break
    // silently if a screen were ever added above it.
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setShow(entry.intersectionRatio < SHOW_BELOW_HERO_RATIO),
      { threshold: [0, SHOW_BELOW_HERO_RATIO] },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed right-4 bottom-4 z-20 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6 md:flex-row md:items-center motion-safe:transition-all motion-safe:duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <a
        href={`tel:${phoneE164}`}
        aria-label={t.location.callUs}
        title={t.location.callUs}
        className={`${CIRCLE} font-display gap-2 text-sm tracking-[0.1em] md:size-auto md:px-4 md:py-2.5`}
      >
        <FaPhone aria-hidden className="size-4 shrink-0 md:size-3.5" />
        <span className="hidden md:inline">{t.location.callUs}</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
        className={CIRCLE}
      >
        <FaWhatsapp aria-hidden className="size-4.5 md:size-4" />
      </a>
      <LangMenu />
    </div>
  )
}
