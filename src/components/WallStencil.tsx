import type { ReactNode } from 'react'

/* A ghost mark "painted" on the brick wall — the treatment the old services
   watermark used (washed down to a few percent opacity, desaturated), applied
   to one theme mark per screen so empty wall areas read alive but quiet.
   Purely decorative: hidden from the a11y tree, never intercepts input, and
   drawn only on desktop viewports — phone screens are dense enough already.
   Positioned absolutely, so every in-flow sibling that must paint above it
   carries `relative` (positioned boxes otherwise paint over in-flow text). */
export function WallStencil({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className={`wall-stencil pointer-events-none absolute hidden select-none md:block ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
