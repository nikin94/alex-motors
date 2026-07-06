import {
  FaCarBattery,
  FaChevronDown,
  FaClipboardCheck,
  FaGaugeHigh,
  FaGears,
  FaInstagram,
  FaLink,
  FaOilCan,
  FaScrewdriverWrench,
  FaTelegram,
  FaTiktok,
  FaViber,
  FaWhatsapp,
} from 'react-icons/fa6'

import logoCar from './assets/logo-car.webp'
import { useWheelPaging } from './useWheelPaging'

const PHONE_E164 = '+353852896539'
const PHONE_DISPLAY = '+353 85 289 6539'

const newTab = { target: '_blank', rel: 'noopener noreferrer' }

// Viber deep link intentionally has no target: with `_blank`, desktops
// without Viber installed would open a dead empty tab.
const contactLinks = [
  { name: 'WhatsApp', href: `https://wa.me/${PHONE_E164.slice(1)}`, Icon: FaWhatsapp, ...newTab },
  { name: 'Viber', href: `viber://chat?number=${encodeURIComponent(PHONE_E164)}`, Icon: FaViber },
  { name: 'Telegram', href: 'https://t.me/Alex_Motors_ie', Icon: FaTelegram, ...newTab },
  { name: 'Instagram', href: 'https://www.instagram.com/alex.vag.motors', Icon: FaInstagram, ...newTab },
  { name: 'TikTok', href: 'https://www.tiktok.com/@alex.motorsport.ie', Icon: FaTiktok, ...newTab },
]

const services = [
  {
    title: 'Car Servicing',
    Icon: FaOilCan,
    description:
      'Full and interim services for all makes and models — oil and filters, fluids, and a health check that catches problems before they get expensive.',
  },
  {
    title: 'Diagnostics',
    Icon: FaGaugeHigh,
    description:
      'Dashboard warning light? We read fault codes with dealer-level tools, find the actual cause and explain your options before any work starts.',
  },
  {
    title: 'Engine Repair',
    Icon: FaGears,
    description:
      'From misfires and oil leaks to major engine work — honest assessment first, then a clear quote. Daily drivers, vans and sports cars alike.',
  },
  {
    title: 'Timing Belt & Chain',
    Icon: FaLink,
    description:
      'Belt and chain replacement at the right mileage — the job that protects your engine from the most expensive failure it can have.',
  },
  {
    title: 'Brakes & Suspension',
    Icon: FaScrewdriverWrench,
    description:
      'Pads, discs, shocks, springs and bushings — everything that keeps you stopping straight and riding smooth on Donegal roads.',
  },
  {
    title: 'Battery & Electrics',
    Icon: FaCarBattery,
    description:
      'Battery testing and replacement, alternators, starters and wiring faults — including the ones that only show up on cold mornings.',
  },
]

// Killea is the physical townland; Letterkenny stays in meta/copy because that is
// where the search demand is (F93 is the Letterkenny routing key).
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Alex Motors',
  telephone: PHONE_E164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Altaghaderry',
    addressLocality: 'Killea',
    addressRegion: 'Co. Donegal',
    postalCode: 'F93 P768',
    addressCountry: 'IE',
  },
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
  useWheelPaging()

  return (
    <main className="brick-wall">
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
          <p className="sign-tagline intro-rise font-display relative mt-8 text-xl tracking-[0.45em] sm:text-2xl">
            Auto Repair &amp; Service
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
          aria-label="Scroll to services"
          className="intro-rise-late absolute bottom-5 p-2 text-amber-100/50 transition-colors hover:text-amber-100"
        >
          <FaChevronDown className="size-5 motion-safe:animate-bounce" />
        </a>
      </section>

      <section
        id="services"
        className="services-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 py-10"
      >
        <img
          src={logoCar}
          alt=""
          aria-hidden
          width={1280}
          height={853}
          loading="lazy"
          className="services-watermark pointer-events-none absolute -right-[6%] bottom-[2%] w-[min(58vw,46rem)]"
        />
        <header className="relative text-center">
          <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
            Our Services
          </h2>
        </header>

        <div className="relative w-full max-w-5xl rounded-lg border border-amber-300/35 bg-black/60 p-5 transition-colors hover:border-amber-300/60 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-amber-400/10">
              <FaClipboardCheck aria-hidden className="size-6 text-amber-300" />
            </span>
            <h3 className="font-display text-2xl tracking-[0.08em] text-amber-50 sm:text-3xl">
              Pre-NCT Check &amp; Repairs
            </h3>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Failed the NCT — or worried you might? We do a full pre-NCT inspection covering
            brakes, suspension, lights, emissions and tyres — and fix what needs fixing, so you
            go into the test ready to pass. Retest checks too.
          </p>
        </div>

        <ul className="relative grid w-full max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {services.map(({ title, Icon, description }) => (
            <li
              key={title}
              className="rounded-lg border border-amber-100/15 bg-black/55 p-4 transition-colors hover:border-amber-100/40 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-400/10 sm:size-11">
                  <Icon aria-hidden className="size-5 text-amber-300/80 sm:size-6" />
                </span>
                <h3 className="font-display text-lg tracking-[0.08em] text-amber-50 sm:text-2xl">
                  {title}
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-stone-400 sm:text-sm">
                {description}
              </p>
            </li>
          ))}
        </ul>
        {/* Site footer (language switcher, address, hours) will live at the bottom of this screen. */}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Coming next: address + map, opening hours, footer with language switcher */}
    </main>
  )
}

export default App
