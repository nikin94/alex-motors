import type { Dictionary } from '../types'

export const en: Dictionary = {
  htmlLang: 'en',
  tagline: { top: 'Motor Sport', bottom: 'Auto Repair & Service' },
  services: {
    heading: 'Our Services',
    subtitle:
      'All makes and models — from daily drivers to sports cars.\nCall-outs across Donegal & Derry.',
    preNct: {
      title: 'Pre-NCT Check & Repairs',
      body: 'Failed the NCT — or worried you might? We do a full pre-NCT inspection covering brakes, suspension, lights, emissions and tyres — and fix what needs fixing, so you go into the test ready to pass. Retest checks too.',
    },
    items: {
      servicing: {
        title: 'Car Servicing',
        description:
          'Full and interim services for all makes and models — oil and filters, fluids, and a health check that catches problems before they get expensive.',
      },
      diagnostics: {
        title: 'Diagnostics',
        description:
          'Dashboard warning light? We read fault codes with dealer-level tools, find the actual cause and explain your options before any work starts.',
      },
      engine: {
        title: 'Engine Repair',
        description:
          'From misfires and oil leaks to major engine work — honest assessment first, then a clear quote. Daily drivers, vans and sports cars alike.',
      },
      timing: {
        title: 'Timing Belt & Chain',
        description:
          'Belt and chain replacement at the right mileage — the job that protects your engine from the most expensive failure it can have.',
      },
      brakes: {
        title: 'Brakes & Suspension',
        description:
          'Pads, discs, shocks, springs and bushings — everything that keeps you stopping straight and riding smooth on Irish roads.',
      },
      electrics: {
        title: 'Battery & Electrics',
        description:
          'Battery testing and replacement, alternators, starters and wiring faults — including the ones that only show up on cold mornings.',
      },
    },
  },
  location: {
    workshop: 'Workshop',
    openingHours: 'Opening Hours',
    days: { weekdays: 'Mon–Fri', saturday: 'Saturday', sunday: 'Sunday', closed: 'Closed' },
    callUs: 'Call Us',
    getDirections: 'Get Directions',
  },
  reviews: {
    heading: 'What Customers Say',
    items: [
      {
        name: 'Seán O’Doherty',
        text: 'Failed the NCT on brakes and a headlight. Alex had it sorted in a day and it flew through the retest. Fair price, no messing.',
      },
      {
        name: 'Niamh',
        text: 'Had a warning light two other garages couldn’t figure out. Alex found a wiring fault within the hour and explained everything before touching a thing.',
      },
      {
        name: 'Patrick Doyle',
        text: 'Timing belt done on my Passat. Kept me posted the whole way and the price matched the quote to the cent. Highly recommend.',
      },
      {
        name: 'Mary Brennan',
        text: 'Car wouldn’t start on a Monday morning and Alex came out to me. Genuinely sound, and honest about what actually needed doing.',
      },
      {
        name: 'John',
        text: 'Been to plenty of garages around Derry over the years — this is the first one I actually trust. No invented extras, just did the job.',
      },
      {
        name: 'Ciarán McLaughlin',
        text: 'Booked in for a full service before a long run down to Dublin. He spotted a worn belt that would have left me stranded and sorted it there and then.',
      },
      {
        name: 'Emma',
        text: 'Clutch started slipping on the way to work. Dropped the car in on Tuesday, had it back Thursday — and the bill came in under what I had braced myself for.',
      },
      {
        name: 'Michael Harkin',
        text: 'Brakes were squealing something awful. He showed me the worn pads, said the discs were still grand, and only charged for what was actually needed.',
      },
      {
        name: 'Aoife Doherty',
        text: 'Battery kept dying on cold mornings. Turned out to be the alternator — found and fixed the same day. Great to deal with, explains everything as he goes.',
      },
    ],
  },
  faq: {
    heading: 'Common Questions',
    items: [
      {
        q: 'Do you work on all makes?',
        a: 'Yes — all makes and models: daily drivers, vans and sports cars alike.',
      },
      {
        q: 'What does a pre-NCT check cover?',
        a: 'Brakes, suspension, lights, emissions and tyres — and we fix what needs fixing before the test. Retest checks too.',
      },
      {
        q: 'How do I book?',
        a: "Just call or WhatsApp — no forms, no waiting list. We'll agree a time that suits you.",
      },
      {
        q: 'How much will it cost?',
        a: 'You get an honest assessment and a clear quote before any work starts — no surprises on the invoice.',
      },
      {
        q: "My car won't start — can you come out?",
        a: "Yes, we do call-outs across Donegal and the Derry border area. Call us and we'll get to you.",
      },
      {
        q: 'Where exactly are you?',
        a: 'Killea, Co. Donegal — minutes from Derry. Get Directions on the next screen opens the route in Google Maps.',
      },
    ],
  },
  contact: {
    heading: 'Contact Us',
    subtitle: "Tell us what's wrong — we'll call you back.",
    freeQuote: 'Free assessment — just give us a call.',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    message: 'Message',
    placeholders: {
      name: 'John Murphy',
      phone: '+353 85 123 4567',
      email: 'you@example.com',
      message: 'e.g. Warning light is on — need a diagnostic',
    },
    requiredNote: 'Fields marked * are required.',
    validation: {
      required: 'This field is required.',
      phone: 'Enter a valid phone number.',
      email: 'Enter a valid email address.',
    },
    submit: 'Send',
    sending: 'Sending…',
    success: "Thanks! We'll get back to you soon.",
    error: 'Could not send — please call or WhatsApp us instead.',
  },
  a11y: {
    scrollToServices: 'Scroll to services',
    scrollToReviews: 'Scroll to reviews',
    scrollToFaq: 'Scroll to common questions',
    scrollToContact: 'Scroll to contact details',
    selectLanguage: 'Select language',
    prevService: 'Previous service',
    nextService: 'Next service',
    prevReview: 'Previous review',
    nextReview: 'Next review',
  },
}
