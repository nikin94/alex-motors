import { FaQuoteLeft } from 'react-icons/fa6'

import logoCar from './assets/logo-car.webp'
import { ContactScreen } from './components/ContactScreen'
import { Faq } from './components/Faq'
import { HeroScreen } from './components/HeroScreen'
import { ReviewsCarousel } from './components/ReviewsCarousel'
import { ScrollChevron } from './components/ScrollChevron'
import { ServicesShowcase } from './components/ServicesShowcase'
import { StickyCall } from './components/StickyCall'
import { WallStencil } from './components/WallStencil'
import { localBusinessJsonLd, PHONE_E164, WHATSAPP_URL } from './config/business'
import { useI18n } from './i18n/context'

/* Scene composition only: five snap screens over one shared brick wall, plus
   the fixed chrome (the sticky call/WhatsApp/language cluster) and the
   JSON-LD. Screens with real markup of their own live in components/
   (HeroScreen, ContactScreen); the middle screens are a heading + one
   feature component, so they stay inline here where the reading order is
   visible. */

function App() {
  const { t } = useI18n()

  return (
    <main className="brick-wall">
      <StickyCall phoneE164={PHONE_E164} whatsappUrl={WHATSAPP_URL} />

      <HeroScreen />

      <section
        id="services"
        className="services-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 py-10"
      >
        {/* The sign's car artwork, back on the wall as faded paint — the
            watermark this screen carried before the photo redesign. Tucked
            into the bottom-right corner, nosing under the showcase panel
            (which paints above it via `relative`). */}
        <WallStencil className="-right-[1%] bottom-[3%] w-[min(42vw,36rem)]">
          <img src={logoCar} alt="" width={1280} height={853} loading="lazy" />
        </WallStencil>
        <ServicesShowcase />
        <ScrollChevron href="#reviews" label={t.a11y.scrollToReviews} />
      </section>

      {/* Reviews get a screen of their own between the services and the
          contact details. Quotes are in-house drafts until real ones land. */}
      <section
        id="reviews"
        className="reviews-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-4 py-12"
      >
        <WallStencil className="left-[3%] top-[10%] -rotate-6">
          <FaQuoteLeft className="size-56" />
        </WallStencil>
        <header className="relative text-center">
          <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
            {t.reviews.heading}
          </h2>
        </header>

        <ReviewsCarousel />

        <ScrollChevron href="#faq" label={t.a11y.scrollToFaq} />
      </section>

      {/* FAQ in the services screen's master-detail language; the Q&A copy is
          an in-house draft built on owner-confirmed facts. */}
      <section
        id="faq"
        className="faq-shade snap-screen relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-4 py-12"
      >
        {/* The question mark is a glyph from the display face, so the stencil
            reads as the same "hand" that painted the sign lettering. */}
        <WallStencil className="right-[5%] top-[2%] rotate-6">
          <span className="font-display text-[24rem] leading-none">?</span>
        </WallStencil>
        <header className="relative text-center">
          <h2 className="font-display text-4xl tracking-[0.3em] text-amber-50 sm:text-5xl">
            {t.faq.heading}
          </h2>
        </header>

        <Faq />

        <ScrollChevron href="#contact" label={t.a11y.scrollToContact} />
      </section>

      <ContactScreen />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </main>
  )
}

export default App
