/* Every real-world fact about the business in one module — phone, address,
   hours, links, coordinates and the JSON-LD built from them — so a changed
   phone number or opening time is a one-file edit, never a hunt through JSX.
   Pure data: no React, no icons (screens map link names to icons themselves). */

export const PHONE_E164 = '+353852896539'
export const PHONE_DISPLAY = '+353 85 289 6539'
export const WHATSAPP_URL = `https://wa.me/${PHONE_E164.slice(1)}`

/* Viber's deep link is intentionally not `external`: opened in a new tab on a
   desktop without Viber installed it would leave a dead empty tab behind. */
export const CONTACT_LINKS = [
  { name: 'WhatsApp', href: WHATSAPP_URL, external: true },
  { name: 'Viber', href: `viber://chat?number=${encodeURIComponent(PHONE_E164)}`, external: false },
  { name: 'Telegram', href: 'https://t.me/Alex_Motors_ie', external: true },
  { name: 'Instagram', href: 'https://www.instagram.com/alex.vag.motors', external: true },
  { name: 'TikTok', href: 'https://www.tiktok.com/@alex.motorsport.ie', external: true },
] as const

export type ContactLinkName = (typeof CONTACT_LINKS)[number]['name']

/* Killea is the physical townland; the meta/copy targets Derry because the
   workshop sits on the border minutes from Derry city, where the search demand
   is. Address is a proper noun and stays untranslated; only the labels localise. */
export const ADDRESS_LINES = ['Altaghaderry, Killea', 'Co. Donegal, F93 P768']
export const HOURS = { weekdays: '9:00–17:00', saturday: '9:00–13:00' }
// Townland-level coordinate from OSM Nominatim geocoding of "Altaghaderry, Killea".
// TODO: owner to confirm the pin sits on the actual workshop entrance.
const GEO = { lat: 54.9878, lng: -7.409 }
const MAP_QUERY = 'Alex Motors, Altaghaderry, Killea, Co. Donegal, F93 P768'
// api=1 directions deep-link keyed on the address string, so it resolves in
// Google Maps regardless of the pin's exact coordinate. Powers the Get
// Directions button.
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAP_QUERY,
)}`
// A place/search URL — a map *of* the location, which is what schema.org
// hasMap expects (the directions deep-link above is an action, not a map).
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

// Schema.org is language-independent structured data, so it stays in English
// regardless of the UI language.
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Alex Motors',
  // Planned production domain (see canonical/OG in index.html); one host to change if it ships elsewhere.
  url: 'https://alex-motors.ie/',
  image: 'https://alex-motors.ie/og-image.jpg',
  telephone: PHONE_E164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Altaghaderry',
    addressLocality: 'Killea',
    addressRegion: 'Co. Donegal',
    postalCode: 'F93 P768',
    addressCountry: 'IE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: GEO.lat,
    longitude: GEO.lng,
  },
  hasMap: MAP_URL,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '13:00',
    },
  ],
  sameAs: CONTACT_LINKS.filter(({ name }) => name === 'Instagram' || name === 'TikTok').map(
    ({ href }) => href,
  ),
}
