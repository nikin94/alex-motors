import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// Dark-theme overrides must load after Leaflet's own sheet to win the cascade;
// keeping this import last guarantees that order inside the lazy chunk.
import './LocationMap.css'

type Props = {
  lat: number
  lng: number
  // Marker tooltip — the brand name, kept as-is in every language.
  markerTitle: string
  // Localised region label announced to screen readers.
  ariaLabel: string
}

/* An amber teardrop pin drawn as a divIcon: it matches the sign palette and
   sidesteps Leaflet's default marker assets, which break under bundlers
   because their icon URLs resolve relative to the CSS, not the app. */
const pinIcon = L.divIcon({
  className: 'location-pin',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 0C6.7 0 0 6.6 0 14.8 0 25.9 15 40 15 40s15-14.1 15-25.2C30 6.6 23.3 0 15 0z" fill="#ffb347"/>
    <circle cx="15" cy="14.5" r="5.5" fill="#0b0a09"/>
  </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
})

/* Dark, key-free basemap (CARTO dark) so the map reads as part of the night
   scene instead of a bright rectangle. scrollWheelZoom stays off on purpose:
   the page owns the wheel for full-page paging, so wheel-zoom here would fight
   it — desktop +/- controls, drag-pan and pinch-zoom remain. Drag is disabled
   on touch (dragging: !L.Browser.mobile) so a finger swiping down the
   full-width map pages the screen instead of getting trapped panning the map;
   pinch-zoom (touchZoom) still works. */
export default function LocationMap({ lat, lng, markerTitle, ariaLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const map = L.map(el, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    L.marker([lat, lng], { icon: pinIcon, title: markerTitle, keyboard: false }).addTo(map)

    /* OSM/CARTO attribution is provider-mandated, not our copy — mark it
       translate="no" so Chrome's full-page autotranslate leaves the legally
       required text intact once <html lang> switches to a non-English locale. */
    map.attributionControl.getContainer()?.setAttribute('translate', 'no')

    return () => {
      map.remove()
    }
  }, [lat, lng, markerTitle])

  return <div ref={containerRef} role="region" aria-label={ariaLabel} className="size-full" />
}
