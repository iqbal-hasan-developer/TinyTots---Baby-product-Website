# Feature List

This is a client-friendly overview of what the E-commerce Starter Pack includes.

## Storefront

- Mobile-friendly home page
- Shop page with product browsing
- Product detail pages
- Product images and galleries
- Product badges and old-price display
- Search, category filtering, and sorting
- Contact page
- Blog and account placeholders for future expansion

## Product Management

- Admin product list
- Create products
- Edit products
- Archive and republish products
- Product categories
- Product SEO fields
- Featured products
- Product badges

## Cart And Checkout

- Add to cart
- Quantity handling
- Variant selection
- Cart totals
- Checkout customer details
- Delivery fee calculation
- Server-side trusted order total calculation

## Payment Methods

- Cash on Delivery
- bKash manual payment flow
- Nagad manual payment flow
- Admin manual payment verification

## Order Management

- Saved orders in Supabase
- Admin order dashboard
- Orders list
- Order detail view
- Order status update
- Payment status update
- Order item snapshots

## Inventory

- Stock quantity field
- Inventory tracking toggle
- Out-of-stock handling
- Server-side stock validation
- Stock decrement after successful order

## Image Upload

- Supabase Storage product image uploads
- JPG, PNG, and WebP support
- Admin-only upload route
- Public product image rendering

## Customer Order Tracking

- Public tracking page
- Requires order number and phone number
- Shows safe order status, payment status, items, and totals
- Hides private address, email, internal IDs, and admin notes

## Email Notifications

- Customer order confirmation hook
- Admin new-order notification hook
- Customer order status update hook
- Customer payment status update hook
- Optional Resend integration
- Non-blocking behavior if email is not configured

## SEO And Deployment

- Metadata defaults
- Product metadata
- Sitemap
- Robots file
- Product structured data
- Store structured data
- Vercel deployment guide

## Security And Admin

- Supabase Auth admin login
- Server-side `ADMIN_EMAILS` allowlist
- RLS-enabled database setup
- Server-only service-role usage
- Protected admin APIs
- Public product writes blocked
- Admin-only image uploads

## Template Customization

- Business name and contact settings
- WhatsApp and phone settings
- Delivery fees
- Payment method wording
- Brand colors and assets
- Product categories
- Product data through admin
