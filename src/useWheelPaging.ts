import { useEffect } from 'react'

/* Native CSS scroll snap only settles once a gesture ends: a short wheel
   nudge that never crosses the midpoint between screens animates straight
   back to where it started. On the snap viewports (>= 768px, matching the
   media query in index.css) any wheel intent should page one full screen
   instead — the behaviour a full-page site is expected to have.
   The handler owns wheel only: keyboard, scrollbar, touch and anchor
   scrolling stay native (and still snap via CSS). Ctrl+wheel is left
   alone — that's pinch-zoom on most platforms. */

/* Fractional scroll positions on HiDPI screens land within a pixel or two
   of a snap point — treat that as aligned. */
const EPSILON = 2

export function useWheelPaging() {
  useEffect(() => {
    const snapViewport = window.matchMedia('(min-width: 768px)')
    let paging = false
    let timer = 0

    const settle = () => {
      window.clearTimeout(timer)
      // Cooldown so the trailing momentum of the same gesture cannot
      // immediately page a second screen.
      timer = window.setTimeout(() => {
        paging = false
      }, 150)
    }

    const onScrollEnd = () => {
      if (paging) settle()
    }

    const onWheel = (event: WheelEvent) => {
      if (!snapViewport.matches || event.ctrlKey || event.deltaY === 0) return
      if (paging) {
        event.preventDefault() // swallow the gesture's tail mid-glide
        return
      }
      const screens = document.querySelectorAll<HTMLElement>('.snap-screen')
      if (screens.length === 0) return
      /* Screens can be taller than the viewport (services is), so an index
         derived from innerHeight drifts inside them — locate the current
         screen by real geometry instead: the last one whose top is at or
         above the viewport top. */
      let current = 0
      screens.forEach((screen, index) => {
        if (screen.getBoundingClientRect().top <= EPSILON) current = index
      })
      const rect = screens[current].getBoundingClientRect()
      const aligned = Math.abs(rect.top) <= EPSILON
      /* Any screen can be taller than the viewport (hero is on short
         laptop viewports, services usually is), so paging must never skip
         unseen content. Down steps through an over-tall screen at most one
         viewport at a time, stopping at its bottom edge — a straight jump
         to the edge would itself skip a band whenever the screen is taller
         than two viewports. Only a fully-viewed screen advances to the
         next screen's top. Up from inside a screen realigns to that
         screen's own top; only an already-aligned viewport pages to the
         previous screen. Every stop keeps the over-tall snap area covering
         the viewport (the clamp never scrolls past the bottom edge), so
         mandatory snap accepts each intermediate position. */
      const unseenBelow = rect.bottom - window.innerHeight > EPSILON
      let scroll: (() => void) | undefined
      if (event.deltaY > 0) {
        if (unseenBelow) {
          const top =
            window.scrollY +
            Math.min(window.innerHeight, rect.bottom - window.innerHeight)
          scroll = () => window.scrollTo({ top, behavior: 'auto' })
        } else {
          const next = screens[current + 1]
          if (next) scroll = () => next.scrollIntoView({ behavior: 'auto' })
        }
      } else {
        const target = aligned ? screens[current - 1] : screens[current]
        if (target) scroll = () => target.scrollIntoView({ behavior: 'auto' })
      }
      if (!scroll) return // past the edges: native scroll (and snap) rule
      event.preventDefault()
      paging = true
      // Failsafe unlock for browsers without the scrollend event.
      timer = window.setTimeout(() => {
        paging = false
      }, 1200)
      /* 'auto' (in both ScrollOptions and scrollIntoView) resolves to the
         scroller's computed scroll-behavior: the base html rule gives
         smooth, prefers-reduced-motion flips it to instant — CSS stays the
         single owner of that decision. */
      scroll()
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
