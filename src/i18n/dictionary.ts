/* Custom i18n instead of a library: the copy is a fixed, hand-authored set of
   strings across three languages, so a typed dictionary object plus a context
   hook is smaller and simpler than i18next (~15 kB gzip) and pulls in nothing.
   The Dictionary shape lives in types.ts and each language in locales/, so
   editing one language never means scrolling past the other two; this barrel
   keeps the import path every consumer already uses. */

import type { Dictionary, Lang } from './types'
import { en } from './locales/en'
import { ga } from './locales/ga'
import { ru } from './locales/ru'

export type { Dictionary, Lang, ServiceId } from './types'

/* Order and display labels of the switcher. Labels stay Latin in every
   language so the control reads the same and never needs the Cyrillic face. */
export const LANGS: { readonly code: Lang; readonly label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ga', label: 'GA' },
  { code: 'ru', label: 'RU' },
]

export const dictionaries: Record<Lang, Dictionary> = { en, ga, ru }
