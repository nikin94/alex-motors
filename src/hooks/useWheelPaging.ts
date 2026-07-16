import { useEffect } from 'react'

/* Full-page wheel paging on the snap viewports (>= 768px, matching the media
   query in index.css): one wheel gesture turns exactly one screen.
   This is deliberately the simplest possible model. The previous version kept
   an elastic free-play zone, per-gesture scroll anchors and momentum-tail
   heuristics — each patch over trackpad inertia bred the next edge case
   (stacked turns, dead scroll, backward teleports). Now a wheel tick is
   either swallowed while a turn is in flight, or turns one screen from
   wherever the page currently is, strictly in the tick's own direction —
   a backward jump is impossible by construction, and there is no gesture
   state left to go stale.
   The handler owns wheel only: keyboard, scrollbar, touch and anchor
   scrolling stay native (and still snap via CSS). Ctrl+wheel is left
   alone — that's pinch-zoom on most platforms. A textarea (contact form)
   scrolls its own overflow. A screen taller than the viewport (short
   laptops) scrolls natively until its far edge is in view, then the next
   tick pages on. */

/* Fractional scroll positions on HiDPI screens land within a pixel or two
   of a snap point — treat that as aligned. */
const EPSILON = 2

/* Ticks smaller than this stay native: the 1–4px dust of a trackpad's
   momentum tail must not turn a whole screen, while a deliberate flick is
   tens to hundreds of px. Firefox reports line-mode deltas (~3 lines per
   notch), so those convert to px first. */
const INTENT_PX = 8
const LINE_PX = 16

/* The lock lifts this long after the glide ends — a fixed cooldown, not a
   re-arming debounce. A very long momentum tail can outlive it and turn one
   extra screen, but that turn is a clean single step in the tail's own
   direction; the debounce variants that tried to outsmart tails are what
   produced dead scroll and backward jumps. */
const COOLDOWN_MS = 500

/* Failsafe unlock for browsers without the scrollend event. */
const FAILSAFE_MS = 1500

export function useWheelPaging() {
  useEffect(() => {
    const snapViewport = window.matchMedia('(min-width: 768px)')
    let locked = false
    let timer = 0

    const onScrollEnd = () => {
      if (!locked) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        locked = false
      }, COOLDOWN_MS)
    }

    const onWheel = (event: WheelEvent) => {
      if (!snapViewport.matches || event.ctrlKey) return
      // A textarea (contact form) scrolls its own overflow — never page over it.
      if (event.target instanceof Element && event.target.closest('textarea')) return
      if (locked) {
        event.preventDefault() // swallow the glide's tail and the cooldown
        return
      }

      const px =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * LINE_PX : event.deltaY
      if (Math.abs(px) < INTENT_PX) return // jitter: native scroll, CSS snap holds the page
      const dir = px > 0 ? 1 : -1

      const screens = document.querySelectorAll<HTMLElement>('.snap-screen')
      if (screens.length === 0) return

      // The screen the page is on = the one whose top is nearest the viewport top.
      let current = 0
      let nearest = Infinity
      screens.forEach((screen, i) => {
        const distance = Math.abs(screen.getBoundingClientRect().top)
        if (distance < nearest) {
          nearest = distance
          current = i
        }
      })

      /* An over-tall screen with unseen content in the tick's direction keeps
         scrolling natively until that content has been seen — only then does
         the wheel hand off to the neighbour. */
      const rect = screens[current].getBoundingClientRect()
      if (dir > 0 && rect.bottom > window.innerHeight + EPSILON) return
      if (dir < 0 && rect.top < -EPSILON) return

      event.preventDefault()
      const next = current + dir
      if (next < 0 || next >= screens.length) return // past the edges: nothing to turn to

      locked = true
      timer = window.setTimeout(() => {
        locked = false
      }, FAILSAFE_MS)
      /* 'auto' resolves to the scroller's computed scroll-behavior: the base
         html rule gives smooth, prefers-reduced-motion flips it to instant —
         CSS stays the single owner of that decision. */
      window.scrollTo({
        top: window.scrollY + screens[next].getBoundingClientRect().top,
        behavior: 'auto',
      })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scrollend', onScrollEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scrollend', onScrollEnd)
      window.clearTimeout(timer)
    }
  }, [])
}
