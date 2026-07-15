import { useEffect, useRef, useState } from 'react'

/* One-shot reveal trigger: `revealed` flips true the first time the element
   scrolls into view (screens below the fold on load), then the observer
   disconnects so the animation never replays on scroll back. Pairs with the
   `.tiles-in` / `.tile-reveal` classes in index.css — shared by the services
   tablist and the FAQ tiles so both screens enter the same way. */
export function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, revealed }
}
