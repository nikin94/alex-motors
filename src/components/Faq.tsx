import { useEffect, useState } from 'react'
import {
  FaCalendarCheck,
  FaCarSide,
  FaClipboardCheck,
  FaEuroSign,
  FaLocationDot,
  FaTruckFast,
} from 'react-icons/fa6'
import type { IconType } from 'react-icons'

import { Button } from './Button'
import { tileShell } from './tile'
import { useIsDesktop } from '../hooks/useIsDesktop'
import { useRevealOnView } from '../hooks/useRevealOnView'
import { useTablist } from '../hooks/useTablist'
import { useI18n } from '../i18n/context'

/* FAQ in the services screen's master-detail language, so the two screens read
   as one system.
   Desktop (>= 768px): question tiles on the left are a tablist (same keyboard
   navigation as the services showcase); the answer crossfades in a single panel
   on the right. All answers stay in the DOM (inactive ones inert + aria-hidden)
   so the text is crawlable and the tallest answer fixes the panel height —
   switching never reflows the screen.
   Mobile: a single-open accordion — the most compact Q&A shape on a phone, and
   question + answer live inside ONE tile (question row with its neon icon on
   the right, answer folding open beneath), so opening reads as the tile
   expanding rather than text appearing outside it. The fold animates via the
   grid-rows trick in index.css (.faq-collapse) — smooth open AND close with
   no JS height measuring. Closed answers stay in the DOM for crawlability.
   The tiles enter with the same staggered slide-in as the services tablist
   (useRevealOnView + .tile-reveal), and each answer carries a neon-glow icon
   in the sign's amber — the decorative role the old service line art played. */

/* One icon per question, by position — the dictionary keeps the items in the
   same order across languages, so index is the stable key here. Nothing
   enforces the lengths match: a question added without its icon falls back
   to the first icon via `iconFor` below. */
const ICONS: IconType[] = [
  FaCarSide, // all makes and models
  FaClipboardCheck, // pre-NCT check coverage
  FaCalendarCheck, // how to book
  FaEuroSign, // what it costs
  FaTruckFast, // call-outs
  FaLocationDot, // where we are
]

export function Faq() {
  const { t } = useI18n()
  const isDesktop = useIsDesktop()
  const items = t.faq.items
  const [active, setActive] = useState(0)

  /* The mobile accordion allows "all collapsed" (active = -1), but the desktop
     tablist must always have a selected tab — with none, the answer panel is
     empty and every tab sits at tabIndex -1, unreachable by keyboard. Crossing
     the 768px boundary (tablet rotation, window resize) therefore restores the
     default selection — the same boundary-reset the reviews carousel does. */
  useEffect(() => setActive(0), [isDesktop])

  // Staggered slide-in on first view; see useRevealOnView + index.css.
  const { ref: listRef, revealed } = useRevealOnView<HTMLDivElement>()

  // Shared roving-tabindex keyboard navigation; see useTablist.
  const { onKeyDown, refFor } = useTablist(items.length, active, setActive)

  const iconFor = (i: number) => ICONS[i] ?? ICONS[0]

  if (!isDesktop) {
    return (
      <div
        ref={listRef}
        className={`flex w-full max-w-md flex-col gap-2 ${revealed ? 'tiles-in' : ''}`}
      >
        {items.map(({ q, a }, i) => {
          const open = i === active
          const Icon = iconFor(i)
          return (
            <div
              key={q}
              className={`tile-reveal ${tileShell(open)}`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <button
                type="button"
                id={`faq-question-${i}`}
                aria-expanded={open}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setActive(open ? -1 : i)}
                className="font-display flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-base tracking-[0.06em]"
              >
                {q}
                <Icon aria-hidden className="neon-icon size-5 shrink-0" />
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                aria-hidden={!open}
                inert={!open}
                className={`faq-collapse ${open ? 'faq-collapse-open' : ''}`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-3 text-sm leading-relaxed text-stone-300">{a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-stretch">
      <div
        ref={listRef}
        role="tablist"
        aria-label={t.faq.heading}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className={`grid grid-cols-1 gap-2 sm:gap-3 ${revealed ? 'tiles-in' : ''}`}
      >
        {items.map(({ q }, i) => (
          <Button
            key={q}
            variant="tile"
            active={i === active}
            ref={refFor(i)}
            role="tab"
            id={`faq-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`faq-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            style={{ animationDelay: `${i * 55}ms` }}
            className="tile-reveal"
          >
            {q}
          </Button>
        ))}
      </div>

      {/* All panels share one grid cell and crossfade; the tallest sets the
          height so switching never reflows the screen. */}
      <div className="grid rounded-lg border border-amber-100/15 bg-black/50">
        {items.map(({ q, a }, i) => {
          const selected = i === active
          const Icon = iconFor(i)
          return (
            <div
              key={q}
              role="tabpanel"
              id={`faq-panel-${i}`}
              aria-labelledby={`faq-tab-${i}`}
              aria-hidden={!selected}
              inert={!selected}
              tabIndex={selected ? 0 : undefined}
              className={`col-start-1 row-start-1 flex items-center gap-8 p-6 motion-safe:transition-opacity motion-safe:duration-300 sm:gap-12 sm:p-8 ${
                selected ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl tracking-[0.08em] text-amber-50 sm:text-3xl">
                  {q}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-300 sm:text-base">
                  {a}
                </p>
              </div>
              <Icon aria-hidden className="neon-icon size-20 shrink-0 lg:size-28" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
