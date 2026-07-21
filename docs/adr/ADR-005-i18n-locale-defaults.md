# ADR-005: i18n & Locale-aware Defaults

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Several components had inline locale ternaries
  (`locale === 'ar' ? 'arabic text' : 'english text'`) instead of using
  `next-intl` translation keys. This made the components harder to
  maintain, prevented translator-review of the strings, and meant the
  Arabic and English copies could drift out of sync.

## Decision

1. **Migrate inline ternaries to i18n keys** — `last-unique-touch-view.tsx`
   and `la-lounge-view.tsx` services arrays now read from
   `messages/{ar,en}.json` via `t.raw(...)`.
2. **Locale-aware default messages** — the floating WhatsApp button
   defaults to a localized "Hi! 👋 How can we help?" message based on
   `useLocale()` rather than always using English.

## Consequences

- All user-facing strings flow through the translation pipeline.
- Translators can review copies without reading source code.
- Adding a new locale only requires editing the messages files.

## Related V# Fix comments

- `V10 Fix #3` (src/components/last-unique-touch/last-unique-touch-view.tsx):
  services array now uses i18n keys instead of inline ternaries
- `V11 Fix #1` (src/components/la-lounge/la-lounge-view.tsx): migrated
  inline locale ternaries to i18n keys
- `V10 Fix #4` (src/components/floating-whatsapp.tsx): locale-aware
  default messages
