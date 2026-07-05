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
 * Best-effort n8n webhook fan-out. If N8N_WEBHOOK_URL is unset we simply
 * skip the webhook (e.g. local dev). Any failure is swallowed and logged
 * — the contact message has already been persisted to SecurityLog so we
 * never lose data due to an n8n outage.
 */
async function fanOutToN8n(payload: unknown): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return
  }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Event': 'contact.submitted',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (!response.ok) {
        console.warn(
          `[contact] n8n webhook returned non-OK status: ${response.status}`
        )
      }
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    // Catch but don't throw — the message is already persisted locally.
    console.error('[contact] n8n webhook failed:', error)
  }
}

/**
 * POST /api/contact
 *
 * Persists a contact-form submission to the SecurityLog table (so we
 * never lose messages even if n8n is down) and fires a best-effort n8n
 * webhook if `N8N_WEBHOOK_URL` is configured. Rate limited to 3
 * requests per minute per IP.
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

    // 2. Best-effort fan-out to n8n (errors swallowed — see above).
    await fanOutToN8n({
      event: 'contact.submitted',
      timestamp: new Date().toISOString(),
      ip,
      data,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Contact form error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
