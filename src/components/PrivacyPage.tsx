import { useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

import { PHONE_DISPLAY, PHONE_E164 } from '../config/business'
import { useI18n } from '../i18n/context'

/* Standalone /privacy page — the disclosure Cloudflare requires when Turnstile
   runs in its invisible widget mode (the visitor can't see the widget, so the
   processing has to be declared somewhere). Kept short and honest, mirroring
   the site's reality: no cookies, no trackers, the enquiry form is the only
   data collection, Cloudflare (Turnstile + edge hosting) the only third party.
   Rendered instead of the snap scene when the path is /privacy (see App.tsx);
   navigation is plain <a> full loads — two destinations don't justify a
   router. The page has no .snap-screen children, so the html-level mandatory
   snap has nothing to snap to and scrolling stays ordinary. */

const TURNSTILE_ADDENDUM = 'https://www.cloudflare.com/en-gb/turnstile-privacy-policy/'

const linkClass =
  'text-amber-200 underline underline-offset-2 transition-colors hover:text-amber-50'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl tracking-[0.1em] text-amber-50">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-300 sm:text-base">{children}</p>
    </section>
  )
}

export function PrivacyPage() {
  const { t } = useI18n()

  // One shared index.html across the SPA — give this page its own tab title.
  useEffect(() => {
    document.title = `${t.privacy.title} — Alex Motors`
  }, [t])

  return (
    <main className="brick-wall min-h-dvh">
      <div className="contact-shade min-h-dvh px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-amber-100/60 transition-colors hover:text-amber-100"
          >
            <FaArrowLeft aria-hidden className="size-3.5" />
            {t.privacy.backToSite}
          </a>

          <h1 className="font-display mt-8 text-4xl tracking-[0.2em] text-amber-50 sm:text-5xl">
            {t.privacy.title}
          </h1>
          <p className="mt-2 text-xs text-stone-500">{t.privacy.updated}</p>
          <p className="mt-6 text-sm leading-relaxed text-stone-300 sm:text-base">
            {t.privacy.intro}
          </p>

          <div className="mt-10 flex flex-col gap-8">
            <Section title={t.privacy.form.title}>{t.privacy.form.body}</Section>

            <Section title={t.privacy.spam.title}>
              {t.privacy.spam.body}{' '}
              <a
                href={TURNSTILE_ADDENDUM}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t.privacy.spam.addendumLink}
              </a>
              .
            </Section>

            <Section title={t.privacy.hosting.title}>{t.privacy.hosting.body}</Section>

            <Section title={t.privacy.questions.title}>
              {t.privacy.questions.body}{' '}
              <a href={`tel:${PHONE_E164}`} className={linkClass}>
                {PHONE_DISPLAY}
              </a>
              .
            </Section>
          </div>
        </div>
      </div>
    </main>
  )
}
