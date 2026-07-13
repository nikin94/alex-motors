import { useRef, useState, type KeyboardEvent } from 'react'

import { useI18n } from './i18n/context'
import type { ServiceId } from './i18n/dictionary'

import nctPhoto from './assets/services/nct.webp'
import servicingPhoto from './assets/services/servicing.webp'
import diagnosticsPhoto from './assets/services/diagnostics.webp'
import enginePhoto from './assets/services/engine.webp'
import timingPhoto from './assets/services/timing.webp'
import brakesPhoto from './assets/services/brakes.webp'
import electricsPhoto from './assets/services/electrics.webp'

/* Interactive services: a list of title tiles is a tablist; selecting one swaps
   the photo behind the single detail panel and its title/description. Pre-NCT is
   the first, default-selected tab so the local hook still leads. All panels stay
   in the DOM (inactive ones inert + aria-hidden) so every service description is
   crawlable and the panel height doesn't jump — a crossfade, not a reflow.
   The copy sits on a dark scrim + blurred backing so it stays legible over any
   photo, however bright. */

type TabId = ServiceId | 'nct'

const TAB_ORDER: TabId[] = [
  'nct',
  'servicing',
  'diagnostics',
  'engine',
  'timing',
  'brakes',
  'electrics',
]

const PHOTOS: Record<TabId, string> = {
  nct: nctPhoto,
  servicing: servicingPhoto,
  diagnostics: diagnosticsPhoto,
  engine: enginePhoto,
  timing: timingPhoto,
  brakes: brakesPhoto,
  electrics: electricsPhoto,
}

export function ServicesShowcase() {
  const { t } = useI18n()
  const [active, setActive] = useState<TabId>('nct')
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  // 'nct' copy comes from the Pre-NCT highlight; the rest from the service items.
  const copy = (id: TabId) =>
    id === 'nct'
      ? { title: t.services.preNct.title, description: t.services.preNct.body }
      : t.services.items[id]

  const onKeyDown = (event: KeyboardEvent) => {
    const i = TAB_ORDER.indexOf(active)
    let next = i
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % TAB_ORDER.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (i - 1 + TAB_ORDER.length) % TAB_ORDER.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TAB_ORDER.length - 1
    else return
    event.preventDefault()
    const id = TAB_ORDER[next]
    setActive(id)
    tabRefs.current[id]?.focus()
  }

  return (
    <>
      <header className="relative text-center">
        <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
          {t.services.heading}
        </h2>
      </header>

      <div className="grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-stretch">
        <div
          role="tablist"
          aria-label={t.services.heading}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-1"
        >
          {TAB_ORDER.map((id) => {
            const selected = id === active
            return (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[id] = el
                }}
                type="button"
                role="tab"
                id={`service-tab-${id}`}
                aria-selected={selected}
                aria-controls={`service-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(id)}
                className={`rounded-lg border px-4 py-3 text-left font-display text-base tracking-[0.06em] transition-colors sm:text-lg ${
                  selected
                    ? 'border-amber-300/60 bg-amber-400/10 text-amber-50'
                    : 'border-amber-100/15 bg-black/40 text-amber-50/70 hover:border-amber-100/40 hover:text-amber-50'
                }`}
              >
                {copy(id).title}
              </button>
            )
          })}
        </div>

        {/* All panels share one grid cell and crossfade; the tallest sets the
            height so switching never reflows the screen. */}
        <div className="grid min-h-[18rem] overflow-hidden rounded-lg border border-amber-100/15 bg-black/50 sm:min-h-[24rem]">
          {TAB_ORDER.map((id) => {
            const selected = id === active
            const { title, description } = copy(id)
            return (
              <div
                key={id}
                role="tabpanel"
                id={`service-panel-${id}`}
                aria-labelledby={`service-tab-${id}`}
                aria-hidden={!selected}
                inert={!selected}
                tabIndex={selected ? 0 : undefined}
                className={`relative col-start-1 row-start-1 flex flex-col justify-end motion-safe:transition-opacity motion-safe:duration-300 ${
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <img
                  src={PHOTOS[id]}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
                {/* Tone the photo into the dark scene, then darken hard toward the
                    copy at the bottom so the text keeps its contrast. */}
                <div className="pointer-events-none absolute inset-0 bg-black/25" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                <div className="relative m-5 max-w-2xl rounded-md bg-black/40 p-4 backdrop-blur-sm sm:m-7 sm:p-5">
                  <h3 className="font-display text-2xl tracking-[0.08em] text-amber-50 sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-100 sm:text-base">
                    {description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
