# TinyTots BD

A modern, mobile-first baby products eCommerce frontend built with Next.js, TypeScript, and Tailwind CSS.

TinyTots BD is a premium Bangladesh-focused baby care eCommerce template featuring a clean shopping experience, bilingual Bangla-English support, responsive UI, cart functionality, WhatsApp ordering flow, and SEO-ready architecture.

---

# ✨ Features

## 🛍 eCommerce Frontend

* Product listing page
* Product details page
* Cart system
* Checkout UI
* Product bundles
* Related products
* Add-to-cart toast notifications

## 📱 Mobile-First Experience

* Responsive layout
* Bottom mobile navigation
* Mobile hamburger menu
* Optimized mobile product cards
* Touch-friendly interactions

## 🌐 Bangla-English Language Toggle

* English and Bangla UI support
* Persistent language selection
* Bilingual product content
* Bilingual blog content

## 🎨 Premium UI Design

* Soft pastel baby-brand aesthetic
* Framer Motion animations
* Clean modern product cards
* Premium hero section
* Smooth transitions and interactions

## 📦 Product & Content System

* Centralized product data
* Centralized blog data
* Reusable configuration system
* Easy image replacement
* Reusable template structure

## 🔍 SEO Ready

* Metadata setup
* Structured page layout
* Blog section
* Sitemap support
* Robots configuration

---

# 🛠 Tech Stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* Framer Motion
* Zustand
* Lucide React

---

# 📂 Project Structure

```bash
app/
components/
lib/
public/
```

Important folders:

```bash
app/                 # Next.js pages and routes
components/          # Reusable UI components
lib/                 # Config, products, blog data, utilities
public/              # Images and static assets
```

---

# ⚙️ Configuration

Business configuration is centralized in:

```bash
lib/site-config.ts
```

You can easily change:

* Business name
* Phone number
* WhatsApp number
* Email
* Address
* Social links
* Delivery fees
* SEO metadata

---

# 🛍 Product Data

Products are managed in:

```bash
lib/products.ts
```

Each product supports:

* English name
* Bangla name
* Description
* Bangla description
* Price
* Old price
* Rating
* Stock status
* Product images
* Product gallery
* Variants
* Bundle support

---

# 📰 Blog Data

Blogs are managed in:

```bash
lib/blog.ts
```

Supports:

* English title
* Bangla title
* Excerpt
* Bangla excerpt
* Category
* Read time
* Featured image

---

# 🌐 Language System

The bilingual language system is powered by a lightweight custom translation setup.

Translation files:

```bash
lib/i18n/translations.ts
```

Language provider:

```bash
lib/i18n/language-context.tsx
```

---

# 🖼 Images

Recommended image structure:

```bash
public/
  brand/
  products/
  blog/
```

Recommended sizes:

* Product images → 800x800 px
* Blog images → 1200x700 px
* Hero image → 1200x900 px
* Logo → SVG or transparent PNG

---

# 🚀 Getting Started

## Install dependencies

```bash
npm install
```

## Run development server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Build for production

```bash
npm run build
```

## Run lint

```bash
npm run lint
```

---

# 📱 Main Pages

* Home
* Shop
* Product Details
* Cart
* Checkout
* Blog
* Contact
* Account

---

# 🔮 Future Backend Integration

The frontend is designed to be easily connected with:

* Firebase
* Supabase
* Stripe
* SSLCommerz
* bKash
* Nagad

Planned future features:

* Admin dashboard
* Product management
* Order management
* Authentication
* Payment gateway integration
* Customer accounts

---

# 📦 Deployment

Recommended deployment platform:

* Vercel

Deployment steps:

```bash
npm run build
```

Then connect the GitHub repository to Vercel.

---

# 📄 License

This project is for educational, portfolio, and commercial template usage.

---

# 👶 TinyTots BD

Premium baby essentials deliv
