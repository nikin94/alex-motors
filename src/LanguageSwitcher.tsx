import { Fragment } from 'react'

import { useI18n } from './i18n/context'
import { LANGS } from './i18n/dictionary'

/* The EN · GA · RU control renders in two places by viewport:
   - `floating`: fixed top-right, over the whole scene, on desktop (>= 768px)
     so a visitor can switch from the first screen without a footer. It carries
     `intro-rise-late` to fade in with the tagline/contacts rather than sitting
     on the black veil during the sign's switch-on. Hidden on mobile.
   - `footer`: centred at the bottom of the last screen, mobile only — the
     top-right corner is reserved on phones where thumbs and content compete.
   Only one is visible at a time; both share the same buttons. */
type Variant = 'floating' | 'footer'

export function LanguageSwitcher({ variant = 'floating' }: { variant?: Variant }) {
  const { lang, setLang, t } = useI18n()

  const shell =
    variant === 'floating'
      ? 'intro-rise-late fixed right-4 top-4 z-20 hidden sm:right-6 sm:top-6 md:flex'
      : 'flex justify-center md:hidden'

  return (
    <nav
      aria-label={t.a11y.selectLanguage}
      className={`font-display items-center gap-2 text-sm tracking-[0.15em] sm:text-base ${shell}`}
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
