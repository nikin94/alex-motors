import { EmailMessage } from 'cloudflare:email'

import { CONTACT_LIMITS, isEmail } from '../shared/contact'

/* Contact-form endpoint. Only /api/* requests ever reach this Worker
   (run_worker_first in wrangler.jsonc); every other URL keeps the plain
   static-asset/SPA behaviour the site always had.

   Delivery uses Cloudflare Email Routing (Serhiy's pick: free, no third-party
   service, activates once the production domain is on Cloudflare). Until the
   send_email binding is configured the endpoint answers 503 and the form shows
   its call/WhatsApp fallback — see the setup note in wrangler.jsonc.

   Anti-spam, in order of the checks below: same-origin guard, honeypot,
   strict field validation, then Turnstile. The Turnstile secret is a Worker
   secret (dashboard / `wrangler secret put TURNSTILE_SECRET`), never a var in
   wrangler.jsonc — when it is absent (local dev, CI) verification is skipped,
   which is safe because the deployed production Worker always carries it. */

interface SendEmailBinding {
  send(message: EmailMessage): Promise<void>
}

interface Env {
  CONTACT_EMAIL?: SendEmailBinding
  CONTACT_FROM?: string
  CONTACT_TO?: string
  TURNSTILE_SECRET?: string
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/* Server-side half of Turnstile: the widget's token is worthless until this
   exchange with Cloudflare confirms it. Network or parse failures count as
   not-verified — failing open would make the whole check decorative. */
async function turnstilePasses(secret: string, token: string, ip: string | null): Promise<boolean> {
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined }),
    })
    if (!res.ok) return false
    const outcome = (await res.json()) as { success?: boolean }
    return outcome.success === true
  } catch {
    return false
  }
}

function json(status: number, ok: boolean): Response {
  return new Response(JSON.stringify({ ok }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/* Returns the trimmed string, or null when missing/not a string/too long —
   the client enforces the same maxLength, so null means a non-browser sender. */
function field(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length <= max ? trimmed : null
}

/* EmailMessage takes a raw RFC 5322 message. The body is base64-encoded so
   non-ASCII content (Cyrillic enquiries, Irish fadas) survives transport
   without pulling in a MIME library. */
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/(.{76})/g, '$1\r\n')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname !== '/api/contact') return json(404, false)
    if (request.method !== 'POST') return json(405, false)

    /* Cross-site browser abuse guard. A text/plain POST is a "simple request"
       (no CORS preflight), so any third-party page could otherwise trigger a
       real email send — the attacker never reads the response, but the mail
       still goes out. Browsers always attach Origin to cross-site POSTs, so a
       mismatched Origin is rejected; an ABSENT Origin (curl, same-origin
       fetches in some browsers) passes — non-browser flood is the rate-limit
       rule's job, not this check's. */
    const origin = request.headers.get('origin')
    if (origin !== null && origin !== url.origin) return json(403, false)

    let data: Record<string, unknown>
    try {
      data = await request.json()
    } catch {
      return json(400, false)
    }

    // Honeypot filled → a bot. Pretend success so it has nothing to adapt to.
    // The field name is deliberately meaningless: autofill-token names like
    // "company" get filled in by password managers, silently dropping a real
    // enquiry from a human whose browser was just being helpful.
    if (typeof data.contact_ref === 'string' && data.contact_ref.trim() !== '') {
      return json(200, true)
    }

    const name = field(data.name, CONTACT_LIMITS.name)
    const phone = field(data.phone, CONTACT_LIMITS.phone)
    const message = field(data.message, CONTACT_LIMITS.message)
    if (!name || !phone || !message) return json(400, false)
    // Email is the one optional field: absent is fine (''), but if it WAS
    // sent it must pass the same null-means-reject contract as the others —
    // an over-limit or non-string email is a 400, never silently dropped.
    const email = data.email === undefined ? '' : field(data.email, CONTACT_LIMITS.email)
    if (email === null) return json(400, false)
    if (email !== '' && !isEmail(email)) return json(400, false)

    /* Turnstile, after the cheap checks so garbage never costs a siteverify
       round-trip. Skipped only when no secret is bound (local dev / CI). */
    if (env.TURNSTILE_SECRET) {
      const token = typeof data.turnstileToken === 'string' ? data.turnstileToken : ''
      const ip = request.headers.get('cf-connecting-ip')
      if (!token || !(await turnstilePasses(env.TURNSTILE_SECRET, token, ip))) {
        return json(403, false)
      }
    }

    if (!env.CONTACT_EMAIL || !env.CONTACT_FROM || !env.CONTACT_TO) {
      // Email Routing is not wired up yet (waiting on the production domain).
      return json(503, false)
    }

    const bodyLines = [`Name: ${name}`, `Phone: ${phone}`]
    if (email !== '') bodyLines.push(`Email: ${email}`)
    const body = [...bodyLines, '', message].join('\n')

    const headers = [`From: Alex Motors website <${env.CONTACT_FROM}>`, `To: <${env.CONTACT_TO}>`]
    if (email !== '') headers.push(`Reply-To: <${email}>`)
    headers.push(
      'Subject: New website enquiry',
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@${env.CONTACT_FROM.split('@')[1]}>`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: base64',
    )
    const raw = [...headers, '', toBase64(body)].join('\r\n')

    try {
      await env.CONTACT_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, raw))
    } catch {
      return json(502, false)
    }
    return json(200, true)
  },
}
