import { Fragment } from 'react'

import { useI18n } from './i18n/context'
import { LANGS } from './i18n/dictionary'

/* A minimal EN · RU · UK control fixed in the top-right corner, floating over
   the whole scene so a visitor can switch language from the first screen
   without a footer or scrolling — the site stays full-screen. It carries
   `intro-rise-late` so it fades in with the tagline/contacts rather than
   sitting on the black veil during the sign's switch-on (and, like the rest
   of the sequence, appears instantly under prefers-reduced-motion). */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()

  return (
    <nav
      aria-label={t.a11y.selectLanguage}
      className="intro-rise-late font-display fixed right-4 top-4 z-20 flex items-center gap-2 text-sm tracking-[0.15em] sm:right-6 sm:top-6 sm:text-base"
    >
      {LANGS.map(({ code, label }, index) => (
        <Fragment key={code}>
          {index > 0 && (
            <span aria-hidden className="text-amber-100/30">
              ·
            </span>
          )}
          <button
            type="button"
            lang="en"
            onClick={() => setLang(code)}
            aria-current={lang === code ? 'true' : undefined}
            className={
              lang === code
                ? 'text-amber-100 transition-colors'
                : 'text-amber-100/40 transition-colors hover:text-amber-100/80'
            }
          >
            {label}
          </button>
        </Fragment>
      ))}
    </nav>
  )
}
