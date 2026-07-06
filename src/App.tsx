import {
  FaCarBattery,
  FaChevronDown,
  FaClipboardCheck,
  FaGaugeHigh,
  FaGears,
  FaInstagram,
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

// Placeholder copy until the real services content lands (tracked in the backlog).
const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const services = [
  { title: 'Diagnostics', Icon: FaGaugeHigh },
  { title: 'Engine Repair', Icon: FaGears },
  { title: 'Oil & Maintenance', Icon: FaOilCan },
  { title: 'Brakes & Suspension', Icon: FaScrewdriverWrench },
  { title: 'Battery & Electrics', Icon: FaCarBattery },
  { title: 'Pre-NCT Check', Icon: FaClipboardCheck },
]

function App() {
  useWheelPaging()

  return (
    <main>
      <section className="brick-wall snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-4 py-12">
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
        className="services-bg snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-16"
      >
        <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
          Our Services
        </h2>
        <ul className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, Icon }) => (
            <li
              key={title}
              className="rounded-lg border border-amber-100/15 bg-black/30 p-6 transition-colors hover:border-amber-100/40"
            >
              <Icon aria-hidden className="size-7 text-amber-300/80" />
              <h3 className="font-display mt-4 text-2xl tracking-[0.08em] text-amber-50">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">{LOREM}</p>
            </li>
          ))}
        </ul>
        {/* Site footer (language switcher, address, hours) will live at the bottom of this screen. */}
      </section>

      {/* Coming next: address + map, opening hours, footer with language switcher */}
    </main>
  )
}

export default App
