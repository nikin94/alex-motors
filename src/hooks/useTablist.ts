import { useRef, type KeyboardEvent } from 'react'

/* Roving-tabindex keyboard navigation for a vertical tablist (ArrowUp/Down,
   ArrowLeft/Right, Home, End), shared by the services showcase and the FAQ —
   both previously carried an identical copy. The caller owns the selection
   state and passes the active INDEX; `select` receives the next index and the
   hook moves focus to that tab via the ref registry it hands back.
   Wrapping matches the previous per-component behaviour: arrows cycle past
   both ends. */
export function useTablist(count: number, active: number, select: (index: number) => void) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent) => {
    let next = active
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (active + 1) % count
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (active - 1 + count) % count
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    else return
    event.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  const refFor = (index: number) => (el: HTMLButtonElement | null) => {
    tabRefs.current[index] = el
  }

  return { onKeyDown, refFor }
}
