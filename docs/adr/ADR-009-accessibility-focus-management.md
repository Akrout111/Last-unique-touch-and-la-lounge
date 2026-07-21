# ADR-009: Accessibility — Focus Management & ARIA

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** The mobile navbar drawer opened visually but had no
  keyboard / screen-reader support: focus wasn't trapped, Escape didn't
  close it, and the open/close state wasn't announced. The booking
  status badge also needed a proper colour map for screen readers.

## Decision

1. **Mobile-drawer focus management** — the navbar drawer uses refs to
   trap focus, closes on Escape, and restores focus to the trigger on
   close.
2. **Status → badge colour map** — `booking-detail.tsx` and
   `bookings-table.tsx` use a shared `status → badge color` map built
   from the project's `rose` / `amber` / `emerald` tokens so screen
   readers and sighted users see a consistent semantic.

## Consequences

- Keyboard users can navigate the mobile drawer without tabbing out.
- Escape closes the drawer (matches user expectation).
- Booking status is conveyed by both colour and label, satisfying
  WCAG SC 1.4.1 (Use of Color).

## Related V# Fix comments

- `FIX-2B (R2-D S-H3)` (src/components/layout/navbar.tsx): refs for
  mobile-drawer focus management; Escape to close; focus trap
- `V9 Fix #6 / FIX-2B` (src/components/admin/booking-detail.tsx):
  status → badge colour map using the project's semantic tokens
