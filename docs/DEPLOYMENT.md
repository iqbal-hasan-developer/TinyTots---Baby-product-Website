# Deployment Guide

Vercel is the recommended deployment target for this starter pack.

## 1. Pre-Deployment Checklist

- Supabase project created.
- All migrations applied.
- Admin user created in Supabase Auth.
- Products reviewed or replaced.
- Storage bucket verified.
- `.env.local` works locally.
- `npm run lint` passes.
- `npm run build` passes.

## 2. Vercel Environment Variables

Add these in Vercel Project Settings.

Core Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Admin:

- `ADMIN_EMAILS`

Site URL / SEO:

- `NEXT_PUBLIC_SITE_URL`

Optional email:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` with a `NEXT_PUBLIC_` prefix.
Set `NEXT_PUBLIC_SITE_URL` to the final production URL, including `https://`.

## 3. Build Settings

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

Output is managed by Next.js/Vercel.

## 4. Domain Setup

1. Connect the client domain in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
3. Redeploy.
4. Confirm `/robots.txt` and `/sitemap.xml` use the production domain.

## 5. Supabase URL And Redirect Notes

In Supabase Auth URL configuration:

1. Add the production site URL.
2. Add the Vercel preview URL only if preview admin login is needed.
3. Keep admin users private and created manually in Supabase Auth.
4. Confirm the admin email is included in `ADMIN_EMAILS`.
5. Test `/admin/login` after deployment.

## 6. Resend Setup

Email hooks are already implemented. For live delivery:

1. Add the client domain in Resend.
2. Add DNS records.
3. Wait for Resend verification.
4. Set `RESEND_API_KEY`.
5. Set `EMAIL_FROM` using the verified domain.
6. Set `ADMIN_NOTIFICATION_EMAIL`.
7. Place a live test order with an email.
8. Update order and payment statuses in admin.
9. Confirm all emails arrive.

Missing or failing email config must not block checkout.

## 7. Sitemap And Robots Verification

After deployment:

- Open `/robots.txt`.
- Open `/sitemap.xml`.
- Confirm both use the production domain from `NEXT_PUBLIC_SITE_URL`.
- Confirm admin and API routes are not intended for indexing.

## 8. Smoke Test After Deployment

Public:

- `/`
- `/shop`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/track-order`
- `/contact`
- `/blog`
- `/account`

Admin:

- `/admin/login`
- `/admin`
- `/admin/orders`
- `/admin/products`

Flows:

- Add product to cart.
- Submit COD order.
- Submit bKash order.
- Submit Nagad order.
- Track an order.
- Update order status.
- Verify manual payment.
- Create/edit/archive/republish a product.
- Upload a product image.

Demo polish:

- Confirm demo products look intentional.
- Clean or clearly label test orders.
- Share demo admin credentials privately only when needed.
