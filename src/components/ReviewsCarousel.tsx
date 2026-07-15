import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa6'

import { useIsDesktop } from '../hooks/useIsDesktop'
import { useI18n } from '../i18n/context'

/* Customer reviews as an infinite carousel. Desktop shows a page of three
   quote cards side by side (nine quotes → three pages), mobile shows one at a
   time; chevrons and horizontal swipe step through the pages and wrap around
   at both ends. It auto-advances slowly so the "infinite" motion is visible
   without interaction, but yields to the reader: the timer pauses while
   hovered or focused, resets after any manual step, and never runs under
   reduced motion. All pages stay in the DOM (inactive ones inert +
   aria-hidden) so every quote is crawlable and the tallest page fixes the
   height — switching is a crossfade, not a reflow. */

const AUTO_ADVANCE_MS = 6000
const SWIPE_THRESHOLD = 40

export function ReviewsCarousel() {
  const { t } = useI18n()
  const isDesktop = useIsDesktop()
  const reviews = t.reviews.items
  const perPage = isDesktop ? 3 : 1
  const pageCount = Math.ceil(reviews.length / perPage)
  const pages = Array.from({ length: pageCount }, (_, p) =>
    reviews.slice(p * perPage, (p + 1) * perPage),
  )

  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  // Manual steps restart the interval by bumping this key, so the next
  // auto-advance always happens a full period after the last interaction.
  const [timerKey, setTimerKey] = useState(0)

  // Crossing the 768px boundary changes the page count, so a kept index
  // could point past the end — start over from the first page.
  useEffect(() => setPage(0), [perPage])

  const step = (dir: 1 | -1) => {
    setPage((p) => (p + dir + pageCount) % pageCount)
    setTimerKey((k) => k + 1)
  }

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setPage((p) => (p + 1) % pageCount), AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [paused, pageCount, timerKey])

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
  }
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    step(dx < 0 ? 1 : -1)
  }

  return (
    <div
      className="flex w-full max-w-md flex-col justify-center gap-4 md:max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label={t.a11y.prevReview}
          onClick={() => step(-1)}
          className="shrink-0 p-2 text-amber-100/50 transition-colors hover:text-amber-100"
        >
          <FaChevronLeft className="size-4" />
        </button>

        <div className="grid min-w-0 flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {pages.map((quotes, p) => {
            const selected = p === page
            return (
              <div
                key={quotes[0].name}
                aria-hidden={!selected}
                inert={!selected}
                className={`col-start-1 row-start-1 grid gap-4 md:grid-cols-3 motion-safe:transition-opacity motion-safe:duration-300 ${
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {quotes.map(({ name, text }) => (
                  <figure
                    key={name}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-amber-100/15 bg-black/55 p-5 sm:p-6"
                  >
                    <blockquote className="text-sm leading-relaxed text-stone-300 sm:text-base">
                      <FaQuoteLeft aria-hidden className="mb-2 size-4 text-amber-300/60" />
                      <p>{text}</p>
                    </blockquote>
                    <figcaption lang="en" className="font-display tracking-[0.1em] text-amber-100/80">
                      — {name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          aria-label={t.a11y.nextReview}
          onClick={() => step(1)}
          className="shrink-0 p-2 text-amber-100/50 transition-colors hover:text-amber-100"
        >
          <FaChevronRight className="size-4" />
        </button>
      </div>

      <div aria-hidden className="flex justify-center gap-1.5">
        {pages.map((quotes, p) => (
          <span
            key={quotes[0].name}
            className={`size-1.5 rounded-full transition-colors ${
              p === page ? 'bg-amber-300/80' : 'bg-amber-100/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
