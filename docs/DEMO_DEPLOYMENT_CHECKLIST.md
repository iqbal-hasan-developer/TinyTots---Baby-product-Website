# Demo Deployment Checklist

Use this checklist before deploying or presenting the TinyTots BD E-commerce Starter Pack demo.

## Supabase

- Supabase project created for the demo.
- Migrations applied in timestamp order.
- `orders`, `order_items`, and `products` tables exist.
- Demo products are seeded or intentionally replaced.
- RLS is enabled.
- Public product reads return active products only.
- Public product writes are blocked.
- `product-images` bucket exists.
- Product image upload works from admin.

## Admin Access

- Demo admin user created manually in Supabase Auth.
- Demo admin email added to `ADMIN_EMAILS`.
- `/admin/login` works locally.
- `/admin` redirects unauthenticated users to login.
- Demo admin credentials are stored privately only.
- Do not put demo admin credentials in docs, screenshots, videos, commits, or public messages.

## Vercel

- Vercel project created.
- Repository connected.
- Install command set to `npm install`.
- Build command set to `npm run build`.
- All required environment variables added.
- `NEXT_PUBLIC_SITE_URL` set to the demo production URL.
- Deployment succeeds.

## Environment Variables

Core:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Admin:

- `ADMIN_EMAILS`

Site URL:

- `NEXT_PUBLIC_SITE_URL`

Optional email:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`

## Demo Data

- Demo products look polished.
- Temporary QA products archived or removed if safe.
- Test orders cleaned or clearly marked.
- No real customer data is used in a public demo.
- Uploaded demo images are intentional and not broken.
- Inventory quantities are set high enough for repeated demo checkouts.

## Public Route Checks

- `/`
- `/shop`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/track-order`
- `/contact`
- `/blog`
- `/account`
- `/robots.txt`
- `/sitemap.xml`

## Admin Route Checks

- `/admin/login`
- `/admin`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`

## Flow Checks

- Add product to cart.
- Select variant if available.
- Submit COD order.
- Submit bKash order.
- Submit Nagad order.
- Track an order with order number and phone.
- Update order status in admin.
- Verify manual payment in admin.
- Create/edit/archive/republish a product.
- Upload product image.
- Confirm stock/inventory behavior.

## Mobile QA

- Home page mobile.
- Shop page mobile.
- Product detail mobile.
- Cart and checkout mobile.
- Track order mobile.
- Admin dashboard mobile.
- Admin order detail mobile.
- Admin product form mobile.

## Final Demo Readiness

- Sitemap and robots use production URL.
- No secrets are visible in UI, docs, screenshots, or videos.
- Demo admin credentials are shared privately only when needed.
- Resend live email is either configured with a verified domain or explained as optional client-domain setup.
