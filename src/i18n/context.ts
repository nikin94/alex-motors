import { createContext, useContext } from 'react'

import type { Dictionary, Lang } from './dictionary'

export type I18nValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  /* The whole dictionary for the active language — components read it as
     `t.services.heading`, so a missing key is a compile error, not a
     silent empty string. */
  t: Dictionary
}

/* Split from the provider component so this module exports no component and
   react-refresh stays happy; the provider imports the context from here. */
export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within I18nProvider')
  return value
}
