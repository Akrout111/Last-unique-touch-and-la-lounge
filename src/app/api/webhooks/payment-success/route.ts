import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'
import { safeEqualStrings } from '@/lib/crypto-utils'

const schema = z.object({
  orderId: z.string().min(1),
})

/**
 * Resolve the shared internal API secret used to authenticate internal calls.
 * Fail-closed in production: throw if INTERNAL_API_SECRET is not set.
 */
function getInternalSecret(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const secret = process.env.INTERNAL_API_SECRET

  if (secret && secret.length >= 16) {
    return secret
  }

  if (isProduction) {
    throw new Error('INTERNAL_API_SECRET must be set in production.')
  }

  console.warn(
    '[payment-success] WARNING: INTERNAL_API_SECRET is not set. ' +
      'Using dev-only insecure secret. Do NOT use in production.'
  )
  return 'dev-insecure-internal-api-secret'
}

/**
 * POST /api/webhooks/payment-success
 *
 * Internal mock endpoint to simulate payment confirmation.
 * In production, this will be replaced by /api/webhooks/payment-callback
 * which receives real confirmations from the external payment gateway company.
 *
 * Authenticated by the `x-internal-secret` header against INTERNAL_API_SECRET (C3).
 */
export async function POST(req: NextRequest) {
  try {
    // --- Internal secret authentication (C3) ---
    const providedSecret = req.headers.get('x-internal-secret') ?? ''

    let expectedSecret: string
    try {
      expectedSecret = getInternalSecret()
    } catch {
      // Fail-closed: production without INTERNAL_API_SECRET configured.
      return NextResponse.json(
        { error: 'server_misconfigured' },
        { status: 500 }
      )
    }

    if (!providedSecret || !safeEqualStrings(providedSecret, expectedSecret)) {
      return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
    }
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      // R1-A M9: do NOT disclose Zod issue details to the client (schema
      // disclosure). Log them server-side for debugging instead.
      console.warn('[api/payment-success] Validation failed:', parsed.error.issues)
      return NextResponse.json(
        { error: 'invalid_input' },
        { status: 400 }
      )
    }

    const { orderId } = parsed.data

    // R2-A-4: namespace the idempotency key with a route prefix so a
    // payment-success key (raw orderId) can never collide with keys from
    // /api/orders or /api/bookings/birthday (which share the same UNIQUE
    // IdempotencyKey.key column). Without this prefix, an attacker who
    // submits /api/orders with `idempotencyKey = <booking cuid>` would
    // pre-seed the key — when payment-success later tries to create
    // `key: orderId` for that same booking, the create throws P2002 and
    // we silently swallow the legitimate payment confirmation.
    const namespacedKey = `payment-success:${orderId}`

    // Fix #2: race-condition hardening. Previously the flow was
    //   findUnique → status check → update → triggerOrderConfirmedWebhook
    // with each step on a separate connection. Two concurrent
    // payment-success webhooks for the same orderId could both observe
    // PENDING, both pass the guard, and both update + fire n8n.
    //
    // Now the findUnique → status guard → update → idempotency-log run
    // inside a single Serializable transaction (mirroring the pattern in
    // /api/webhooks/payment-callback/route.ts). The n8n webhook trigger
    // is moved OUTSIDE the transaction so a slow n8n doesn't hold locks.
    //
    // --- Idempotency refactor (security/data-fix #1): the previous
    //     implementation used `SecurityLog.details { contains: orderId }`
    //     which is a substring match on a free-form JSON text column.
    //     This is incorrect for two reasons: (1) an orderId of "abc1"
    //     would match the log entry for "abc12" (false positive →
    //     silently dropping a legitimate payment confirmation); (2) any
    //     unrelated SecurityLog row whose details string happened to
    //     contain the orderId substring would short-circuit the webhook.
    //     Now we use the dedicated `IdempotencyKey` table (which has a
    //     real UNIQUE constraint on `key`) and mirror the exact pattern
    //     from /api/orders/route.ts: `tx.idempotencyKey.create()` inside
    //     the transaction, and on P2002 treat the webhook as already
    //     processed. There is no nonce in this route (it's an internal
    //     mock), so we use `orderId` as the idempotency key directly.
    let txResult:
      | { type: 'already_confirmed' }
      | { type: 'not_found' }
      | { type: 'invalid_status'; current: string }
      | { type: 'updated'; orderId: string }
    try {
      txResult = await db.$transaction(
        async (tx) => {
          // 1. Idempotency: create the key FIRST inside the Serializable
          //    transaction. If two concurrent payment-success webhooks
          //    for the same orderId arrive, the second create throws
          //    P2002 — caught below — which we map to `already_confirmed`.
          const idempotencyRecord = await tx.idempotencyKey.create({
            data: {
              key: namespacedKey,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            },
          })

          // 2. Find the booking inside the transaction.
          const booking = await tx.booking.findUnique({
            where: { id: orderId },
            include: { product: true },
          })

          if (!booking) {
            return { type: 'not_found' as const }
          }

          // Idempotency: already confirmed — no-op. Still link the
          // idempotency key to the order so future replays can be traced.
          if (booking.status === 'CONFIRMED') {
            await tx.idempotencyKey.update({
              where: { id: idempotencyRecord.id },
              data: { orderId },
            })
            return { type: 'already_confirmed' as const }
          }

          if (booking.status !== 'PENDING') {
            return { type: 'invalid_status' as const, current: booking.status }
          }

          // 3. Update booking to CONFIRMED inside the same tx.
          await tx.booking.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' },
          })

          // 4. Link the idempotency key to the resulting order so a
          //    future replay can be traced back to this order.
          await tx.idempotencyKey.update({
            where: { id: idempotencyRecord.id },
            data: { orderId },
          })

          // 5. Audit log (kept for backwards compat with tooling that
          //    reads the old SecurityLog format).
          await tx.securityLog.create({
            data: {
              event: 'payment_success_processed',
              details: JSON.stringify({
                orderId,
                fromStatus: booking.status,
                toStatus: 'CONFIRMED',
              }),
            },
          })

          return { type: 'updated' as const, orderId }
        },
        { isolationLevel: 'Serializable' }
      )
    } catch (error: unknown) {
      // P2002 on IdempotencyKey.key = the same orderId has already been
      // processed by a prior payment-success webhook. Return success so
      // the (internal) caller treats it as idempotent.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[] | undefined)?.join(',') ?? ''
        if (target.includes('key')) {
          return NextResponse.json({
            success: true,
            alreadyConfirmed: true,
            orderId,
          })
        }
      }
      throw error
    }

    if (txResult.type === 'already_confirmed') {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        orderId,
      })
    }
    if (txResult.type === 'not_found') {
      return NextResponse.json(
        { error: 'order_not_found' },
        { status: 404 }
      )
    }
    if (txResult.type === 'invalid_status') {
      return NextResponse.json(
        { error: 'invalid_status', current: txResult.current },
        { status: 400 }
      )
    }

    // txResult.type === 'updated' — fire n8n webhook OUTSIDE the
    // transaction so a slow n8n doesn't hold the Serializable lock.
    try {
      await triggerOrderConfirmedWebhook(txResult.orderId)
    } catch (webhookError) {
      // Log failure but don't fail the request — the booking is already
      // confirmed; n8n failure is a separate concern.
      console.error('n8n webhook failed:', webhookError)
      await db.securityLog.create({
        data: {
          event: 'n8n_webhook_failed',
          details: JSON.stringify({
            orderId: txResult.orderId,
            error: webhookError instanceof Error ? webhookError.message : 'unknown',
          }),
        },
      })
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'CONFIRMED',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Payment success error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
