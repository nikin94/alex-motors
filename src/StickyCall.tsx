import { useEffect, useState } from 'react'
import { FaPhone, FaWhatsapp } from 'react-icons/fa6'

import { useI18n } from './i18n/context'

/* Persistent call/WhatsApp CTA, hidden while the hero is on screen — the hero
   already leads with the phone number and its entrance sequence stays clean,
   so the buttons only appear once the visitor scrolls into the content
   screens (same rule on desktop and mobile). On mobile the pair collapses to
   icon-only circles stacked in the corner, so it never collides with the
   centred footer language switcher on the last screen. The hidden state is
   inert and aria-hidden, keeping the links out of the tab order. */

const SHOW_BELOW_HERO_RATIO = 0.35

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
    // The hero is the first snap screen (same lookup as useWheelPaging).
    const hero = document.querySelector('.snap-screen')
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
        className="font-display flex size-12 items-center justify-center gap-2 rounded-full border border-amber-300/50 bg-black/70 text-base tracking-[0.1em] text-amber-100 backdrop-blur-sm transition-colors hover:border-amber-300/80 hover:bg-black/80 hover:text-amber-50 md:size-auto md:px-5 md:py-3"
      >
        <FaPhone aria-hidden className="size-3.5 shrink-0" />
        <span className="hidden md:inline">{t.location.callUs}</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
        className="flex size-12 items-center justify-center rounded-full border border-amber-300/50 bg-black/70 text-amber-100 backdrop-blur-sm transition-colors hover:border-amber-300/80 hover:bg-black/80 hover:text-amber-50"
      >
        <FaWhatsapp aria-hidden className="size-4" />
      </a>
    </div>
  )
}
