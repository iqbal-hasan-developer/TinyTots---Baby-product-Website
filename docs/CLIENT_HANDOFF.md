# Client Handoff Checklist

Use this checklist before handing a finished client store to the owner.

## Access

- Client domain connected.
- Supabase project owned or shared with client.
- Supabase Auth admin user created.
- Admin email added to `ADMIN_EMAILS`.
- Admin login tested at `/admin/login`.
- Client knows how to reset password through Supabase Auth.

## Storefront

- Logo updated.
- Hero image updated.
- Brand colors reviewed.
- Phone, WhatsApp, email, address, and social links updated.
- Home page reviewed on desktop and mobile.
- Shop page reviewed on desktop and mobile.
- Contact page details confirmed.
- Placeholder blog/account behavior explained.

## Products

- Demo products archived or replaced.
- Product names, prices, categories, descriptions, images, SEO fields reviewed.
- Active products visible in shop.
- Archived products hidden publicly.
- Product images load correctly.
- Variant options tested.
- Inventory tracking tested for tracked products.

## Orders

- COD test order completed.
- bKash test order completed.
- Nagad test order completed.
- Order appears in admin.
- Order detail shows items, variants, totals, delivery, and customer details.
- Order status update tested.
- Payment status verification tested.
- Customer order tracking tested with order number and phone.

## Email

- Client sending domain verified in Resend if email is included.
- `RESEND_API_KEY` configured.
- `EMAIL_FROM` configured.
- `ADMIN_NOTIFICATION_EMAIL` configured.
- Customer confirmation email tested.
- Admin new-order email tested.
- Status update email tested.
- Payment verification email tested.

## Security

- `.env.local` not committed.
- Service-role key is server-only.
- Resend key is server-only.
- Public tracking requires order number plus phone.
- Product writes require admin access.
- Product image upload requires admin access.

## Deployment

- `NEXT_PUBLIC_SITE_URL` set to production domain.
- `npm run lint` passes.
- `npm run build` passes.
- `npm audit` reviewed.
- `/robots.txt` checked.
- `/sitemap.xml` checked.
- Mobile checkout tested.

## Owner Training

- How to add/edit/archive products.
- How to upload product images.
- How to manage stock.
- How to verify bKash/Nagad payments.
- How to update order statuses.
- How customers track orders.
- What is intentionally not included yet: customer accounts, SMS, real payment gateway, blog CRUD, delivery tracking.
