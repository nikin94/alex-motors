import { useEffect, useState } from 'react'

/* 768px is the project's desktop boundary (matches the snap/wheel-paging media
   query in index.css). Components that render a different layout per viewport
   (services slider vs tablist, reviews page size) share this one hook so the
   JS boundary can never drift from the CSS one. */
export function useIsDesktop() {
  const query = '(min-width: 768px)'
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : true,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setIsDesktop(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}
