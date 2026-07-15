import { useRef, useState, type KeyboardEvent } from 'react'

import { Button } from './Button'
import { useIsDesktop } from '../hooks/useIsDesktop'
import { useI18n } from '../i18n/context'

/* FAQ in the services screen's master-detail language, so the two screens read
   as one system.
   Desktop (>= 768px): question tiles on the left are a tablist (same keyboard
   navigation as the services showcase); the answer crossfades in a single panel
   on the right. All answers stay in the DOM (inactive ones inert + aria-hidden)
   so the text is crawlable and the tallest answer fixes the panel height —
   switching never reflows the screen.
   Mobile: a single-open accordion — the most compact Q&A shape on a phone, and
   question + answer stay together so there is no scrolling between them.
   Closed answers stay in the DOM (hidden) for the same crawlability. */

export function Faq() {
  const { t } = useI18n()
  const isDesktop = useIsDesktop()
  const items = t.faq.items
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent) => {
    let next = active
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (active + 1) % items.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (active - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  if (!isDesktop) {
    return (
      <div className="flex w-full max-w-md flex-col gap-2">
        {items.map(({ q, a }, i) => {
          const open = i === active
          return (
            <div key={q}>
              <Button
                variant="tile"
                active={open}
                id={`faq-question-${i}`}
                aria-expanded={open}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setActive(open ? -1 : i)}
                className="w-full text-base sm:text-base"
              >
                {q}
              </Button>
              <p
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                hidden={!open}
                className="px-4 pt-2 pb-1 text-sm leading-relaxed text-stone-300"
              >
                {a}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-stretch">
      <div
        role="tablist"
        aria-label={t.faq.heading}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="grid grid-cols-1 gap-2 sm:gap-3"
      >
        {items.map(({ q }, i) => (
          <Button
            key={q}
            variant="tile"
            active={i === active}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            role="tab"
            id={`faq-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`faq-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
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
          return (
            <div
              key={q}
              role="tabpanel"
              id={`faq-panel-${i}`}
              aria-labelledby={`faq-tab-${i}`}
              aria-hidden={!selected}
              inert={!selected}
              tabIndex={selected ? 0 : undefined}
              className={`col-start-1 row-start-1 flex flex-col justify-center p-6 motion-safe:transition-opacity motion-safe:duration-300 sm:p-8 ${
                selected ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <h3 className="font-display text-2xl tracking-[0.08em] text-amber-50 sm:text-3xl">
                {q}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-300 sm:text-base">
                {a}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
