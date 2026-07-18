import { useRef, type TouchEvent } from 'react'

/* Horizontal swipe → prev/next, shared by the mobile services slider and the
   reviews carousel (both previously carried their own copy of this logic and
   the 40px threshold). Returns the touch handlers to spread onto the swipe
   surface. The threshold keeps taps and vertical scrolls from stepping. */
const SWIPE_THRESHOLD = 40

export function useSwipe(step: (dir: 1 | -1) => void) {
  const touchStartX = useRef<number | null>(null)

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

  return { onTouchStart, onTouchEnd }
}
