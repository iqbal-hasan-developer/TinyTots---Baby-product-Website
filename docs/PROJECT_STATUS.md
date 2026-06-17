# Project Status

Last updated for Phase 10 packaging.

## Completed Capabilities

- Public storefront with home, shop, product detail, cart, checkout, contact, blog placeholder, account placeholder, and order tracking
- Supabase-backed products
- Admin product CRUD
- Product image upload through Supabase Storage
- Inventory tracking and stock decrement
- Practical product variants
- Supabase-backed order creation
- COD, bKash, and Nagad order flow
- Protected admin login
- Admin order management
- Manual payment verification
- Customer order tracking
- Optional Resend email hooks
- SEO basics, sitemap, robots, and structured data
- Setup, deployment, Supabase, customization, handoff, sales, and onboarding documentation
- Mobile-responsive admin order detail page

## Production-Ready Areas

- Core storefront
- Product CRUD
- Order persistence
- Admin order management
- Manual payment verification
- Product image upload
- Inventory validation
- Order tracking
- Deployment documentation

## Optional Setup Items

- Resend email delivery requires a verified client sender domain.
- `NEXT_PUBLIC_SITE_URL` should be set for production URLs.
- Client products, images, delivery fees, and payment instructions must be configured per project.

## Known Limitations

- Blog is a placeholder and does not have CRUD.
- Customer account features are not implemented.
- SMS notifications are not implemented.
- bKash/Nagad are manual verification flows, not gateway integrations.
- Delivery tracking integration is not implemented.
- Advanced variant combination matrices are not implemented.
- Bulk product import/export is not implemented.
- Media library management is not implemented.

## Current Validation Baseline

Expected validation commands:

```bash
npm run lint
npm run build
npm run check
npm audit
```

There is no separate `typecheck` script. `next build` runs TypeScript checks. `npm run check` is a safe helper that runs lint and build only.

`npm audit` may report moderate advisories in Next's bundled PostCSS. Do not run unsafe force downgrades without reviewing the framework impact.
