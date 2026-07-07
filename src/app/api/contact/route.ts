import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limiter'

/**
 * Contact form schema. Mirrors the client-side schema in
 * `contact-view.tsx` so server and client agree on what "valid" means.
 */
const contactSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/).optional().or(z.literal('')),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
})

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]
    return first ? first.trim() : 'unknown'
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Best-effort n8n webhook fan-out (V9 Fix #7).
 *
 * Previously this function was `await`ed inside the request handler, which
 * blocked the response for up to 10s (the AbortController timeout). If n8n
 * was slow or down, the contact form appeared to hang.
 *
 * Now we fire the webhook WITHOUT awaiting — the response returns to the
 * client immediately after the SecurityLog row is committed. The fetch is
 * still wrapped in a try/catch (via `.catch()`) so failures are logged but
 * never surface to the caller. The message itself is already persisted in
 * SecurityLog so no data is lost on an n8n outage.
 *
 * We keep a generous 30s timeout on the fetch itself (vs the previous 10s)
 * because the fetch now runs in the background — there's no UX cost to
 * waiting longer for n8n to respond, and a longer timeout is more likely
 * to succeed under transient n8n latency.
 */
function fanOutToN8n(payload: unknown): void {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return
  }

  // Fire-and-forget: do NOT await this Promise. The caller returns 200
  // immediately while the fetch runs in the background. Any error is
  // caught by `.catch()` so it never surfaces as an unhandled rejection.
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Event': 'contact.submitted',
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        console.warn(
          `[contact] n8n webhook returned non-OK status: ${response.status}`
        )
      }
    })
    .catch((error) => {
      // Catch but don't throw — the message is already persisted locally.
      console.error('[contact] n8n webhook failed:', error)
    })
    .finally(() => {
      clearTimeout(timeout)
    })
}

/**
 * POST /api/contact
 *
 * Persists a contact-form submission to the SecurityLog table (so we
 * never lose messages even if n8n is down) and fires a best-effort n8n
 * webhook if `N8N_WEBHOOK_URL` is configured. Rate limited to 3
 * requests per minute per IP.
 *
 * V9 Fix #7: the n8n fan-out is fire-and-forget (not awaited) so the
 * response returns to the client immediately after the SecurityLog row
 * commits. Previously the handler awaited the n8n fetch (up to 10s
 * timeout), making the contact form appear to hang when n8n was slow.
 */
export async function POST(req: NextRequest) {
  // --- Rate limit (3/min/IP) ---
  const ip = getClientIp(req)
  const rl = rateLimit(`contact:${ip}`, 3, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // --- Parse body defensively (D2) ---
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_json' },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const data = parsed.data

  try {
    // 1. Persist locally so we never lose the message even if n8n is down.
    await db.securityLog.create({
      data: {
        event: 'contact_submission',
        ip,
        details: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          subject: data.subject,
          message: data.message,
          submittedAt: new Date().toISOString(),
        }),
      },
    })

    // 2. Best-effort fan-out to n8n (fire-and-forget, V9 Fix #7).
    //    Not awaited — the response returns immediately. The fetch runs in
    //    the background; failures are logged via `.catch()` but never
    //    surface to the caller. The message is already persisted above.
    fanOutToN8n({
      event: 'contact.submitted',
      timestamp: new Date().toISOString(),
      ip,
      data,
    })

    // V10 Fix #8: return 201 Created (not 200) since we just persisted a
    // new SecurityLog row (a resource was created).
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Contact form error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
