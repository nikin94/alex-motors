import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

import { useIsDesktop } from '../hooks/useIsDesktop'
import { useRevealOnView } from '../hooks/useRevealOnView'
import { Button } from './Button'
import { useI18n } from '../i18n/context'
import type { ServiceId } from '../i18n/dictionary'

import nctPhoto from '../assets/services/nct.webp'
import servicingPhoto from '../assets/services/servicing.webp'
import diagnosticsPhoto from '../assets/services/diagnostics.webp'
import enginePhoto from '../assets/services/engine.webp'
import timingPhoto from '../assets/services/timing.webp'
import brakesPhoto from '../assets/services/brakes.webp'
import electricsPhoto from '../assets/services/electrics.webp'

/* Interactive services.
   Desktop (>= 768px): a vertical list of title tiles is a tablist; selecting one
   swaps the photo and copy in the single detail panel. Pre-NCT leads. All panels
   stay in the DOM (inactive ones inert + aria-hidden) so every description is
   crawlable and the panel height doesn't jump — a crossfade, not a reflow.
   Mobile (< 768px): one compact block — title with ‹ › chevrons, photo below it,
   description under the photo — so switching and reading happen in place, with no
   scrolling up to a tab list and back down. Chevrons and horizontal swipe move
   through the services as an infinite loop.
   Layout is picked by a media query (client-only SPA), so only one presentation
   is ever in the DOM — no duplicated description text. */

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

const SWIPE_THRESHOLD = 40

export function ServicesShowcase() {
  const { t } = useI18n()
  const isDesktop = useIsDesktop()
  const [active, setActive] = useState<TabId>('nct')

  // 'nct' copy comes from the Pre-NCT highlight; the rest from the service items.
  const copy = (id: TabId) =>
    id === 'nct'
      ? { title: t.services.preNct.title, description: t.services.preNct.body }
      : t.services.items[id]

  const step = (dir: 1 | -1) => {
    const i = TAB_ORDER.indexOf(active)
    setActive(TAB_ORDER[(i + dir + TAB_ORDER.length) % TAB_ORDER.length])
  }

  return (
    <>
      <header className="relative text-center">
        <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
          {t.services.heading}
        </h2>
        {/* whitespace-pre-line honours the dictionary's \n: the call-outs
            promise sits on its own line under the makes/models line. */}
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed whitespace-pre-line text-stone-400 sm:text-base">
          {t.services.subtitle}
        </p>
      </header>

      {isDesktop ? (
        <DesktopTabs active={active} setActive={setActive} copy={copy} />
      ) : (
        <MobileSlider active={active} step={step} copy={copy} />
      )}
    </>
  )
}

type PanelCopy = { title: string; description: string }

function DesktopTabs({
  active,
  setActive,
  copy,
}: {
  active: TabId
  setActive: (id: TabId) => void
  copy: (id: TabId) => PanelCopy
}) {
  const { t } = useI18n()
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  // Staggered slide-in on first view; see useRevealOnView + index.css.
  const { ref: listRef, revealed } = useRevealOnView<HTMLDivElement>()

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
    <div className="grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-stretch">
      <div
        ref={listRef}
        role="tablist"
        aria-label={t.services.heading}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className={`grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-1 ${revealed ? 'tiles-in' : ''}`}
      >
        {TAB_ORDER.map((id, index) => {
          const selected = id === active
          return (
            <Button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el
              }}
              variant="tile"
              active={selected}
              role="tab"
              id={`service-tab-${id}`}
              aria-selected={selected}
              aria-controls={`service-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              style={{ animationDelay: `${index * 55}ms` }}
              className="tile-reveal"
            >
              {copy(id).title}
            </Button>
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
  )
}

function MobileSlider({
  active,
  step,
  copy,
}: {
  active: TabId
  step: (dir: 1 | -1) => void
  copy: (id: TabId) => PanelCopy
}) {
  const { t } = useI18n()
  const { title, description } = copy(active)
  const touchX = useRef<number | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.changedTouches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    // Swipe left → next, swipe right → previous.
    step(dx < 0 ? 1 : -1)
  }

  const arrow =
    'text-amber-100/70 transition-colors hover:text-amber-100'

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between gap-3">
        <button type="button" aria-label={t.a11y.prevService} onClick={() => step(-1)} className={arrow}>
          <FaChevronLeft className="size-4" />
        </button>
        <h3
          aria-live="polite"
          className="min-w-0 flex-1 text-center font-display text-2xl tracking-[0.06em] text-amber-50"
        >
          {title}
        </h3>
        <button type="button" aria-label={t.a11y.nextService} onClick={() => step(1)} className={arrow}>
          <FaChevronRight className="size-4" />
        </button>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg border border-amber-100/15 bg-black/50"
      >
        <img
          key={active}
          src={PHOTOS[active]}
          alt=""
          className="size-full object-cover motion-safe:animate-[fade-in_300ms_ease-out]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/15" />
      </div>

      <p className="mt-4 text-center text-sm leading-relaxed text-stone-300">{description}</p>
    </div>
  )
}
