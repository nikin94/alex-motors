import {
  FaChevronDown,
  FaClock,
  FaInstagram,
  FaLocationDot,
  FaPhone,
  FaQuoteLeft,
  FaRoute,
  FaTelegram,
  FaTiktok,
  FaViber,
  FaWhatsapp,
} from 'react-icons/fa6'

import logoCar from './assets/logo-car.webp'
import { Button } from './components/Button'
import { ContactForm } from './components/ContactForm'
import { WallStencil } from './components/WallStencil'
import { Faq } from './components/Faq'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ReviewsCarousel } from './components/ReviewsCarousel'
import { ServicesShowcase } from './components/ServicesShowcase'
import { StickyCall } from './components/StickyCall'
import { useI18n } from './i18n/context'

const PHONE_E164 = '+353852896539'
const PHONE_DISPLAY = '+353 85 289 6539'
const WHATSAPP_URL = `https://wa.me/${PHONE_E164.slice(1)}`

const newTab = { target: '_blank', rel: 'noopener noreferrer' }

// Viber deep link intentionally has no target: with `_blank`, desktops
// without Viber installed would open a dead empty tab.
const contactLinks = [
  { name: 'WhatsApp', href: WHATSAPP_URL, Icon: FaWhatsapp, ...newTab },
  { name: 'Viber', href: `viber://chat?number=${encodeURIComponent(PHONE_E164)}`, Icon: FaViber },
  { name: 'Telegram', href: 'https://t.me/Alex_Motors_ie', Icon: FaTelegram, ...newTab },
  { name: 'Instagram', href: 'https://www.instagram.com/alex.vag.motors', Icon: FaInstagram, ...newTab },
  { name: 'TikTok', href: 'https://www.tiktok.com/@alex.motorsport.ie', Icon: FaTiktok, ...newTab },
]

// Killea is the physical townland; the meta/copy targets Derry because the
// workshop sits on the border minutes from Derry city, where the search demand
// is. Address is a proper noun and stays untranslated; only the labels localise.
const ADDRESS_LINES = ['Altaghaderry, Killea', 'Co. Donegal, F93 P768']
const HOURS = { weekdays: '9:00–17:00', saturday: '9:00–13:00' }
// Townland-level coordinate from OSM Nominatim geocoding of "Altaghaderry, Killea".
// TODO: owner to confirm the pin sits on the actual workshop entrance.
const GEO = { lat: 54.9878, lng: -7.409 }
const MAP_QUERY = 'Alex Motors, Altaghaderry, Killea, Co. Donegal, F93 P768'
// api=1 directions deep-link keyed on the address string, so it resolves in
// Google Maps regardless of the pin's exact coordinate. Powers the Get
// Directions button.
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAP_QUERY,
)}`
// A place/search URL — a map *of* the location, which is what schema.org
// hasMap expects (the directions deep-link above is an action, not a map).
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_QUERY,
)}`

// Schema.org is language-independent structured data, so it stays in English
// regardless of the UI language.
const localBusinessJsonLd = {
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
  sameAs: contactLinks
    .filter(({ name }) => name === 'Instagram' || name === 'TikTok')
    .map(({ href }) => href),
}

function App() {
  const { t } = useI18n()

  return (
    <main className="brick-wall">
      <LanguageSwitcher />
      <StickyCall phoneE164={PHONE_E164} whatsappUrl={WHATSAPP_URL} />

      <section className="snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-4 py-12">
        <div className="lamp-glow flicker intro-ignite pointer-events-none absolute inset-0" />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="intro-veil pointer-events-none absolute inset-0" />

        <div className="relative text-center">
          <span aria-hidden className="sign-backdrop intro-ignite pointer-events-none absolute -inset-x-[12%] -inset-y-[16%]" />
          <h1 className="relative inline-block">
            <img
              src={logoCar}
              alt=""
              aria-hidden
              width={1280}
              height={853}
              className="sign-glow flicker intro-ignite pointer-events-none absolute inset-0"
            />
            <img
              src={logoCar}
              alt=""
              aria-hidden
              width={1280}
              height={853}
              className="sign-edge intro-ignite pointer-events-none absolute inset-0"
            />
            <img
              src={logoCar}
              alt="Alex Motors"
              width={1280}
              height={853}
              fetchPriority="high"
              className="sign-mark intro-ignite relative w-[min(88vw,40rem)]"
            />
          </h1>
          <p className="sign-tagline intro-rise font-display relative mt-8 flex flex-col items-center gap-2 text-center">
            <span lang="en" className="text-3xl tracking-[0.35em] sm:text-4xl sm:tracking-[0.4em]">
              {t.tagline.top}
            </span>
            <span className="text-xl tracking-[0.3em] sm:text-2xl sm:tracking-[0.38em]">
              {t.tagline.bottom}
            </span>
          </p>
        </div>

        <div className="intro-rise-late relative flex flex-col items-center gap-6">
          <a
            href={`tel:${PHONE_E164}`}
            className="font-display text-3xl tracking-[0.15em] text-amber-50/90 transition-colors hover:text-amber-50 sm:text-4xl"
          >
            {PHONE_DISPLAY}
          </a>
          <ul className="flex items-center gap-3 sm:gap-4">
            {contactLinks.map(({ name, href, Icon, ...linkProps }) => (
              <li key={name}>
                <a
                  href={href}
                  {...linkProps}
                  aria-label={name}
                  title={name}
                  className="flex size-11 items-center justify-center rounded-full border border-amber-100/25 text-amber-50/80 transition-colors hover:border-amber-100/70 hover:text-amber-50"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#services"
          aria-label={t.a11y.scrollToServices}
          className="intro-rise-late absolute bottom-5 hidden p-2 text-amber-100/50 transition-colors hover:text-amber-100 md:block"
        >
          <FaChevronDown className="size-5 motion-safe:animate-bounce" />
        </a>
      </section>

      <section
        id="services"
        className="services-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 py-10"
      >
        {/* The sign's car artwork, back on the wall as faded paint — the
            watermark this screen carried before the photo redesign. Tucked
            into the bottom-right corner, nosing under the showcase panel
            (which paints above it via `relative`). */}
        <WallStencil className="-right-[1%] bottom-[3%] w-[min(42vw,36rem)]">
          <img src={logoCar} alt="" width={1280} height={853} loading="lazy" />
        </WallStencil>
        <ServicesShowcase />
        <a
          href="#reviews"
          aria-label={t.a11y.scrollToReviews}
          className="absolute bottom-5 hidden p-2 text-amber-100/40 transition-colors hover:text-amber-100 md:block"
        >
          <FaChevronDown className="size-5 motion-safe:animate-bounce" />
        </a>
      </section>

      {/* Reviews get a screen of their own between the services and the
          contact details. Quotes are in-house drafts until real ones land. */}
      <section
        id="reviews"
        className="reviews-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-4 py-12"
      >
        <WallStencil className="left-[3%] top-[10%] -rotate-6">
          <FaQuoteLeft className="size-56" />
        </WallStencil>
        <header className="relative text-center">
          <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
            {t.reviews.heading}
          </h2>
        </header>

        <ReviewsCarousel />

        <a
          href="#faq"
          aria-label={t.a11y.scrollToFaq}
          className="absolute bottom-5 hidden p-2 text-amber-100/40 transition-colors hover:text-amber-100 md:block"
        >
          <FaChevronDown className="size-5 motion-safe:animate-bounce" />
        </a>
      </section>

      {/* FAQ in the services screen's master-detail language; the Q&A copy is
          an in-house draft built on owner-confirmed facts. */}
      <section
        id="faq"
        className="faq-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-4 py-12"
      >
        {/* The question mark is a glyph from the display face, so the stencil
            reads as the same "hand" that painted the sign lettering. */}
        <WallStencil className="right-[5%] top-[2%] rotate-6">
          <span className="font-display text-[24rem] leading-none">?</span>
        </WallStencil>
        <header className="relative text-center">
          <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
            {t.faq.heading}
          </h2>
        </header>

        <Faq />

        <a
          href="#contact"
          aria-label={t.a11y.scrollToContact}
          className="absolute bottom-5 hidden p-2 text-amber-100/40 transition-colors hover:text-amber-100 md:block"
        >
          <FaChevronDown className="size-5 motion-safe:animate-bounce" />
        </a>
      </section>

      {/* Contact details and the enquiry form share the last screen: the
          address/hours/phone card and the form are two halves of the same
          question — how to reach us. */}
      <section
        id="contact"
        className="contact-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 pt-12 pb-20"
      >
        <WallStencil className="bottom-[8%] left-[3%] rotate-6">
          <FaPhone className="size-52" />
        </WallStencil>
        <header className="relative text-center">
          <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
            {t.contact.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-400 sm:text-base">
            {t.contact.subtitle}
          </p>
        </header>

        <div className="relative grid w-full max-w-4xl justify-items-center gap-6 lg:grid-cols-2 lg:items-stretch lg:justify-items-stretch">
        <div className="flex w-full max-w-md flex-col rounded-lg border border-amber-100/15 bg-black/55 p-6 sm:p-8 lg:max-w-none">
          <div className="my-auto flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-amber-400/10">
                <FaLocationDot aria-hidden className="size-5 text-amber-300" />
              </span>
              <div>
                <h3 className="font-display text-xl tracking-[0.08em] text-amber-50">
                  {t.location.workshop}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-300 sm:text-base">
                  {ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-amber-400/10">
                <FaClock aria-hidden className="size-5 text-amber-300" />
              </span>
              <div>
                <h3 className="font-display text-xl tracking-[0.08em] text-amber-50">
                  {t.location.openingHours}
                </h3>
                <dl className="mt-1 space-y-0.5 text-sm text-stone-300 sm:text-base">
                  <div className="flex justify-between gap-6">
                    <dt>{t.location.days.weekdays}</dt>
                    <dd>{HOURS.weekdays}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt>{t.location.days.saturday}</dt>
                    <dd>{HOURS.saturday}</dd>
                  </div>
                  <div className="flex justify-between gap-6 text-stone-500">
                    <dt>{t.location.days.sunday}</dt>
                    <dd>{t.location.days.closed}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-amber-400/10">
                <FaPhone aria-hidden className="size-5 text-amber-300" />
              </span>
              <div>
                <h3 className="font-display text-xl tracking-[0.08em] text-amber-50">
                  {t.location.callUs}
                </h3>
                <a
                  href={`tel:${PHONE_E164}`}
                  className="mt-1 inline-block text-sm text-amber-50/90 transition-colors hover:text-amber-50 sm:text-base"
                >
                  {PHONE_DISPLAY}
                </a>
                <p className="mt-1 text-xs text-amber-200/80 sm:text-sm">
                  {t.contact.freeQuote}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom-pinned, with a spacer mirroring the form's note line so
              this button and the form's Send sit at the same level. */}
          <Button href={DIRECTIONS_URL} {...newTab} className="mt-6">
            <FaRoute aria-hidden className="size-4" />
            {t.location.getDirections}
          </Button>
          <p aria-hidden className="mt-2 hidden min-h-4 lg:block" />
        </div>

        <ContactForm />
        </div>

        {/* Language switcher lives in the top-right corner on desktop; on mobile
            it moves to a centred footer on the last screen so the corner stays
            clear. */}
        <div className="absolute inset-x-0 bottom-6">
          <LanguageSwitcher variant="footer" />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </main>
  )
}

export default App
