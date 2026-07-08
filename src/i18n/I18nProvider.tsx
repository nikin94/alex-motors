import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { I18nContext } from './context'
import { dictionaries, type Lang } from './dictionary'

const STORAGE_KEY = 'alex-motors-lang'

function isLang(value: string | null): value is Lang {
  return value === 'en' || value === 'ga' || value === 'ru'
}

/* A stored choice wins; otherwise fall back to the browser's preferred
   language, then English. Read lazily in useState so it runs once, before
   first paint. */
function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    // localStorage can throw in private mode — fall through to detection.
  }
  const nav = navigator.language?.slice(0, 2).toLowerCase()
  if (nav === 'ga' || nav === 'ru') return nav
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  /* Keep <html lang> in sync so screen readers switch pronunciation and the
     page advertises its language to crawlers. */
  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].htmlLang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Persisting the choice is best-effort; ignore storage failures.
    }
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, t: dictionaries[lang] }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
