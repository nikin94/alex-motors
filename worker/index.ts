import { EmailMessage } from 'cloudflare:email'

import { CONTACT_LIMITS, isEmail } from '../shared/contact'

/* Contact-form endpoint. Only /api/* requests ever reach this Worker
   (run_worker_first in wrangler.jsonc); every other URL keeps the plain
   static-asset/SPA behaviour the site always had.

   Delivery uses Cloudflare Email Routing (Serhiy's pick: free, no third-party
   service, activates once the production domain is on Cloudflare). Until the
   send_email binding is configured the endpoint answers 503 and the form shows
   its call/WhatsApp fallback — see the setup note in wrangler.jsonc.

   Anti-spam: honeypot field + strict field validation. If the mailbox still
   gets noise once live, the next step is a Turnstile widget on the form. */

interface SendEmailBinding {
  send(message: EmailMessage): Promise<void>
}

interface Env {
  CONTACT_EMAIL?: SendEmailBinding
  CONTACT_FROM?: string
  CONTACT_TO?: string
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

    let data: Record<string, unknown>
    try {
      data = await request.json()
    } catch {
      return json(400, false)
    }

    // Honeypot filled → a bot. Pretend success so it has nothing to adapt to.
    if (typeof data.company === 'string' && data.company.trim() !== '') {
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
