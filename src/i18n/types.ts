export type Lang = 'en' | 'ga' | 'ru'

export type ServiceId =
  | 'servicing'
  | 'diagnostics'
  | 'engine'
  | 'timing'
  | 'brakes'
  | 'electrics'
  | 'parts'

type ServiceCopy = { title: string; description: string }

export type Dictionary = {
  htmlLang: string
  tagline: { top: string; bottom: string }
  services: {
    heading: string
    subtitle: string
    preNct: { title: string; body: string }
    items: Record<ServiceId, ServiceCopy>
  }
  location: {
    workshop: string
    openingHours: string
    days: { weekdays: string; saturday: string; sunday: string; closed: string }
    callUs: string
    getDirections: string
  }
  reviews: {
    heading: string
    /* Draft quotes written in-house (owner to swap in real ones); names are
       proper nouns and stay identical across languages. Kept out of the
       LocalBusiness JSON-LD on purpose: schema.org reviews must be verifiably
       real or Google can flag the whole structured-data block. */
    items: { name: string; text: string }[]
  }
  faq: {
    heading: string
    /* In-house draft Q&A built on owner-confirmed facts (services copy, hours,
       call-outs, address). No FAQPage JSON-LD: Google restricted FAQ rich
       results to government/health sites, so the markup would be dead weight. */
    items: { q: string; a: string }[]
  }
  contact: {
    heading: string
    subtitle: string
    /* Micro-CTA under the phone number: names the free assessment to defuse
       the "what will this cost me" fear right where the call decision happens. */
    freeQuote: string
    name: string
    phone: string
    email: string
    message: string
    placeholders: { name: string; phone: string; email: string; message: string }
    /* Sits at the card's very bottom; * marks the required labels. */
    requiredNote: string
    /* Client-side validation messages (`error` below is the send failure). */
    validation: { required: string; phone: string; email: string }
    submit: string
    sending: string
    success: string
    error: string
  }
  a11y: {
    scrollToServices: string
    scrollToReviews: string
    scrollToFaq: string
    scrollToContact: string
    selectLanguage: string
    prevService: string
    nextService: string
    prevReview: string
    nextReview: string
  }
}
