# ADR-003: Stock-aware Availability & Booking State Machine

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Two related correctness bugs existed before v9:
  1. `getAvailability()` returned `available: false` as soon as **any**
     booking overlapped the requested range, even if the product had
     multiple units in stock. Multi-unit products (e.g. 5 of the same
     party equipment) appeared booked after a single booking.
  2. The booking status state machine had no path for `PAYMENT_FAILED`
     bookings to be retried, so a single failed payment permanently
     blocked the dates.

## Decision

1. **Stock-aware availability** — `getAvailability()` now sums the
   `quantity` field across overlapping bookings and compares the total
   against the product's `stock`. The result includes `availableQuantity`
   so the UI can show "N left".
2. **Quantity on Booking** — the requested `quantity` is persisted on the
   `Booking` row, and the admin booking detail multiplies price × quantity
   so multi-unit bookings display the correct total.
3. **State machine extension** — `PAYMENT_FAILED` can transition back to
   `PENDING` (retry) or forward to `CANCELLED`; the admin booking detail
   shows a "Retry payment" action for failed bookings.

## Consequences

- Multi-unit products can be partially booked, increasing utilisation.
- Admins see accurate totals for multi-unit bookings.
- Failed payments no longer permanently hold dates.

## Related V# Fix comments

- `V9 Fix #4` (src/app/api/orders/route.ts): stock-aware availability check
  sums `quantity` across overlapping bookings
- `V9 Fix #4` (src/app/api/products/[id]/availability/route.ts): result
  includes `availableQuantity`
- `V9 Fix #4` (src/lib/products.ts): previously returned `available: false`
  if any booking overlapped; now stock-aware
- `V9 Fix #4` (src/app/api/orders/route.ts): persist requested `quantity`
  on the booking row
- `FIX-1C Fix 2` (src/components/admin/booking-detail.tsx): quantity is
  the number of units booked; multiply price × quantity; show booked
  quantity in the admin UI
- `V9 Fix #6` (src/app/[locale]/admin/(dashboard)/bookings/actions.ts):
  state machine includes `PAYMENT_FAILED` transitions
- `V9 Fix #6` (src/components/admin/bookings-table.tsx):
  `PAYMENT_FAILED` chip in the filter
- `V9 Fix #6` (src/components/admin/booking-detail.tsx): failed bookings
  can be retried back to `PENDING`
