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
      const aligned =
        Math.abs(screens[current].getBoundingClientRect().top) <= EPSILON
      /* Down always pages to the next screen's top. Skipping the unseen
         content of an over-tall screen is safe only because such a screen
         is last — no next screen means the wheel stays native. A future
         over-tall middle screen needs "page to its bottom edge first"
         handling here. Up from inside a screen realigns to that screen's
         own top; only an already-aligned viewport pages to the previous
         screen. */
      const target =
        event.deltaY > 0
          ? screens[current + 1]
          : aligned
            ? screens[current - 1]
            : screens[current]
      if (!target) return // past the edges: native scroll (and snap) rule
      event.preventDefault()
      paging = true
      // Failsafe unlock for browsers without the scrollend event.
      timer = window.setTimeout(() => {
        paging = false
      }, 1200)
      /* 'auto' resolves to the scroller's computed scroll-behavior: the base
         html rule gives smooth, prefers-reduced-motion flips it to instant —
         CSS stays the single owner of that decision. */
      target.scrollIntoView({ behavior: 'auto' })
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
