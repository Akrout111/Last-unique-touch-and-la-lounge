# ADR-011: Contact Form Persistence & Async Fan-out

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** The contact form had three issues:

  1. Messages were only fanned out to an n8n webhook; if n8n was down,
     the message was lost.
  2. The n8n fan-out was `await`ed, so the user waited for n8n (which
     could take seconds) before seeing the success screen.
  3. There was no `brand` field, so messages from different storefronts
     were indistinguishable in n8n.
  4. The route returned `200 OK` for a successful create, which is
     semantically wrong (`201 Created` is correct).

## Decision

1. **Persist to `ContactMessage`** — every submission is written to
   the `ContactMessage` table first, so messages survive n8n outages.
2. **Fire-and-forget n8n fan-out** — the n8n call is not `await`ed, so
   the user sees the success screen immediately.
3. **`brand` field** — the route accepts an optional `brand` field and
   stores it on the `ContactMessage` row so admins can filter by
   storefront.
4. **Return 201 Created** — successful create returns `201` with the
   new `ContactMessage.id` so the admin can look it up.

## Consequences

- No message is lost when n8n is down.
- Contact form submit feels instant.
- Admins can filter messages by brand.
- HTTP semantics are correct (`201` for create).

## Related V# Fix comments

- `V9 Fix #7` (src/app/api/contact/route.ts): n8n fan-out is
  fire-and-forget (not `await`ed)
- `V11 Fix #11` (src/app/api/contact/route.ts): optional `brand` field;
  persist in `ContactMessage` table; return the contact message ID
- `V10 Fix #8` (src/app/api/contact/route.ts): return 201 Created
  instead of 200 OK
