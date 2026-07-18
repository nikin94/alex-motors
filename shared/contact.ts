/* Contact-form contract shared by the browser form (src/components/ContactForm.tsx)
   and the Worker endpoint (worker/index.ts). Both sides import THIS module, so the
   field limits and shape checks can never drift apart — a drift would make the
   browser accept input the server then rejects with a 400 the visitor cannot fix.
   Environment-neutral on purpose (plain constants + RegExp): typechecked under
   both the DOM and WebWorker lib sets. */

export const CONTACT_LIMITS = { name: 100, phone: 40, email: 200, message: 2000 } as const

/* Loose on purpose: reject prose, not unusual-but-valid numbers — any mix of
   digits and the usual separators, with at least 7 digits in it. */
export const isPhone = (value: string): boolean =>
  /^\+?[\d\s()./-]+$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7

/* Also the Worker's header-injection guard: \S excludes CR/LF, so an address
   that passes can never smuggle extra lines into the Reply-To header. */
export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
