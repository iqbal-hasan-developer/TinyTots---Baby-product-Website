# Template Customization Guide

Use this guide when converting TinyTots BD into a client store.

## Brand Settings

Edit `lib/site-config.ts`:

- `businessName`
- `tagline`
- `phone`
- `whatsappNumber`
- `email`
- `address`
- `facebookUrl`
- `instagramUrl`
- delivery fees
- default SEO title and description

## Logo and Images

Replace:

- `public/Logo.png`
- `public/Hero-img.png`
- demo product images in `public/products/` if keeping local assets

For managed product images, use admin product image upload after Supabase Storage is configured.

## Colors

Brand colors live in `app/globals.css`. Keep contrast readable and retest mobile layouts after color changes.

## Categories and Products

Category and product helper types live in `lib/products.ts`.

For a client project:

1. Apply Supabase migrations.
2. Log in to `/admin`.
3. Create or edit products in `/admin/products`.
4. Upload product images.
5. Set price, old price, badge, category, featured, active, stock status, inventory quantity, and variants.
6. Archive demo products that should not appear publicly.

## Payment Methods

Configured in `lib/site-config.ts`:

- Cash on Delivery
- bKash
- Nagad

This starter pack supports manual payment status verification only. Real payment gateway integration is a future phase.

## Delivery Fees

Configured in `lib/site-config.ts`:

- inside Dhaka
- outside Dhaka

Server-side order creation recalculates delivery fees and totals.

## Admin Setup

1. Create the owner in Supabase Auth.
2. Add the owner email to `ADMIN_EMAILS`.
3. Restart or redeploy.
4. Log in at `/admin/login`.

Do not add public admin links to the storefront unless the client asks for it.

## Email Setup

Email hooks are optional and use Resend.

Before enabling live email:

- Verify the client sending domain in Resend.
- Set `RESEND_API_KEY`.
- Set `EMAIL_FROM`.
- Set `ADMIN_NOTIFICATION_EMAIL`.
- Place a test order and confirm delivery.

## SEO Setup

Set `NEXT_PUBLIC_SITE_URL` to the production domain.

Review:

- `lib/site-config.ts` default SEO
- product SEO fields in admin product forms
- `/sitemap.xml`
- `/robots.txt`

## Client Launch Checklist

- Client domain connected.
- Supabase configured.
- Migrations applied.
- Admin user created.
- Products added.
- Images uploaded.
- Delivery fees confirmed.
- Payment methods confirmed.
- Test order completed.
- Order tracking tested.
- Admin status update tested.
- Mobile QA done.
