# Sanjay Communications — Premium Ecommerce

A full-stack, Apple-inspired ecommerce platform for **Sanjay Communications** — selling the latest mobile phones and accessories.

Built with **Next.js 14 (App Router)** · **TypeScript** · **Tailwind CSS** · **MongoDB / Mongoose** · **NextAuth** · **Razorpay**.

---

## ✨ Features

### Storefront
- Apple-inspired hero, category grid, featured / new / best-seller sections
- Product listing with category filter, product detail page with gallery, specs and related items
- Cart (persistent via localStorage), full checkout flow with Razorpay **and** Cash on Delivery
- Authentication via **email + password** *or* **mobile + OTP** (Twilio integration; falls back to console logging in development)
- "My Orders" page with live order/payment status
- About, Contact pages
- Fully responsive, mobile-first, smooth animations

### Admin Panel (`/admin`, role-protected)
- **Overview** — total sales, orders, products, customers + last-7-days revenue chart
- **Products** — list, filter by category, add/edit/delete with image upload (Cloudinary) or URL paste, stock & pricing, featured/new/bestseller toggles, key-value specifications
- **Orders** — view all orders, expand for details, update order & payment status
- **Customers** — directory of registered users
- **Banners** — manage the homepage hero banner(s)

---

## 📁 Folder structure

```
.
├─ src/
│  ├─ app/                 # Next.js App Router pages
│  │  ├─ (storefront pages)
│  │  ├─ admin/            # Admin dashboard
│  │  └─ api/              # API routes
│  ├─ components/          # Reusable UI components
│  ├─ lib/                 # db connect, auth, cart store, helpers
│  ├─ models/              # Mongoose schemas
│  ├─ scripts/seed.ts      # DB seeder
│  └─ types/               # TS augmentations
├─ public/
├─ .env.example
├─ next.config.js
├─ tailwind.config.ts
└─ tsconfig.json
```

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` → `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

**Required:**
- `MONGODB_URI` — get a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `JWT_SECRET` — same idea, separate value
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — your admin login

**For payments (live or test):**
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` — get from [Razorpay Dashboard](https://dashboard.razorpay.com)

**Optional:**
- `TWILIO_*` — to send real SMS OTPs (otherwise OTP appears in the server console / dev toast)
- `CLOUDINARY_*` — to upload product images from the admin panel (otherwise paste image URLs)

### 3. Seed the database

This creates the admin user and inserts ~25 sample products plus a default banner:

```bash
npm run seed
```

You'll see the admin email + password printed at the end.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — and the admin at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🔐 Admin access

Sign in at `/login` with the email/password you set in `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
You'll be redirected to `/admin` automatically because your account has `role: "admin"`.

To rotate the admin password later, change `ADMIN_PASSWORD` in `.env.local` and run `npm run seed` again.

---

## 💳 Payments

Configured for **Razorpay (India)** via the Standard Checkout JS.

- **Test mode**: use Razorpay test keys (start with `rzp_test_`) and the [test card numbers](https://razorpay.com/docs/payments/payments/test-card-details/).
- **Live**: swap to `rzp_live_*` keys in `.env.local`.
- **COD**: customers can also place orders with cash on delivery — you control the order status from the admin panel.

The verification flow uses HMAC-SHA256 signature validation server-side before marking an order as **paid**.

---

## 📱 Mobile OTP

- If `TWILIO_*` env vars are set, OTPs are sent via real SMS.
- Otherwise (dev mode) the OTP is logged to the server console **and** returned in the API response so a toast pops up — convenient for local testing.

In production, **always** configure Twilio (or any other SMS provider — easy to swap by editing `src/app/api/auth/send-otp/route.ts`).

---

## 🖼️ Image uploads

The admin product / banner forms support **two ways** to add images:

1. **Upload a file** — requires Cloudinary env vars. Files are uploaded directly to your Cloudinary account under the `sanjay-communications/` folder.
2. **Paste a URL** — works with any publicly accessible HTTPS image. Useful while testing.

If you use a CDN other than Cloudinary, add its hostname to `next.config.js` → `images.remotePatterns`.

---

## ☁️ Deployment

### Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add **all the env vars from `.env.local`** in the Vercel project settings → Environment Variables.
4. Deploy.
5. After the first deploy, set `NEXTAUTH_URL` in Vercel to your production URL (e.g. `https://sanjaycommunications.vercel.app`) and redeploy.
6. Run the seed once against your production DB — easiest is to set `MONGODB_URI` locally to your prod URI, then run `npm run seed`.

### Self-hosting

```bash
npm run build
npm start
```

Make sure `NEXTAUTH_URL` matches the public URL of the deployment.

---

## 🛠️ Tech stack rationale

| Concern         | Choice                       | Why                                                 |
|-----------------|------------------------------|------------------------------------------------------|
| Framework       | Next.js 14 App Router        | RSC + server actions + edge-ready APIs               |
| Styling         | Tailwind CSS + custom tokens | Fast iteration, consistent Apple-inspired design     |
| Database        | MongoDB + Mongoose           | Flexible schema for products + specs maps            |
| Auth            | NextAuth (Credentials × 2)   | Email/password + Phone/OTP without external IdP      |
| Payments        | Razorpay Standard Checkout   | First-class India support, UPI / cards / netbanking  |
| State           | Zustand (cart)               | Tiny, persistent, no Redux boilerplate               |
| Images          | Cloudinary                   | Free tier, fast CDN, easy uploads                    |
| OTP             | Twilio                       | Reliable SMS — easily swappable                      |

---

## 🗒️ Notes

- The cart persists in `localStorage` under the key `sc-cart`.
- All admin endpoints check `session.user.role === "admin"` — protected at the API layer, not just the UI.
- Order IDs displayed to users are the last 8 hex chars of the Mongo `_id`, uppercased.
- Free shipping kicks in at **₹999** subtotal (configurable in `src/app/cart/page.tsx` and `src/app/checkout/page.tsx`).

---

## 📄 License

Private — © Sanjay Communications. All rights reserved.

---

### Quick test flow

1. `npm run seed`
2. `npm run dev`
3. Browse `/`, add 2–3 items to cart, go to `/checkout`
4. Sign in via OTP (use any 10-digit number — OTP appears as a toast in dev mode)
5. Place a COD order → check `/orders`
6. Sign out, sign in as admin → `/admin/orders` → mark the order as **shipped**
7. Refresh `/orders` as the user — status updates live ✅
