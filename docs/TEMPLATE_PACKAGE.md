# Template Package Guide

TinyTots BD is the demo implementation of a reusable E-commerce Starter Pack for Bangladesh small businesses. It is designed to be cloned, rebranded, connected to a fresh Supabase project, and handed to a store owner with a working admin panel.

## Who It Is For

This starter pack works well for:

- Baby products shops
- Fashion and clothing stores
- Food or restaurant product catalogs
- Cosmetics and skincare sellers
- Mango and seasonal product sellers
- Small retail stores
- Facebook and Instagram sellers who need a proper website
- Simple food and product sellers

## What Is Included

Storefront:

- Home, shop, product detail, cart, checkout, contact, blog placeholder, account placeholder, and order tracking pages
- Mobile-friendly public shopping flow
- Cart and checkout with COD, bKash, and Nagad manual payment options
- Customer order tracking by order number and phone number
- SEO basics, sitemap, robots, product metadata, and structured data

Admin:

- Protected admin login
- Dashboard
- Order list and order detail
- Order status update
- Manual payment verification
- Product create, edit, archive, republish
- Product image upload
- Inventory quantity controls
- Practical product variants
- Manual bKash/Nagad payment verification

Backend:

- Supabase Postgres orders and products
- Supabase Storage product images
- Supabase Auth for admin login
- RLS-enabled database setup
- Server-side trusted checkout calculations
- Stock-aware order creation
- Optional Resend email notification hooks

## What Is Not Included Yet

- Blog/content CRUD
- Customer accounts
- SMS notifications
- Real bKash/Nagad gateway integration
- Courier/delivery tracking integration
- Advanced email template management
- Bulk product import/export
- Full media library
- Advanced variant combination matrix

## Clone It For A New Client

1. Copy or clone the project into a new client repository.
2. Create a fresh Supabase project for the client.
3. Apply the migrations in `supabase/migrations` in timestamp order.
4. Copy `.env.example` to `.env.local` and fill client-specific values.
5. Update `lib/site-config.ts` with the client's name, phone, WhatsApp, delivery fees, address, social links, and SEO defaults.
6. Replace brand assets in `public/`.
7. Create the client's admin user in Supabase Auth.
8. Add the admin email to `ADMIN_EMAILS`.
9. Add or edit products through `/admin/products`.
10. Connect the client domain and set `NEXT_PUBLIC_SITE_URL`.
11. Run the launch checklist in `docs/CLIENT_HANDOFF.md`.

## Per-Client Customization

Customize these areas for every client:

- Brand name, logo, colors, hero image, phone, WhatsApp, email, address, and social links
- Product categories and product data
- Delivery zones and delivery charges
- Enabled payment methods and wording
- bKash/Nagad account type, number, and manual verification process
- Admin users
- Domain and production URL
- Resend sender domain, if email notifications are included

Keep secrets in environment variables only. Never place Supabase keys, Resend keys, or admin credentials in source files or documentation.
