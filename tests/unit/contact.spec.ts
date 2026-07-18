import { describe, expect, it } from 'vitest'

import { CONTACT_LIMITS, isEmail, isPhone } from '../../shared/contact'

/* The shared contract is imported by both the browser form and the Worker —
   these tests pin its behaviour so a change here is a conscious decision,
   not a drive-by edit that desyncs client and server. */

describe('CONTACT_LIMITS', () => {
  it('matches the maxLength attributes the form renders', () => {
    expect(CONTACT_LIMITS).toEqual({ name: 100, phone: 40, email: 200, message: 2000 })
  })
})

describe('isPhone', () => {
  it('accepts real-world formats', () => {
    expect(isPhone('+353 85 289 6539')).toBe(true)
    expect(isPhone('0852896539')).toBe(true)
    expect(isPhone('(028) 7137-1234')).toBe(true)
    expect(isPhone('00.44.28.71.37.12')).toBe(true)
  })

  it('rejects prose and too-few digits', () => {
    expect(isPhone('call me maybe')).toBe(false)
    expect(isPhone('+353 85x 289')).toBe(false)
    expect(isPhone('123456')).toBe(false) // 6 digits — below the 7 minimum
    expect(isPhone('')).toBe(false)
  })
})

describe('isEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isEmail('alex@example.ie')).toBe(true)
    expect(isEmail('first.last+tag@sub.domain.co.uk')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isEmail('not-an-email')).toBe(false)
    expect(isEmail('a@b')).toBe(false) // no TLD
    expect(isEmail('a@b.i')).toBe(false) // 1-char TLD
    expect(isEmail('a b@c.ie')).toBe(false)
  })

  it('rejects CR/LF — the Reply-To header-injection guard', () => {
    expect(isEmail('a@b.ie\r\nBcc: victim@evil.com')).toBe(false)
    expect(isEmail('a@b.ie\nX-Spam: yes')).toBe(false)
  })
})
