/* Neon line-art illustrations, one per service, drawn in the sign's amber-on-dark
   language. They are the swappable "hero image" of the interactive services panel:
   a real workshop photo can later drop into the same slot per service. currentColor
   carries the amber so the shared .service-art glow (index.css) applies to all. */
import type { ReactElement, SVGProps } from 'react'

import type { ServiceId } from './i18n/dictionary'

// Derived from the dictionary's ServiceId (+ the Pre-NCT lead) so a new service
// added there forces a compile error here until it gets a tab, icon and art —
// never a silent drop. Same single-source-of-truth as isLang/LANGS.
export type ArtId = ServiceId | 'nct'

const stroke: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 4.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const paths: Record<ArtId, ReactElement> = {
  // Clipboard with two checked-off lines — inspection / NCT.
  nct: (
    <>
      <rect x="44" y="30" width="72" height="70" rx="6" />
      <rect x="66" y="24" width="28" height="12" rx="3" />
      <path d="M56 54l6 6 11-13" />
      <line x1="82" y1="53" x2="104" y2="53" />
      <path d="M56 78l6 6 11-13" />
      <line x1="82" y1="77" x2="104" y2="77" />
    </>
  ),
  // Oil drop with an inner shine arc — car servicing / oil & fluids.
  servicing: (
    <>
      <path d="M80 26c0 0 30 33 30 51a30 30 0 0 1-60 0c0-18 30-51 30-51z" />
      <path d="M64 80a15 15 0 0 0 11 12" />
    </>
  ),
  // Tachometer gauge with a needle — diagnostics.
  diagnostics: (
    <>
      <circle cx="80" cy="60" r="38" />
      <line x1="80" y1="26" x2="80" y2="33" />
      <line x1="46" y1="60" x2="53" y2="60" />
      <line x1="114" y1="60" x2="107" y2="60" />
      <line x1="56" y1="36" x2="61" y2="41" />
      <line x1="104" y1="36" x2="99" y2="41" />
      <line x1="80" y1="60" x2="101" y2="43" />
      <circle cx="80" cy="60" r="4" />
    </>
  ),
  // Block with two cylinders and a side intake — engine repair.
  engine: (
    <>
      <rect x="30" y="52" width="82" height="42" rx="6" />
      <rect x="44" y="32" width="20" height="20" rx="3" />
      <rect x="72" y="32" width="20" height="20" rx="3" />
      <path d="M112 60h22a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-22" />
      <line x1="20" y1="70" x2="30" y2="70" />
      <line x1="52" y1="52" x2="52" y2="94" />
      <line x1="70" y1="52" x2="70" y2="94" />
      <line x1="88" y1="52" x2="88" y2="94" />
    </>
  ),
  // Two pulleys wrapped by a belt — timing belt & chain.
  timing: (
    <>
      <circle cx="54" cy="60" r="22" />
      <circle cx="110" cy="62" r="14" />
      <circle cx="54" cy="60" r="6" />
      <circle cx="110" cy="62" r="5" />
      <line x1="53" y1="38" x2="106" y2="49" />
      <line x1="55" y1="82" x2="112" y2="75" />
    </>
  ),
  // Drilled brake disc with a caliper straddling the top — brakes & suspension.
  brakes: (
    <>
      <circle cx="80" cy="62" r="38" />
      <circle cx="80" cy="62" r="13" />
      <circle cx="80" cy="34" r="2.6" />
      <circle cx="80" cy="90" r="2.6" />
      <circle cx="52" cy="62" r="2.6" />
      <circle cx="108" cy="62" r="2.6" />
      <circle cx="61" cy="43" r="2.6" />
      <circle cx="99" cy="43" r="2.6" />
      <circle cx="61" cy="81" r="2.6" />
      <circle cx="99" cy="81" r="2.6" />
      <path d="M60 24h40a9 9 0 0 1 9 9v6a9 9 0 0 1-9 9H60a9 9 0 0 1-9-9v-6a9 9 0 0 1 9-9z" />
    </>
  ),
  // Battery with terminals and a bolt — battery & electrics.
  electrics: (
    <>
      <rect x="32" y="46" width="96" height="48" rx="6" />
      <rect x="48" y="36" width="16" height="10" rx="2" />
      <rect x="96" y="36" width="16" height="10" rx="2" />
      <line x1="50" y1="62" x2="62" y2="62" />
      <line x1="56" y1="56" x2="56" y2="68" />
      <line x1="98" y1="62" x2="110" y2="62" />
      <path d="M82 52l-9 16h9l-5 12 13-17h-9z" />
    </>
  ),
}

export function ServiceArt({ id, className }: { id: ArtId; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden {...stroke}>
      {paths[id]}
    </svg>
  )
}
