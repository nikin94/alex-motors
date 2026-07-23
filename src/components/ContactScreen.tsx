import { FaClock, FaLocationDot, FaPhone, FaRoute } from 'react-icons/fa6'

import { Button } from './Button'
import { ContactForm } from './ContactForm'
import { WallStencil } from './WallStencil'
import { ADDRESS_LINES, DIRECTIONS_URL, HOURS, PHONE_DISPLAY, PHONE_E164 } from '../config/business'
import { useI18n } from '../i18n/context'

/* Last screen: contact details and the enquiry form side by side — the
   address/hours/phone card and the form are two halves of the same question,
   how to reach us. On mobile they stack and the language switcher moves into
   a centred footer here so the top-right corner stays clear for thumbs. */

function InfoRow({ Icon, children }: { Icon: typeof FaClock; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-amber-400/10">
        <Icon aria-hidden className="size-5 text-amber-300" />
      </span>
      <div>{children}</div>
    </div>
  )
}

const rowHeading = 'font-display text-xl tracking-[0.08em] text-amber-50'

export function ContactScreen() {
  const { t } = useI18n()

  return (
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
            <InfoRow Icon={FaLocationDot}>
              <h3 className={rowHeading}>{t.location.workshop}</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-300 sm:text-base">
                {ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </InfoRow>

            <InfoRow Icon={FaClock}>
              <h3 className={rowHeading}>{t.location.openingHours}</h3>
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
            </InfoRow>

            <InfoRow Icon={FaPhone}>
              <h3 className={rowHeading}>{t.location.callUs}</h3>
              <a
                href={`tel:${PHONE_E164}`}
                className="mt-1 inline-block text-sm text-amber-50/90 transition-colors hover:text-amber-50 sm:text-base"
              >
                {PHONE_DISPLAY}
              </a>
              <p className="mt-1 text-xs text-amber-200/80 sm:text-sm">{t.contact.freeQuote}</p>
            </InfoRow>
          </div>

          {/* Bottom-pinned, with a spacer mirroring the form's note line so
              this button and the form's Send sit at the same level. */}
          <Button href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="mt-6">
            <FaRoute aria-hidden className="size-4" />
            {t.location.getDirections}
          </Button>
          <p aria-hidden className="mt-2 hidden min-h-4 lg:block" />
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
