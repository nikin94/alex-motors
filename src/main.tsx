import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider.tsx'

/* Always open on the hero. Browsers otherwise restore the previous scroll
   position on reload, dropping a returning visitor straight onto screen 2 or 3
   with the sign's switch-on already spent — and the Cyrillic font's block-period
   swap popping in on text that is already on screen. Manual restoration keeps
   every load at the top, so the hero's intro sequence covers the i18n/font load;
   stripping any chevron anchor also stops the fragment jump and cleans the URL. */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
if (location.hash) {
  history.replaceState(null, '', location.pathname + location.search)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
