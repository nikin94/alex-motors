import { FaInstagram, FaTelegram, FaTiktok, FaViber, FaWhatsapp } from 'react-icons/fa6'

import logoCar from './assets/logo-car.jpg'

const PHONE_E164 = '+353852896539'
const PHONE_DISPLAY = '+353 85 289 6539'

const contactLinks = [
  { name: 'WhatsApp', href: 'https://wa.me/353852896539', Icon: FaWhatsapp },
  { name: 'Viber', href: 'viber://chat?number=%2B353852896539', Icon: FaViber },
  { name: 'Telegram', href: 'https://t.me/+353852896539', Icon: FaTelegram },
  { name: 'Instagram', href: 'https://www.instagram.com/alex.vag.motors', Icon: FaInstagram },
  { name: 'TikTok', href: 'https://www.tiktok.com/@alex.motorsport.ie', Icon: FaTiktok },
]

function App() {
  return (
    <main>
      <section className="brick-wall relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-4 py-12">
        <div className="lamp-glow flicker pointer-events-none absolute inset-0" />
        <div className="vignette pointer-events-none absolute inset-0" />

        <h1 className="sr-only">Alex Motors — Auto Repair &amp; Service</h1>

        <div className="flicker relative text-center">
          <img
            src={logoCar}
            alt="Alex Motors — car silhouette logo"
            width={1280}
            height={853}
            fetchPriority="high"
            className="sign-panel w-[min(88vw,40rem)]"
          />
          <p className="font-display mt-8 text-xl tracking-[0.45em] text-amber-100/60 sm:text-2xl">
            Auto Repair &amp; Service
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-6">
          <a
            href={`tel:${PHONE_E164}`}
            className="font-display text-3xl tracking-[0.15em] text-amber-50/90 transition-colors hover:text-amber-50 sm:text-4xl"
          >
            {PHONE_DISPLAY}
          </a>
          <ul className="flex items-center gap-3 sm:gap-4">
            {contactLinks.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
      </section>

      {/* Coming next: services, address + map, opening hours */}
    </main>
  )
}

export default App
