import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa6'

import { useI18n } from './i18n/context'

/* Customer reviews as an infinite carousel: one quote card at a time, chevrons
   and horizontal swipe step through the five quotes and wrap around at both
   ends. It auto-advances slowly so the "infinite" motion is visible without
   interaction, but yields to the reader: the timer pauses while hovered or
   focused, resets after any manual step, and never runs under reduced motion.
   All quotes stay in the DOM (inactive ones inert + aria-hidden) so the text
   is crawlable and the tallest quote fixes the card height — switching is a
   crossfade, not a reflow. */

const AUTO_ADVANCE_MS = 6000
const SWIPE_THRESHOLD = 40

export function ReviewsCarousel() {
  const { t } = useI18n()
  const reviews = t.reviews.items
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  // Manual steps restart the interval by bumping this key, so the next
  // auto-advance always happens a full period after the last interaction.
  const [timerKey, setTimerKey] = useState(0)

  const step = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + reviews.length) % reviews.length)
    setTimerKey((k) => k + 1)
  }

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % reviews.length),
      AUTO_ADVANCE_MS,
    )
    return () => window.clearInterval(id)
  }, [paused, reviews.length, timerKey])

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
      className="flex w-full max-w-md flex-col justify-center gap-4 lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h3 className="font-display text-center text-xl tracking-[0.15em] text-amber-50 lg:text-left">
        {t.reviews.heading}
      </h3>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label={t.a11y.prevReview}
          onClick={() => step(-1)}
          className="shrink-0 p-2 text-amber-100/50 transition-colors hover:text-amber-100"
        >
          <FaChevronLeft className="size-4" />
        </button>

        <div
          className="grid min-w-0 flex-1"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {reviews.map(({ name, text }, i) => {
            const selected = i === index
            return (
              <figure
                key={name}
                aria-hidden={!selected}
                inert={!selected}
                className={`col-start-1 row-start-1 flex flex-col justify-between gap-4 rounded-lg border border-amber-100/15 bg-black/55 p-5 motion-safe:transition-opacity motion-safe:duration-300 sm:p-6 ${
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <blockquote className="text-sm leading-relaxed text-stone-300 sm:text-base">
                  <FaQuoteLeft aria-hidden className="mb-2 size-4 text-amber-300/60" />
                  <p>{text}</p>
                </blockquote>
                <figcaption lang="en" className="font-display tracking-[0.1em] text-amber-100/80">
                  — {name}
                </figcaption>
              </figure>
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
        {reviews.map(({ name }, i) => (
          <span
            key={name}
            className={`size-1.5 rounded-full transition-colors ${
              i === index ? 'bg-amber-300/80' : 'bg-amber-100/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
