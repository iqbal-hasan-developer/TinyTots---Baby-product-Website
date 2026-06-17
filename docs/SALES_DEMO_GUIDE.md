# Sales Demo Guide

Use this guide when presenting the E-commerce Starter Pack to a potential client.

## 5-Minute Demo Flow

1. Open the home page and explain that the storefront is already mobile-friendly and brandable for many product businesses.
2. Open `/shop`, filter/search products, and show product cards.
3. Open a product detail page and show images, price, variants, stock state, and add to cart.
4. Add a product to cart and go to checkout.
5. Explain COD, bKash, and Nagad as order methods with manual payment verification.
6. Show the success state and order number.
7. Open `/track-order` and explain customer self-service tracking.
8. Log in to `/admin` and show orders, payment verification, and product management.

## 10-Minute Detailed Demo Flow

1. Storefront overview: home, shop, product detail, cart, checkout, tracking.
2. Product management: create a demo product, upload an image, set price, stock, variants, and active status.
3. Public reflection: show that the product appears in the shop when active and disappears when archived.
4. Checkout: submit a COD order and explain that totals are recalculated on the server.
5. Manual payments: submit or explain bKash/Nagad orders and show admin payment status verification.
6. Order management: open order detail, update order status, verify payment, and explain customer tracking updates.
7. Inventory: show stock quantity and explain stock-aware checkout.
8. Email hooks: explain that Resend notifications are already coded but require the client's verified email domain before live delivery.
9. Handoff: explain admin training, deployment, and post-launch support.

## Public Pages To Show First

- `/` for the branded storefront impression
- `/shop` for browsing, search, category filters, and sorting
- `/products/[slug]` for image gallery, stock state, variants, and add to cart
- `/cart` and `/checkout` for the buyer journey
- `/track-order` for customer self-service after purchase

## Best Features To Show First

- Product CRUD from the admin panel
- Real Supabase order saving
- Manual bKash/Nagad verification
- Customer order tracking by order number and phone
- Product image upload
- Inventory quantity and variants
- Mobile storefront

## Product CRUD Demo

Create a temporary product with:

- A clear demo name
- One uploaded image
- Price and old price
- One simple variant group, such as Size or Pack
- Inventory tracking enabled
- Active status enabled

Then show it in the public shop, edit the price, archive it, and republish it.

## Image, Inventory, And Variant Demo

- Upload one product image from the admin form and show it on the public product page.
- Enable inventory tracking, set a small stock quantity, and explain stock-aware checkout.
- Add one variant group, such as Size, Color, Pack, or Weight.
- Add the product to cart with a selected variant and show that the order item keeps the variant summary.

## Order Flow Demo

Use a real test order with safe demo customer data. Show:

- Add to cart
- Checkout validation
- COD order save
- Admin order detail
- Order status update
- Customer tracking page

## Explaining bKash/Nagad

Position bKash and Nagad as manual payment methods in this version. The customer places an order, the owner verifies payment manually from the admin panel, and the payment status changes to verified. The client's merchant or personal account details can be added to the store copy. Real gateway integration is a future upgrade.

## Explaining Email Notifications

Email notification hooks are implemented. Live delivery needs:

- Client sender domain
- Resend domain verification
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`
- Final live test

For demos without a verified client domain, explain email as an optional production setup item rather than a blocker.

## Common Client Questions

**Can I manage products myself?**  
Yes. Admins can create, edit, archive, republish, upload images, set stock, and manage variants.

**Can customers pay online?**  
This version supports COD and manual bKash/Nagad order flow. Real payment gateway integration can be added later.

**Can customers track orders?**  
Yes. They enter order number and phone number on `/track-order`.

**Can this work for my business type?**  
Yes, as long as the business sells catalog products. It can be adapted for baby products, fashion, cosmetics, mango or seasonal products, simple food/product sellers, Facebook sellers, Instagram sellers, and small retail.

**Will I get notifications?**  
Email hooks are implemented. Live email delivery requires verified domain setup.

**Is the admin private?**  
Yes. Admin access uses Supabase Auth plus a server-side email allowlist.
