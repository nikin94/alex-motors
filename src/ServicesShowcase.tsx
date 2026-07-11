import { useRef, useState, type KeyboardEvent } from 'react'
import type { IconType } from 'react-icons'
import {
  FaCarBattery,
  FaClipboardCheck,
  FaGaugeHigh,
  FaGears,
  FaLink,
  FaOilCan,
  FaScrewdriverWrench,
} from 'react-icons/fa6'

import { ServiceArt, type ArtId } from './ServiceArt'
import { useI18n } from './i18n/context'

/* Interactive services: the grid of icon+title tiles is a tablist; selecting one
   swaps the illustration and description in the single detail panel. Pre-NCT is
   the first, default-selected tab so the local hook still leads. All panels stay
   in the DOM (inactive ones inert + aria-hidden) so every service description is
   crawlable and the panel heights don't jump — a crossfade, not a reflow. */

const TAB_ICONS: Record<ArtId, IconType> = {
  nct: FaClipboardCheck,
  servicing: FaOilCan,
  diagnostics: FaGaugeHigh,
  engine: FaGears,
  timing: FaLink,
  brakes: FaScrewdriverWrench,
  electrics: FaCarBattery,
}

const TAB_ORDER: ArtId[] = [
  'nct',
  'servicing',
  'diagnostics',
  'engine',
  'timing',
  'brakes',
  'electrics',
]

export function ServicesShowcase() {
  const { t } = useI18n()
  const [active, setActive] = useState<ArtId>('nct')
  const tabRefs = useRef<Partial<Record<ArtId, HTMLButtonElement | null>>>({})

  // 'nct' copy comes from the Pre-NCT highlight; the rest from the service items.
  const copy = (id: ArtId) =>
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

      <div className="grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-stretch">
        <div
          role="tablist"
          aria-label={t.services.heading}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-1"
        >
          {TAB_ORDER.map((id) => {
            const Icon = TAB_ICONS[id]
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
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? 'border-amber-300/60 bg-amber-400/10'
                    : 'border-amber-100/15 bg-black/40 hover:border-amber-100/40'
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md transition-colors ${
                    selected ? 'bg-amber-400/20' : 'bg-amber-400/10'
                  }`}
                >
                  <Icon
                    aria-hidden
                    className={`size-5 ${selected ? 'text-amber-200' : 'text-amber-300/70'}`}
                  />
                </span>
                <span
                  className={`font-display text-base tracking-[0.06em] sm:text-lg ${
                    selected ? 'text-amber-50' : 'text-amber-50/70'
                  }`}
                >
                  {copy(id).title}
                </span>
              </button>
            )
          })}
        </div>

        {/* All panels share one grid cell and crossfade; the tallest sets the
            height so switching never reflows the screen. */}
        <div className="grid rounded-lg border border-amber-100/15 bg-black/50">
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
                className={`col-start-1 row-start-1 flex flex-col items-center gap-5 p-6 motion-safe:transition-opacity motion-safe:duration-300 sm:flex-row sm:gap-8 sm:p-8 ${
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <ServiceArt
                  id={id}
                  className="service-art h-28 w-36 shrink-0 sm:h-36 sm:w-48"
                />
                <div className="text-center sm:text-left">
                  <h3 className="font-display text-2xl tracking-[0.08em] text-amber-50 sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-300 sm:text-base">
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
