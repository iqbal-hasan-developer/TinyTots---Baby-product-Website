# Demo Data And Reset Guide

Use this guide to keep demo and client projects clean.

## Safe Demo Data

The TinyTots BD products seeded by `20260617000000_create_products.sql` are demo products. They are safe to keep for demos, archive for client stores, or replace through the admin panel.

Temporary QA products should be clearly named, for example:

- `QA Test Product`
- `Phase Demo Product`
- `Temporary Demo Product`

Temporary QA orders should use obvious names and phone numbers so they can be identified later.

## How Demo Products Are Seeded

Demo products are inserted by the products migration using stable slugs. Re-running the migration should not create duplicate slugs because the seed uses conflict-safe behavior.

## Archive Demo Products For A Client

Preferred approach:

1. Log in to `/admin`.
2. Open `/admin/products`.
3. Edit or archive demo products that should not appear publicly.
4. Add the client's real products.
5. Confirm the public shop only shows active client products.

Avoid hard-deleting products that may be referenced by real orders. Existing orders store item snapshots, but keeping product history is still safer for support.

## Clean Temporary Test Orders

For live client projects, avoid deleting real orders. If test orders must be removed, first confirm they are temporary and not needed for accounting or support.

Recommended safe approach:

1. Search for the obvious QA customer name or order note in Supabase.
2. Confirm the order was created for testing.
3. Export or screenshot it if the client wants a record.
4. Delete only those confirmed temporary orders.

Do not run broad delete commands against `orders` in a real client database.

Never delete all products, all orders, all Storage files, or all Auth users from a client project as part of demo cleanup. Use filters, review the selected rows/files first, and keep real customer records intact.

## Clean Temporary Product Images

Temporary uploaded images live in the `product-images` bucket. Remove only files that are clearly test assets and are not used by active products.

Before deleting an image:

1. Check whether any active product references the URL.
2. Archive or update the product first.
3. Remove the file from Storage.

## Prepare A Clean Demo

Before showing a client:

1. Confirm demo products look intentional.
2. Archive old QA products.
3. Remove obvious temporary uploaded images.
4. Keep a few orders available if the admin demo needs order examples.
5. Confirm COD, bKash, Nagad, order tracking, and admin status updates work.
6. Confirm no private customer data is visible in the demo.

## Demo Admin User Safety

- Create a dedicated demo admin user in Supabase Auth if the demo needs admin access.
- Add that email to `ADMIN_EMAILS`.
- Do not place demo credentials in public docs, screenshots, videos, Git commits, or chat transcripts.
- Share demo admin credentials privately only when needed.
- Rotate or delete demo credentials after a public presentation if they were shared.

## Prepare A Fresh Client Supabase Project

1. Create a new Supabase project.
2. Apply migrations in timestamp order.
3. Verify RLS and Storage policies.
4. Create the admin user.
5. Configure environment variables.
6. Add client products through admin.
7. Run a full test order and archive/delete only the test product/order if needed.

No reset script is included intentionally. Resetting production commerce data should always be deliberate and reviewed.
