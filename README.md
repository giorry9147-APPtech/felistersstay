# Felister Stays

Premium booking website for Felister's three coastal homes in Mtwapa, Kenya — direct bookings paid through M-Pesa, with two-way calendar sync to Airbnb &amp; Booking.com.

## What's inside

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · Prisma + SQLite · next-intl (EN / NL / SW)
- **Pages:** marketing site, 3 property detail pages with photo gallery + map + reviews, full booking flow, admin panel
- **Payments:** Safaricom Daraja STK Push (M-Pesa) — sandbox-ready, production-toggleable
- **Calendar sync:** iCal feed export per property + import from Airbnb &amp; Booking iCal URLs
- **Languages:** English, Nederlands, Kiswahili — all switchable, currency toggle KES/USD/EUR

## Quick start

```powershell
npm install
copy .env.example .env       # then fill in real values
npx prisma db push           # creates SQLite db
npm run db:seed              # adds the 3 properties + sample reviews
npm run dev                  # http://localhost:3000
```

Default admin password: `felister2026` (change `ADMIN_PASSWORD` in `.env`).
Admin panel: http://localhost:3000/admin

## Setup checklist for going live

### 1. Photos
The seed uses Unsplash placeholders. Replace per property:
- Open `/admin/properties/<slug>` → paste real photo URLs (one per line) into "Photo URLs".
- Recommended: upload originals to Cloudinary or Vercel Blob, paste those URLs.
- Allowed image hosts are configured in `next.config.ts` (`remotePatterns`) — add yours there.

### 2. M-Pesa Daraja
1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke).
2. Create a production app for "Lipa na M-Pesa Online" (STK Push).
3. Fill in `.env`:
   ```
   MPESA_ENV=production
   MPESA_CONSUMER_KEY=...
   MPESA_CONSUMER_SECRET=...
   MPESA_PASSKEY=...
   MPESA_SHORTCODE=...           # your Paybill / Till
   MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
   ```
4. The callback URL must be **publicly reachable** — for local testing use `ngrok` or `cloudflared`.

### 3. Calendar sync (iCal)
For each of the 3 properties:

**A. Give our feed to Airbnb &amp; Booking** (so they close dates we book):
- Our feed URL: `https://yourdomain.com/api/ical/<slug>/feed.ics`
- Airbnb: Listing → Calendar → Availability → "Sync calendars" → "Import calendar" → paste URL.
- Booking.com: Extranet → Rates &amp; Availability → "Sync calendars" → add iCal feed → paste URL.

**B. Read their feeds** (so dates booked on Airbnb / Booking close on our site):
- Airbnb: same Sync page → "Export calendar" → copy URL → paste in `/admin/properties/<slug>` → Airbnb iCal field.
- Booking.com: same Sync page → "Export calendar" → copy URL → paste in Booking iCal field.
- Trigger sync: `/admin/sync` → "Sync now". For automatic hourly sync, schedule a hit to `GET /api/ical/sync?token=<SYNC_TOKEN>` (Vercel Cron, GitHub Actions, or any scheduler).

**Note on lag:** Airbnb / Booking poll iCal feeds every 1–4 hours. This is the OTA limit, not ours.
For real-time sync upgrade to a Channel Manager (Smoobu, Hostaway, SiteMinder).

### 4. WhatsApp + branding
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Felister's WhatsApp (international format, no `+`).
- `NEXT_PUBLIC_CONTACT_EMAIL` — booking inbox.
- `NEXT_PUBLIC_SITE_URL` — production URL (used in M-Pesa callback &amp; iCal feeds).

### 5. Deploy
- Recommended: **Vercel** (zero-config for Next.js 15).
- Switch DB to Postgres (Neon free tier) for production: change `provider` in `prisma/schema.prisma` and `DATABASE_URL`.
- Add a Vercel Cron entry for `/api/ical/sync?token=...` every hour.

## Project layout

```
src/
├── app/
│   ├── [locale]/             # All public pages (i18n routing)
│   │   ├── page.tsx          # Homepage
│   │   ├── stays/            # Properties index + detail + booking flow
│   │   ├── about/, contact/  # Marketing
│   │   └── admin/            # Admin panel (password-gated)
│   └── api/
│       ├── bookings/         # Create + status
│       ├── mpesa/            # STK push + callback
│       ├── ical/             # Per-property feed + sync trigger
│       └── admin/            # Logout
├── components/
│   ├── home/                 # Hero, featured, why-direct, testimonials, CTA
│   ├── property/             # Detail, gallery, map, reviews, booking widget
│   ├── booking/              # Booking form + M-Pesa payment flow
│   ├── stays/, site/, ui/    # Grid, header, footer, primitives
├── lib/
│   ├── mpesa.ts              # Daraja SDK helpers
│   ├── ical.ts               # iCal export + import
│   ├── auth.ts               # Admin cookie auth
│   ├── db.ts, utils.ts       # Prisma client + helpers
│   └── properties-data.ts    # Seed content (replace photos here too)
├── messages/                 # en.json, nl.json, sw.json
├── i18n/                     # Routing + request config
└── middleware.ts             # next-intl locale middleware
prisma/
├── schema.prisma             # Properties, bookings, blocked dates, reviews
└── seed.ts                   # Populate from properties-data.ts
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server on `:3000` |
| `npm run build` | Production build |
| `npm run db:push` | Sync schema → SQLite DB |
| `npm run db:seed` | Re-seed properties + reviews |
| `npm run db:studio` | Visual DB browser |

## License

© Felister Stays. All rights reserved.
