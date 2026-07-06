import { useEffect } from 'react'

/* Native CSS scroll snap only settles once a gesture ends, and it snaps to
   the NEAREST screen — a wheel gesture has to cross the midpoint between
   screens before it pages. On the snap viewports (>= 768px, matching the
   media query in index.css) the wheel should feel like a full-page site
   instead, but with a little give: within FREE_PLAY px of a snap point the
   wheel scrolls natively (and CSS snap eases the page back if the gesture
   ends there); once the page drifts past that, the transition completes on
   its own — no long drag to the midpoint, no dead-stiff hijack either.
   The handler owns wheel only: keyboard, scrollbar, touch and anchor
   scrolling stay native (and still snap via CSS). Ctrl+wheel is left
   alone — that's pinch-zoom on most platforms. */

/* Fractional scroll positions on HiDPI screens land within a pixel or two
   of a snap point — treat that as aligned. */
const EPSILON = 2

/* The give before a wheel gesture commits to paging: roughly one mouse-wheel
   notch (~100px in Chrome) stays in the elastic zone and snaps back, a
   second notch (or a firmer trackpad flick) completes the transition. */
const FREE_PLAY = 120

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
      let nearest = Infinity
      screens.forEach((screen, index) => {
        const top = screen.getBoundingClientRect().top
        if (top <= EPSILON) current = index
        nearest = Math.min(nearest, Math.abs(top))
      })
      /* Elastic zone: close to a snap point the wheel stays native — the
         page visibly gives, and CSS snap pulls it home if the gesture ends
         here. Only once the drift exceeds FREE_PLAY does paging take over
         and finish the transition. Intermediate stops inside an over-tall
         screen sit far from every screen top, so stepping there is never
         swallowed by the elastic zone. */
      if (nearest < FREE_PLAY) return
      const rect = screens[current].getBoundingClientRect()
      /* Any screen can be taller than the viewport (hero is on short
         laptop viewports, services usually is), so paging must never skip
         unseen content. Down steps through an over-tall screen at most one
         viewport at a time, stopping at its bottom edge — a straight jump
         to the edge would itself skip a band whenever the screen is taller
         than two viewports. Only a fully-viewed screen advances to the
         next screen's top. Every stop keeps the over-tall snap area
         covering the viewport (the clamp never scrolls past the bottom
         edge), so mandatory snap accepts each intermediate position.
         Up completes to the top of the screen the viewport is in: past the
         free-play zone below a screen top that screen is already the one
         above, so a committed upward gesture lands on the previous screen;
         from deep inside an over-tall screen it realigns to that screen's
         own top. (An exactly-aligned viewport never reaches this code —
         alignment implies nearest ≈ 0, inside the elastic zone.) */
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
        const target = screens[current]
        scroll = () => target.scrollIntoView({ behavior: 'auto' })
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
