# TinyTots BD E-commerce Starter Pack

TinyTots BD is a production-oriented Next.js App Router e-commerce starter template for Bangladesh small businesses. It includes a public storefront, Supabase-backed catalog and order flow, protected admin order/product management, product image upload, inventory controls, variants, customer order tracking, and optional Resend email notification hooks.

The demo brand is TinyTots BD, a baby-products shop. The codebase is intended to be reused for client stores by changing configuration, content, products, Supabase project settings, and deployment environment variables.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage
- Resend email hooks
- Zustand cart state
- Lucide icons

## Included Features

- Public home, shop, product detail, cart, checkout, contact, blog placeholder, account placeholder, and order tracking pages
- Supabase product CRUD from protected admin
- Product images through Supabase Storage
- Inventory quantity and stock-aware checkout
- Practical product variants
- COD, bKash, and Nagad order creation
- Server-side trusted product repricing
- Protected admin login through Supabase Auth and `ADMIN_EMAILS`
- Admin order list/detail, status update, and manual payment verification
- Customer order tracking by order number plus phone number
- Optional Resend notifications for new orders and status/payment updates
- SEO basics: metadata, sitemap, robots, product JSON-LD, store JSON-LD

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill values for the client project. Never commit `.env.local`.

Core variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_SITE_URL`

Optional email variables:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`

## Documentation

- [Setup Guide](docs/SETUP.md)
- [Supabase Guide](docs/SUPABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Template Customization Guide](docs/TEMPLATE_CUSTOMIZATION.md)
- [Client Handoff Checklist](docs/CLIENT_HANDOFF.md)
- [Template Package Guide](docs/TEMPLATE_PACKAGE.md)
- [Sales Demo Guide](docs/SALES_DEMO_GUIDE.md)
- [Feature List](docs/FEATURE_LIST.md)
- [Client Onboarding Checklist](docs/CLIENT_ONBOARDING_CHECKLIST.md)
- [Demo Data and Reset Guide](docs/DEMO_DATA_AND_RESET.md)
- [Project Status](docs/PROJECT_STATUS.md)
- [Roadmap](docs/ROADMAP.md)
- [Demo Deployment Checklist](docs/DEMO_DEPLOYMENT_CHECKLIST.md)
- [Portfolio Presentation Guide](docs/PORTFOLIO_PRESENTATION.md)
- [Sales Script](docs/SALES_SCRIPT.md)
- [Screenshot Checklist](docs/SCREENSHOT_CHECKLIST.md)
- [Demo Video Outline](docs/DEMO_VIDEO_OUTLINE.md)

## Starter Pack Workflow

For a new client project:

1. Clone this project into a new repository.
2. Replace the demo TinyTots BD branding and assets.
3. Create a fresh Supabase project and apply the migrations.
4. Configure `.env.local` and deployment environment variables.
5. Create the client admin user in Supabase Auth.
6. Add or import the client's products through `/admin/products`.
7. Run a full demo order, order tracking, admin update, and mobile QA pass.

## Validation

```bash
npm run lint
npm run build
npm run check
npm audit
```

There is currently no separate `typecheck` script; `next build` runs TypeScript checks.

## Important Production Notes

- Supabase service-role access is server-only.
- Admin access requires Supabase Auth plus `ADMIN_EMAILS`.
- Public order tracking requires order number and phone number.
- Public product reads are active-product-only.
- Resend email delivery is optional and client-domain-dependent. Configure a verified sender domain before expecting live email delivery.
