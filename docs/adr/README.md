# Architecture Decision Records (ADRs)

This directory contains architectural decisions for the Last Unique Touch & La Lounge platform,
covering the cumulative `V# Fix #N` patch comments from versions v8-v48.

## Index

| ADR | Title |
|-----|-------|
| [ADR-001](./ADR-001-auth-security-webhooks.md) | Auth, security & webhooks |
| [ADR-002](./ADR-002-multi-tenant-brand-scoping.md) | Multi-tenant brand scoping |
| [ADR-003](./ADR-003-stock-aware-availability.md) | Stock-aware availability |
| [ADR-004](./ADR-004-shared-layout-refactor.md) | Shared layout refactor |
| [ADR-005](./ADR-005-i18n-locale-defaults.md) | i18n locale defaults |
| [ADR-006](./ADR-006-performance-optimizations.md) | Performance optimizations |
| [ADR-007](./ADR-007-brand-color-system-3d.md) | Brand color system & 3D |
| [ADR-008](./ADR-008-defensive-client-error-handling.md) | Defensive client error handling |
| [ADR-009](./ADR-009-accessibility-focus-management.md) | Accessibility & focus management |
| [ADR-010](./ADR-010-routing-404-dynamic-params.md) | Routing, 404 & dynamic params |
| [ADR-011](./ADR-011-contact-form-async-fanout.md) | Contact form async fanout |
| [ADR-012](./ADR-012-edge-runtime-crypto-ip.md) | Edge runtime crypto & IP parsing |

## Topics covered
- **i18n & routing:** locale defaults, 404 handling, dynamic params
- **Layout:** shared navbar/footer, admin chrome isolation
- **Accessibility:** focus management, touch targets, ARIA
- **State:** cart localStorage, toast timers, brand theme
- **3D & performance:** shouldEnable3D gate, brand colors in scenes
- **Security:** proxy auth, __Host- cookies, SESSION_EPOCH, edge crypto
- **Design:** LUT gold WCAG fix, AI-slop removal, brand color strategy

## Format
Each ADR follows: Status, Context, Decision, Consequences.
