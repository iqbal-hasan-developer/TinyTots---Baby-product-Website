# Supabase Setup Guide

Apply the SQL files in `supabase/migrations` in timestamp order.

## Migration Order

1. `20260615000000_create_orders.sql`
   - Creates `orders` and `order_items`
   - Enables RLS
   - Adds order constraints and `updated_at` trigger

2. `20260616000000_add_verified_payment_status.sql`
   - Adds `verified` to allowed payment statuses

3. `20260617000000_create_products.sql`
   - Creates `products`
   - Enables RLS
   - Adds public active-product read policy
   - Seeds TinyTots demo products

4. `20260618000000_phase6_storage_inventory_variants.sql`
   - Adds inventory fields
   - Adds selected variant snapshots to order items
   - Creates or updates `product-images` bucket
   - Adds public read policy for product images
   - Adds `create_order_with_inventory` RPC for transactional order creation and stock decrement

## How To Apply

Use Supabase SQL Editor, Supabase CLI, or your migration workflow. For SQL Editor, open each migration file, run it, then continue to the next one.

## Post-Migration Checks

In Supabase:

- `orders` exists.
- `order_items` exists.
- `products` exists.
- `products` contains demo rows.
- `product-images` bucket exists.
- RLS is enabled on `orders`, `order_items`, and `products`.
- The only public product policy is active-product SELECT.
- There are no public product insert/update/delete policies.
- Storage public access is read-only for `product-images`.
- Product upload/write happens through protected admin API routes.

## Access Model

- Public users can read active products.
- Public users cannot read private orders.
- Public users cannot write products.
- Public users cannot upload product images.
- Order creation uses a Next.js server route and Supabase service-role client.
- Admin product/order operations require Supabase Auth plus `ADMIN_EMAILS`.

## Order Creation Safety

The order route:

- Validates customer input.
- Requires cart items.
- Looks up products server-side.
- Recalculates prices from Supabase products.
- Recalculates subtotal, delivery fee, and total.
- Rejects inactive or unavailable products.
- Enforces stock quantity when tracking is enabled.
- Writes orders and order items through the service-role path.

## Storage Notes

Bucket: `product-images`

Allowed MIME types:

- `image/jpeg`
- `image/png`
- `image/webp`

Suggested maximum size: 5 MB.

Only allowlisted admins should upload through `/api/admin/products/images`.
