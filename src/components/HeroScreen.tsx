import type { IconType } from 'react-icons'
import { FaInstagram, FaTelegram, FaTiktok, FaViber, FaWhatsapp } from 'react-icons/fa6'

import logoCar from '../assets/logo-car.webp'
import { ScrollChevron } from './ScrollChevron'
import { CONTACT_LINKS, PHONE_DISPLAY, PHONE_E164, type ContactLinkName } from '../config/business'
import { useI18n } from '../i18n/context'

/* First screen: the neon sign switching on over the brick wall, the phone
   number as the lead CTA and the messenger/social links under it. The intro-*
   classes choreograph the entrance (ignite → rise → rise-late); nothing else
   on the site animates on load, which is why this screen stays untouched by
   the wall stencils and the sticky CTA (both appear from screen two on). */

const LINK_ICONS: Record<ContactLinkName, IconType> = {
  WhatsApp: FaWhatsapp,
  Viber: FaViber,
  Telegram: FaTelegram,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
}

export function HeroScreen() {
  const { t } = useI18n()

  return (
    <section
      id="hero"
      className="snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-4 py-12"
    >
      <div className="lamp-glow flicker intro-ignite pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="intro-veil pointer-events-none absolute inset-0" />

      <div className="relative text-center">
        <span
          aria-hidden
          className="sign-backdrop intro-ignite pointer-events-none absolute -inset-x-[12%] -inset-y-[16%]"
        />
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
          {CONTACT_LINKS.map(({ name, href, external }) => {
            const Icon = LINK_ICONS[name]
            return (
              <li key={name}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={name}
                  title={name}
                  className="flex size-11 items-center justify-center rounded-full border border-amber-100/25 text-amber-50/80 transition-colors hover:border-amber-100/70 hover:text-amber-50"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <ScrollChevron
        href="#services"
        label={t.a11y.scrollToServices}
        className="intro-rise-late text-amber-100/50"
      />
    </section>
  )
}
