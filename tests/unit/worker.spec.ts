import { describe, expect, it } from 'vitest'

import worker from '../../worker/index'
import { EmailMessage } from '../stubs/cloudflare-email'

/* Exercises the /api/contact handler end to end under Node: routing, JSON
   parsing, honeypot, field validation, the 503 pre-domain state, and the
   raw RFC 5322 message it hands to the send_email binding. */

type Env = Parameters<(typeof worker)['fetch']>[1]

const post = (body: unknown, env: Env = {}) =>
  worker.fetch(
    new Request('http://site.test/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    env,
  )

const VALID = {
  name: 'Test Person',
  phone: '+353 85 123 4567',
  email: 'test@example.ie',
  message: 'Привет — warning light is on, need a diagnostic.',
}

/* An env whose binding records every message it is asked to send. */
function capturingEnv() {
  const sent: EmailMessage[] = []
  const env: Env = {
    CONTACT_EMAIL: {
      send: async (message: EmailMessage) => {
        sent.push(message)
      },
    },
    CONTACT_FROM: 'contact@alex-motors.ie',
    CONTACT_TO: 'owner@example.com',
  }
  return { env, sent }
}

describe('routing', () => {
  it('404s unknown /api paths', async () => {
    const res = await worker.fetch(new Request('http://site.test/api/nope'), {})
    expect(res.status).toBe(404)
  })

  it('405s non-POST methods', async () => {
    const res = await worker.fetch(new Request('http://site.test/api/contact'), {})
    expect(res.status).toBe(405)
  })

  it('400s a non-JSON body', async () => {
    expect((await post('not json')).status).toBe(400)
  })
})

describe('validation', () => {
  it('fakes success for a filled honeypot and sends nothing', async () => {
    const { env, sent } = capturingEnv()
    const res = await post({ ...VALID, company: 'SpamCo' }, env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(sent).toHaveLength(0)
  })

  it('400s when a required field is missing or blank', async () => {
    expect((await post({ ...VALID, phone: undefined })).status).toBe(400)
    expect((await post({ ...VALID, name: '   ' })).status).toBe(400)
    expect((await post({ ...VALID, message: '' })).status).toBe(400)
  })

  it('400s over-limit and non-string fields (non-browser senders)', async () => {
    expect((await post({ ...VALID, name: 'x'.repeat(101) })).status).toBe(400)
    expect((await post({ ...VALID, message: 42 })).status).toBe(400)
  })

  it('400s a malformed email but allows an absent one', async () => {
    expect((await post({ ...VALID, email: 'not-an-email' })).status).toBe(400)
    const { env } = capturingEnv()
    expect((await post({ ...VALID, email: undefined }, env)).status).toBe(200)
  })
})

describe('delivery', () => {
  it('503s while the email binding is not configured', async () => {
    expect((await post(VALID)).status).toBe(503)
  })

  it('sends a well-formed message and reports success', async () => {
    const { env, sent } = capturingEnv()
    const res = await post(VALID, env)
    expect(res.status).toBe(200)
    expect(sent).toHaveLength(1)

    const [message] = sent
    expect(message.from).toBe('contact@alex-motors.ie')
    expect(message.to).toBe('owner@example.com')

    const [head, body] = message.raw.split('\r\n\r\n')
    expect(head).toContain('From: Alex Motors website <contact@alex-motors.ie>')
    expect(head).toContain('To: <owner@example.com>')
    expect(head).toContain('Reply-To: <test@example.ie>')
    expect(head).toContain('Content-Transfer-Encoding: base64')

    // The base64 body round-trips the UTF-8 enquiry (Cyrillic included).
    const decoded = Buffer.from(body.replace(/\r\n/g, ''), 'base64').toString('utf8')
    expect(decoded).toContain('Name: Test Person')
    expect(decoded).toContain('Phone: +353 85 123 4567')
    expect(decoded).toContain(VALID.message)
  })

  it('omits Reply-To when no email was given', async () => {
    const { env, sent } = capturingEnv()
    await post({ ...VALID, email: undefined }, env)
    expect(sent[0].raw).not.toContain('Reply-To')
  })

  it('502s when the binding rejects the send', async () => {
    const env: Env = {
      CONTACT_EMAIL: {
        send: async () => {
          throw new Error('routing not verified')
        },
      },
      CONTACT_FROM: 'contact@alex-motors.ie',
      CONTACT_TO: 'owner@example.com',
    }
    expect((await post(VALID, env)).status).toBe(502)
  })
})
