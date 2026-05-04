# Deploy naar Vercel — exacte stappen

## 1. Vercel project aanmaken

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. "Import Git Repository" → kies `giorry9147-APPtech/felistersstay`
3. Framework Preset wordt automatisch herkend als **Next.js**
4. Klik nog niet op Deploy — eerst stap 2

## 2. Postgres database toevoegen (gratis)

In Vercel project settings:
1. Tab **Storage** → "Create Database" → "Postgres" (of "Neon")
2. Naam bv. `felister-db`, regio bv. `Frankfurt (fra1)` (dichtstbij Kenia van EU regio's)
3. Klik **Create** — Vercel zet automatisch `DATABASE_URL` in je env vars

## 3. Environment variables zetten

Settings → Environment Variables. Voeg de volgende toe (allemaal als "Production, Preview, Development"):

```
# M-Pesa (sandbox waarden — werken voor test, vervang door productie-keys later)
MPESA_ENV                 = sandbox
MPESA_CONSUMER_KEY        = kOKfnUxszjGfJdBjooj6Yb739NUtsJHqDM4Bld3ARuLVgtYS
MPESA_CONSUMER_SECRET     = FPkKADEUAOylbtSpxb6xW5CCdlmZADMA11pYFfmjAp3esfk6aoQsosfh71Tca7Cr
MPESA_PASSKEY             = bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE           = 174379
MPESA_CALLBACK_URL        = https://<je-vercel-domein>/api/mpesa/callback

# Admin paneel
ADMIN_PASSWORD            = <verzin een sterk wachtwoord>
ADMIN_SECRET              = <random 64-cijferige string, gen via openssl rand -hex 32>

# Site
NEXT_PUBLIC_SITE_URL      = https://<je-vercel-domein>
NEXT_PUBLIC_WHATSAPP_NUMBER = 254XXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL = bookings@felisterstays.com
```

`DATABASE_URL` wordt automatisch gezet door de Postgres-integratie uit stap 2.

`CRON_SECRET` wordt automatisch gezet door Vercel zodra crons actief zijn.

## 4. Deploy

Klik **Deploy**. Wat er gebeurt:
1. Vercel installeert dependencies (`npm install`)
2. Build script runt: `prisma generate && prisma db push && npm run db:seed && next build`
   - **prisma db push** → maakt automatisch alle tabellen op de fresh Postgres DB
   - **npm run db:seed** → vult de 3 properties + reviews
   - **next build** → bouwt de site
3. Site is live op `https://felistersstay-xxx.vercel.app`

Eerste build duurt ±2 minuten. Daarna ±30 seconden per deploy.

## 5. Domein koppelen (optioneel)

1. Settings → Domains → "Add Domain"
2. Tik bv. `felisterstays.com` → Vercel toont DNS-records
3. Bij domain registrar (Namecheap/Hostinger): voeg de A/CNAME records toe
4. Wacht ±10 min — SSL wordt automatisch geregeld

Vergeet niet om in de env vars `NEXT_PUBLIC_SITE_URL` en `MPESA_CALLBACK_URL` aan te passen naar het echte domein, en daarna te re-deployen (Deployments tab → "Redeploy").

## 6. Verifieer dat alles werkt

Na deploy, check:

| URL | Verwacht resultaat |
|---|---|
| `/` | Homepage met hero + 3 properties |
| `/stays` | Lijst met 3 stays |
| `/stays/villa-by-the-beach` | Detail villa |
| `/stays/sunny-sands-beach-apartment-3` | Detail apt 3 |
| `/stays/sunny-sands-beach-apartment-5` | Detail apt 5 met "New listing" badge |
| `/admin/login` | Login form |
| `/api/ical/villa-by-the-beach/feed.ics` | iCal feed (`BEGIN:VCALENDAR...`) |

Test M-Pesa STK Push via een echte boeking-flow (sandbox kost niets).

## 7. Cron job iCal sync

`vercel.json` heeft al een cron geconfigureerd die elk uur `/api/ical/sync` aanroept. Vercel zet automatisch `CRON_SECRET` zodat alleen Vercel's cron deze kan triggeren. Je hoeft niets te doen.

In Vercel dashboard → Cron Jobs zie je de status.

**Beperking gratis tier**: 2 cron jobs / 100 invocations per dag. Voor 1× per uur = 24/dag — ruim binnen limiet.

## 8. Updates pushen

Lokaal:
```bash
git add .
git commit -m "Beschrijving"
git push
```
Vercel detecteert automatisch en deployt opnieuw.

## Troubleshooting

### Build faalt op `prisma db push`
- Check dat `DATABASE_URL` is gezet in Vercel env vars
- Check dat Postgres database actief is (Vercel → Storage)

### Site laadt maar properties zijn leeg
- Build heeft seed niet gedraaid → handmatig: Vercel CLI lokaal: `vercel env pull && npm run db:seed`

### M-Pesa STK Push geeft "Invalid CallBackURL"
- `MPESA_CALLBACK_URL` env var moet exact je publieke domein + `/api/mpesa/callback` zijn
- Geen trailing slash, HTTPS verplicht

### Admin login werkt niet
- Check dat `ADMIN_PASSWORD` env var is gezet
- Standaard wachtwoord `felister2026` werkt alleen lokaal (zonder env var)

## Lokaal blijven werken (na schema-wijziging naar Postgres)

Mijn `schema.prisma` wijst nu naar Postgres. Voor lokale dev heb je 2 opties:

**Optie A — gebruik dezelfde Vercel Postgres lokaal:**
```bash
vercel env pull              # download productie env naar .env.local
npm run dev                  # gebruikt nu de productie-DB
```
⚠️ Werk je hier met test-data? Pas op — wijzigingen gaan naar productie.

**Optie B — schakel lokaal terug naar SQLite:**
```bash
# In prisma/schema.prisma tijdelijk: provider = "sqlite"
# In .env: DATABASE_URL="file:./dev.db"
# NIET committen
```
Aanbevolen voor experimenteren zonder productie te raken.
