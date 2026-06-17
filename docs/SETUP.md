# TinyTots BD Setup Guide

This guide prepares the starter pack for a new client store.

## 1. Install

```bash
npm install
npm run dev
```

## 2. Environment Variables

Create `.env.local` from `.env.example`.

Required for core storefront and checkout:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Required for admin:

- `ADMIN_EMAILS`

Optional but recommended for production:

- `NEXT_PUBLIC_SITE_URL`

Optional for email notifications:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`

Do not commit `.env.local` or real keys.

## 3. Supabase

1. Create a Supabase project.
2. Apply migrations in `supabase/migrations` in timestamp order.
3. Confirm `orders`, `order_items`, and `products` exist.
4. Confirm the `product-images` Storage bucket exists.
5. Confirm RLS is enabled.
6. Confirm public product reads only return active products.

See [SUPABASE.md](SUPABASE.md).

## 4. Admin User

1. Create the owner account manually in Supabase Auth.
2. Confirm the email address.
3. Add that email to `ADMIN_EMAILS`.
4. Restart the app.
5. Visit `/admin/login`.

## 5. Client Store Customization

Update:

- `lib/site-config.ts` for business name, phone, WhatsApp, address, delivery fees, and default SEO.
- Public brand assets in `public/`.
- Product/category content in Supabase admin after migrations are applied.
- Colors in `app/globals.css` if the client brand requires it.

See [TEMPLATE_CUSTOMIZATION.md](TEMPLATE_CUSTOMIZATION.md).

## 6. Email Notifications

Email hooks are implemented but optional. Real delivery requires:

- Client sending domain
- Verified sender domain in Resend
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`
- Final live delivery test

Missing Resend config or provider failure does not block checkout or admin status updates.

## 7. Local Validation

```bash
npm run lint
npm run build
npm audit
```

Then test:

- Home
- Shop
- Product detail
- Cart
- Checkout
- Track order
- Admin login
- Admin orders
- Admin products
