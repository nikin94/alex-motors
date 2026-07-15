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

/* A gesture is a burst of wheel events; a longer gap starts a fresh one.
   The anchor — the scroll position the gesture began from — is captured once
   per gesture so a fast flick commits from where it STARTED, not from
   wherever native elastic drift has carried the page by the time the drift
   crosses FREE_PLAY. Without the anchor, a quick flick down an over-tall
   screen (a short-viewport hero, or services) reads its already-drifted
   geometry, finds no content left below the fold, and jumps to the next
   screen — skipping the band (the hero contacts) a slow scroll would stop
   on. Slow scrolling never drifts, so anchor == current and behaviour is
   unchanged. */
const GESTURE_GAP = 200

/* Inside the post-glide lock a wheel event is read as a NEW gesture — not the
   old one's momentum tail — when it reverses direction, or when its magnitude
   jumps to at least double the smallest tail event seen so far: momentum only
   ever decays, so a rising delta is the user flicking again. RISE_FLOOR keeps
   the 1–3px noise at a tail's very end from qualifying — and it gates the
   REVERSAL branch too: trackpad tails jitter with tiny opposite-sign events,
   and at an intermediate stop inside an over-tall screen (no elastic zone
   there) an ungated 3px reversal pages straight back — the page visibly
   bounces one screen up and then down again off one gesture. A deliberate
   reverse flick is tens of px, so the floor costs it nothing. Without this
   escape the debounce starves — a tail merging straight into fresh input
   re-arms the quiet window forever, and scrolling goes dead (both
   directions) until the trackpad falls completely silent. */
const RISE_FLOOR = 20

export function useWheelPaging() {
  useEffect(() => {
    const snapViewport = window.matchMedia('(min-width: 768px)')
    let paging = false
    let glided = false // scrollend seen for the current page turn
    let timer = 0
    let anchorY: number | null = null
    let lastTs = 0
    let lastDir = 0
    let tailDir = 0 // direction of the gesture that committed the page turn
    let tailMag = Infinity // smallest |deltaY| the tail has decayed to so far

    /* The lock lifts only once the wheel has been QUIET for this long after
       the glide ended — a debounce, not a fixed delay. A trackpad's momentum
       tail (or an eager second flick) keeps re-arming it from onWheel, so one
       physical gesture pages exactly one stop no matter how long its tail is.
       The old fixed 150ms unlocked inside longer tails and let quick
       successive flicks stack several page turns. */
    const QUIET_MS = 250

    const settle = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        paging = false
        glided = false
      }, QUIET_MS)
    }

    const onScrollEnd = () => {
      if (paging) {
        glided = true
        settle()
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (!snapViewport.matches || event.ctrlKey || event.deltaY === 0) return
      // A textarea (contact form) scrolls its own overflow — never page over it.
      if (event.target instanceof Element && event.target.closest('textarea')) return
      if (paging) {
        const mag = Math.abs(event.deltaY)
        /* Once the glide is over, a reversed or clearly rising delta is the
           user again (momentum only decays) — release the lock and let this
           very event page. During the glide everything is swallowed: geometry
           is mid-flight and the glide itself lasts a fraction of a second. */
        const fresh =
          glided &&
          mag >= RISE_FLOOR &&
          (Math.sign(event.deltaY) !== tailDir || mag > tailMag * 2)
        if (!fresh) {
          event.preventDefault() // swallow the gesture's tail mid-glide
          tailMag = Math.min(tailMag, mag)
          // Past the glide the tail keeps the lock alive: every swallowed
          // event re-arms the quiet window, so unlock waits for real
          // silence — or for the new-gesture escape above.
          if (glided) settle()
          return
        }
        window.clearTimeout(timer)
        paging = false
        glided = false
      }

      /* Capture the anchor before any native drift moves the page: the first
         wheel of a burst, the first after a gap, or the first after the wheel
         reverses direction. window.scrollY in a wheel handler still reflects
         the pre-event position. Reversing is a new gesture from wherever the
         drift left the page: without a recapture, a flick up after a small
         down-drift would inherit the down-anchor, read no unseen content above
         it, and page to the previous screen — overshooting the stop CSS snap
         would have eased back to (the mirror of the drift bug this file
         fixes). */
      const dir = Math.sign(event.deltaY)
      let anchor = anchorY
      if (
        anchor === null ||
        event.timeStamp - lastTs > GESTURE_GAP ||
        dir !== lastDir
      ) {
        anchor = window.scrollY
        anchorY = anchor
      }
      lastTs = event.timeStamp
      lastDir = dir

      const screens = document.querySelectorAll<HTMLElement>('.snap-screen')
      if (screens.length === 0) return

      /* Commit TIMING comes from the current (drifted) position: while the
         nearest snap point is within FREE_PLAY the wheel stays native so the
         page visibly gives, and CSS snap pulls it home if the gesture ends
         here. Intermediate stops inside an over-tall screen sit far from
         every screen top, so stepping there is never swallowed by the zone. */
      let nearest = Infinity
      screens.forEach((screen) => {
        nearest = Math.min(nearest, Math.abs(screen.getBoundingClientRect().top))
      })
      if (nearest < FREE_PLAY) return

      /* Commit DESTINATION is computed from the anchor, never the drifted
         position, so it is the stop a slow scroll from the same start would
         have reached. Screen edges in document space are scroll-invariant:
         scrollY + rect edge. */
      const edges = Array.from(screens, (screen) => {
        const r = screen.getBoundingClientRect()
        return { top: window.scrollY + r.top, bottom: window.scrollY + r.bottom }
      })
      let a = 0
      edges.forEach((e, i) => {
        if (e.top <= anchor + EPSILON) a = i
      })
      const { top: screenTop, bottom: screenBottom } = edges[a]
      const viewport = window.innerHeight

      /* Over-tall screens (services always, hero on short laptops) must never
         be skipped: a commit steps at most one viewport from the anchor,
         clamped to the screen's own edge, and only a fully-seen screen hands
         off to a neighbour. Down clamps to the bottom edge (the clamp keeps
         the snap area covering the viewport, so mandatory snap accepts the
         stop); up clamps to the top edge. */
      let target: number | undefined
      if (event.deltaY > 0) {
        const unseenBelow = screenBottom - (anchor + viewport) > EPSILON
        if (unseenBelow) {
          target = Math.min(anchor + viewport, screenBottom - viewport)
        } else if (edges[a + 1]) {
          target = edges[a + 1].top
        }
      } else {
        const unseenAbove = anchor - screenTop > EPSILON
        if (unseenAbove) {
          target = Math.max(anchor - viewport, screenTop)
        } else if (edges[a - 1]) {
          target = edges[a - 1].top
        }
      }
      if (target === undefined) return // past the edges: native scroll rules

      event.preventDefault()
      paging = true
      glided = false
      tailDir = dir
      tailMag = Infinity // the first tail event never reads as rising
      anchorY = null // consumed; the next burst captures a fresh anchor
      // Failsafe unlock for browsers without the scrollend event.
      timer = window.setTimeout(() => {
        paging = false
      }, 1200)
      /* 'auto' resolves to the scroller's computed scroll-behavior: the base
         html rule gives smooth, prefers-reduced-motion flips it to instant —
         CSS stays the single owner of that decision. */
      window.scrollTo({ top: target, behavior: 'auto' })
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
