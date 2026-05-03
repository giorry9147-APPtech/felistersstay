# Stappenplan — Felister Stays naar productie

Wat er nog moet gebeuren voordat de site echt online kan, in volgorde van blokkerend → nice-to-have.

Legenda: 🔴 blokkerend (zonder dit gaat de site niet live), 🟡 belangrijk vóór lancering, 🟢 kan na lancering.

---

## 1. 🔴 M-Pesa Daraja productie-credentials

**Waarom blokkerend:** zonder deze keys werkt de hele Mpesa-flow alleen in sandbox-modus (test, geen echte betalingen).

### 1a. Welke API's hebben we precies nodig?

Daraja heeft meerdere API-producten — niet alle zijn nodig:

| API | Wat het doet | Voor onze setup |
|---|---|---|
| **STK Push** (= Lipa Na M-Pesa Online = M-Pesa Express) | Klant betaalt jou via PIN-popup op telefoon | ✅ **Verplicht** — boekings-betaling |
| **B2C** (Business to Customer) | Jij betaalt klant terug (bv. refunds) | 🟡 **Aanbevolen** zodra annulerings-beleid bekend is |
| **C2B** (Customer to Business URLs) | Klant betaalt via M-Pesa menu zonder popup | ❌ Niet nodig |
| **Transaction Status** | Status opvragen van transactie | 🟢 Optioneel — failsafe als callback uitblijft |
| **Account Balance** | Saldo paybill checken via API | ❌ Niet nodig |
| **Reversal** | Transactie terugdraaien | ❌ Niet nodig (B2C is voldoende voor refunds) |

**Status code:** STK Push is **al gebouwd** in `src/lib/mpesa.ts`. B2C bouw ik bij zodra Felister haar annulerings-beleid heeft bepaald (±2 uur werk).

### 1b. Wat Felister moet regelen bij Safaricom

**Eerst** — bedrijfsdocumentatie klaar hebben:
- KRA PIN-certificaat (Keniaanse belasting-ID)
- Bedrijfsregistratie certificaat (Sole proprietor, Partnership, of Ltd)
- Kopie ID/paspoort van eigenaar
- Optioneel: bankrekening-bewijs voor uitbetalingen

**Dan** — Paybill of Till nummer aanvragen (als ze die nog niet heeft):
- **Paybill** (aanbevolen): klant betaalt naar paybill + boekings-referentie. Bv. paybill `247247` + reference `BK-2026-0042`.
- **Till** (eenvoudiger): klant betaalt direct naar till nummer. Geen ruimte voor referentie.
- Aanvragen via M-Pesa Business app of een Safaricom shop.

**Tot slot** — Daraja developer account:
1. Registreren op [developer.safaricom.co.ke](https://developer.safaricom.co.ke) (gratis)
2. Sandbox-app aanmaken → meteen werkbare test-credentials (we hebben hier al mee getest)
3. Productie-app aanmaken → "Go Live" form invullen
4. Producten toevoegen aan productie-app:
   - **Lipa Na M-Pesa Online** (= STK Push) → verplicht
   - **B2C Payment Request** → optioneel, voor refunds
5. Wachten op Safaricom approval (3-10 werkdagen, handmatige check)

### 1c. Credentials die we straks invullen

**Voor STK Push (verplicht):**
```bash
MPESA_ENV="production"
MPESA_CONSUMER_KEY="..."           # Daraja portal → My Apps → Production
MPESA_CONSUMER_SECRET="..."        # Daraja portal → My Apps → Production
MPESA_PASSKEY="..."                # Daraja portal → Lipa Na M-Pesa Online → Production
MPESA_SHORTCODE="..."              # Felister's paybill of till nummer
MPESA_CALLBACK_URL="https://felisterstays.com/api/mpesa/callback"
```

**Voor B2C (alleen als we refunds doen):**
```bash
MPESA_INITIATOR_NAME="..."         # Username gekoppeld aan paybill (krijgt Felister van Safaricom)
MPESA_INITIATOR_PASSWORD="..."     # Wordt versleuteld via Safaricom's public certificate
MPESA_SECURITY_CREDENTIAL="..."    # Pre-versleutelde versie (Daraja portal heeft een tool die dit maakt)
MPESA_B2C_RESULT_URL="https://felisterstays.com/api/mpesa/b2c-result"
MPESA_B2C_TIMEOUT_URL="https://felisterstays.com/api/mpesa/b2c-timeout"
```

### 1d. Eisen aan onze callback-URL

Safaricom belt onze server terug na elke betaling. Eisen waar ik aan voldoe:
- ✅ HTTPS verplicht (geen http)
- ✅ Publiek bereikbaar (geen localhost, geen private network)
- ✅ Geen authenticatie op het endpoint (Safaricom logt niet in)
- ✅ JSON respons `{"ResultCode": 0, "ResultDesc": "Accepted"}` direct teruggeven
- ✅ Whitelist domein in Daraja portal voor productie

**Lokaal testen vóór productie:** `ngrok http 3000` geeft een tijdelijke HTTPS URL die naar `localhost:3000` tunnelt. Plak die URL in `MPESA_CALLBACK_URL` voor sandbox-tests.

### 1e. Wat ik doe zodra Felister de keys heeft

1. `.env` op productie invullen
2. Test-STK-push naar haar eigen telefoon — KES 1 echte betaling
3. Verifiëren dat callback binnenkomt en boeking als "paid" geregistreerd wordt
4. M-Pesa receipt nummer in admin-paneel zichtbaar
5. Live schakelen voor klanten

---

## 2. 🔴 Hosting + domeinnaam

**Waarom blokkerend:** Mpesa kan alleen callbacken naar een echte URL, niet naar `localhost`.

**Aanbevolen stack:**
| Onderdeel | Optie | Kosten |
|---|---|---|
| Hosting | **Vercel** (free tier, zero-config voor Next.js) | €0 |
| Database | **Neon** Postgres (free tier 0.5GB) | €0 |
| Domein | felisterstays.com via Namecheap of Hostinger | ±€12/jr |
| SSL | Automatisch via Vercel | €0 |

**Stappen:**
1. Account op [vercel.com](https://vercel.com) (Felister of namens haar).
2. Repo pushen naar GitHub.
3. Vercel project koppelen aan repo → builds automatisch bij elke commit.
4. Database wisselen van SQLite naar Postgres:
   - In `prisma/schema.prisma` regel `provider = "sqlite"` vervangen door `provider = "postgresql"`
   - In Vercel een Neon Postgres database toevoegen (1 klik integratie)
   - `DATABASE_URL` vult Vercel automatisch
   - `npx prisma db push` + `npm run db:seed` runnen tegen de productie-DB
5. Domein koppelen in Vercel → DNS records bijwerken bij domain registrar.

---

## 3. 🔴 Echte productie-`.env`

**Welke variabelen nog leeg / placeholder zijn:**
```bash
# Site
NEXT_PUBLIC_SITE_URL="https://felisterstays.com"          # ← Felister's echte domein
NEXT_PUBLIC_WHATSAPP_NUMBER="254XXXXXXXXX"                # ← Felister's WhatsApp (intl, zonder +)
NEXT_PUBLIC_CONTACT_EMAIL="bookings@felisterstays.com"    # ← Felister's email

# Admin
ADMIN_PASSWORD="<sterk-wachtwoord>"                       # ← Niet 'felister2026' laten staan
ADMIN_SECRET="<random-64-chars>"                          # ← Voor cookie-signing, generen via `openssl rand -hex 32`

# Cron
SYNC_TOKEN="<random-32-chars>"                            # ← Beveiligt /api/ical/sync endpoint

# M-Pesa (zie stap 1)
MPESA_ENV="production"
MPESA_CONSUMER_KEY="..."
MPESA_CONSUMER_SECRET="..."
MPESA_PASSKEY="..."
MPESA_SHORTCODE="..."
MPESA_CALLBACK_URL="https://felisterstays.com/api/mpesa/callback"

# iCal URLs per property (zie stap 4)
ICAL_VILLA_AIRBNB=""    # Vult Felister via /admin/properties/villa-by-the-beach
ICAL_VILLA_BOOKING=""
ICAL_APT3_AIRBNB=""
ICAL_APT3_BOOKING=""
ICAL_APT5_AIRBNB=""
ICAL_APT5_BOOKING=""
```

---

## 4. 🟡 Kalender-sync met Airbnb + Booking aanzetten

**Waarom belangrijk:** zonder dit krijgt Felister dubbele boekingen (gast boekt op Airbnb hetzelfde weekend dat al via onze site geboekt is).

**Setup duurt ±5 min per property × 3 properties = 15 min totaal.**

### Per property, 4 URLs uitwisselen:

#### A. Onze feed → Airbnb / Booking (zodat zíj weten dat wij geboekt hebben)

**Onze feed-URLs** (klaar voor gebruik na deploy):
```
https://felisterstays.com/api/ical/villa-by-the-beach/feed.ics
https://felisterstays.com/api/ical/sunny-sands-beach-apartment-3/feed.ics
https://felisterstays.com/api/ical/sunny-sands-beach-apartment-5/feed.ics
```

**Op Airbnb plakken:**
1. Listing openen → Calendar → Availability → "Sync calendars"
2. Klik "Import calendar"
3. Plak onze URL, geef naam "Felister Stays Direct"
4. Save

**Op Booking.com plakken:**
1. Extranet → Rates & Availability → "Sync calendars"
2. "Add iCal calendar"
3. Plak onze URL
4. Save

#### B. Hun feed → onze site (zodat wij weten wat zij geboekt hebben)

**Op Airbnb (per listing):**
1. Listing → Calendar → Availability → Sync calendars
2. Klik "Export calendar"
3. Kopieer URL
4. Bij ons: `/admin/properties/<slug>` → Airbnb iCal veld → plakken → save

**Op Booking.com (per listing):**
1. Extranet → Rates & Availability → Sync calendars
2. "Export calendar"
3. Kopieer URL
4. Bij ons: `/admin/properties/<slug>` → Booking iCal veld → plakken → save

#### C. Cron aanzetten zodat wij elk uur Airbnb/Booking ophalen

In Vercel `vercel.json` toevoegen:
```json
{
  "crons": [{
    "path": "/api/ical/sync?token=<SYNC_TOKEN-uit-env>",
    "schedule": "0 * * * *"
  }]
}
```

**Beperking om te weten:** Airbnb en Booking pollen onze feed elke 1–4 uur, niet realtime. Voor 3 properties is dat prima. Wil Felister ooit realtime sync, dan upgrade naar Smoobu (€25/mnd) of Hostaway.

---

## 5. 🟡 Echte prijzen + property-data invullen

**Wat ik nu heb staan zijn schattingen:**

| Property | Prijs/nacht (KES) | Hoe vastgesteld |
|---|---|---|
| Villa by the Beach | 14.500 | Schatting (Booking laat alleen prijs zien met datums) |
| Sunny Sands Apt 3 | 4.500 | Schatting (Airbnb laat alleen prijs zien met datums) |
| Sunny Sands Apt 5 | 4.200 | Schatting (Skyscanner laat alleen prijs zien met datums) |

**Wat Felister moet doen:**
Ga naar `/admin/properties` op de site, klik per property "Edit" en vul in:
- Echte prijs per nacht (basis-tarief, hoog/laag-seizoen kunnen we later toevoegen)
- Echte schoonmaakkosten
- Eventuele extra voorzieningen die ik nog niet had (de 14 amenities die nu staan zijn de bevestigde minimum)

**Optioneel maar aanbevolen:** seizoens-tarieven (Kerstmis/Pasen hoger). Daar moet ik dan een extra prijs-laag inbouwen. Vraag het als ze dat wil.

---

## 6. 🟡 Foto's: opwaardering naar origineel

**Huidige status:**
| Property | Foto's | Bron | Kwaliteit |
|---|---|---|---|
| Villa by the Beach | 9 | Booking CDN, max1280×900 | Goed |
| Sunny Sands Apt 3 | 26 | Airbnb CDN, originele resolutie | Uitstekend |
| Sunny Sands Apt 5 | 5 | Skyscanner mirror | Beperkt aantal |

**Aanbevolen verbetering:**
Felister heeft de **originele foto's** waarschijnlijk op haar telefoon/laptop in hogere resolutie dan wat de OTA's tonen. Als ze die kan delen (Google Drive, WeTransfer, USB):
1. Hoge-res foto's vervangen voor villa (9 → mogelijk 25+)
2. Hoge-res voor Sunny Sands #5 (5 → mogelijk 15+)
3. Foto's krijgen meer detail, betere zoom-ervaring

**Verbeterpunt voor Apt 5:** waarschijnlijk zijn er nog interieur/keuken/badkamer-foto's die niet op Skyscanner stonden. Zeer aanbevolen om die toe te voegen.

**Hoe upload werkt:** voor nu plakt Felister URLs (bijv. via Imgur of Cloudinary). Als ze het zelf wil kunnen uploaden binnen de site, kan ik een drag-and-drop upload bouwen — schatting 2 uur werk.

---

## 7. 🟡 Reviews

**Huidige status:**
- Villa by the Beach: 3 placeholder reviews (rating klopt: 3.5/5 = 7.0/10 zoals op Booking)
- Apt 3: 3 placeholder reviews (rating klopt: 4.67/5 zoals op Airbnb)
- Apt 5: 0 reviews ("New listing" badge)

**Aanbeveling:** Felister kopieert haar **echte review-teksten** uit de host-dashboards (Airbnb host → Reviews; Booking Extranet → Guest Reviews) en plakt die in de DB. Ik kan een import-script maken zodra ze 5–10 echte reviews aanlevert (CSV of plain text).

Reviews kunnen ook automatisch synchroniseren — daar moet ik dan een review-import endpoint voor bouwen. Niet kritisch voor lancering.

---

## 8. 🟡 Test-boeking end-to-end

Voordat we live gaan, doe ik (of Felister) één complete test-flow:

1. Op de site een verblijf zoeken
2. Datums kiezen (bijv. 1 nacht over 2 weken)
3. Boeking-flow doorlopen
4. M-Pesa nummer invullen → STK push komt op telefoon
5. PIN invullen → betaling van bv. KES 1 (of het echte bedrag)
6. Bevestiging op site + email
7. Boeking verschijnt in `/admin/bookings` met status "paid"
8. Booking verschijnt in iCal feed
9. Airbnb / Booking ontvangt blokkering binnen 1–4 uur

**Test-aandachtspunten:**
- Telefoon ligt klaar
- M-Pesa heeft ten minste KES 1 saldo
- Sandbox of echte betaling? — sandbox eerst (kosteloos), daarna 1 echte test van KES 1

---

## 9. 🟢 Juridische pagina's (privacy + terms)

De links staan al in de footer maar de pagina's bestaan nog niet (`/privacy`, `/terms`). Niet kritisch voor lancering maar wettelijk wel verstandig:

- **Privacy policy** (GDPR-light, voor Europese gasten)
  - Wat we opslaan: naam, email, telefoon, IP
  - Hoe lang: tot 7 jaar na boeking (Keniaanse fiscale wet)
  - Data-deling: alleen Safaricom (Mpesa), Airbnb/Booking (sync)
- **Terms of service**
  - Annulerings-beleid (Felister bepaalt — 24u/72u/non-refundable?)
  - Aansprakelijkheid
  - Huisregels per property

Ik kan templates aanleveren op basis van wat Felister besluit. Ofwel hou je het simpel (eigen tekst, 1 pagina), ofwel via een tool als termly.io (€5/mnd voor automatisch bijgewerkt).

---

## 10. 🟢 Email-verzending bij boeking

Nu ontvangt de gast geen automatische bevestigingsmail. Toevoegen via:
- **Resend** (free tier 3000 emails/maand, mooie templates) — aanbevolen
- Of **Postmark**, of **SendGrid**

Email-flow die ik dan bouw:
1. Bevestigingsmail naar gast (NL/EN/SW op basis van site-taal)
2. Notificatie naar Felister bij elke boeking
3. Reminder 7 dagen voor check-in met praktische info (route, sleutelafhaalpunt)
4. Reminder voor review na check-out

Schatting: ½ dag werk.

---

## 11. 🟢 Marketing-koppelingen

Niet kritisch maar nuttig voor de lancering:
- Google Analytics 4 of Plausible (privacy-vriendelijker, €7/mnd)
- Meta Pixel als Felister Facebook/Instagram ads doet
- Een Google Business Profile voor de villa/appartementen
- Schema.org structured data is al ingebouwd via de meta-tags maar kan rijker (LocalBusiness, LodgingBusiness)

---

## 12. 🟢 Nice-to-haves

Dingen die de site nog beter maken maar niet noodzakelijk:

- **Seizoens-tarieven** (Kerstmis/Pasen hoger, low-season lager)
- **Minimum verblijfsduur** per property (bv. min 3 nachten in hoogseizoen)
- **Korting voor lange verblijven** (-10% bij 7+ nachten, -20% bij 30+)
- **Cadeaubonnen** (gift cards voor verblijven)
- **Foto upload in admin** (drag-and-drop in plaats van URL plakken)
- **Currency lock per markt** (Europese gasten zien €, Keniaanse zien KES, ipv toggle)
- **Reviews-import endpoint** (geautomatiseerd uit Airbnb/Booking)
- **Property comparison page** (zij-aan-zij vergelijking van de 3 stays)

---

## Samenvatting: wat heeft Felister concreet nodig?

**Voor zij iets kan doen:**
1. ⏳ Safaricom Daraja-aanvraag indienen (3-10 dagen wachten op approval) — **start dit eerst**
2. Domein kopen (felisterstays.com of variant) — €12 eenmalig
3. Vercel + Neon accounts aanmaken (gratis)
4. WhatsApp-nummer dat we publiek mogen tonen
5. Email-adres voor `bookings@`

**Tijdens het wachten op Safaricom:**
6. Echte prijzen per property bevestigen
7. Originele hoge-res foto's verzamelen (vooral Apt 5)
8. Echte review-teksten verzamelen uit Airbnb/Booking dashboards
9. Annulerings-beleid bepalen voor de Terms-pagina

**Zodra Safaricom approval er is:**
10. Keys in `.env` zetten
11. Test-boeking doen (kost KES 1)
12. Live gaan
13. iCal sync URLs uitwisselen tussen onze site en Airbnb/Booking (15 min werk)

**Realistische tijdlijn:** ~2 weken vanaf vandaag tot live, mits Safaricom snel approvet.

---

## Vragen waar ik antwoord op nodig heb

- **Annulerings-beleid**: 24u gratis annuleren? 72u? Non-refundable? Verschilt per property?
- **Schoonmaakkosten** echte tarieven per property?
- **Minimum nachten**: heeft Felister een minimum verblijfsduur in mind?
- **Korting voor lange verblijven**: wil ze dit aanbieden? Vanaf hoeveel nachten en hoeveel %?
- **Wisselkoersen**: nu hardcoded (1 USD = 129 KES, 1 EUR = 140 KES). Live-koersen via een API of jaarlijks bijwerken?
- **Reviews verzamelen**: wil Felister dat we periodiek automatisch reviews uit Airbnb/Booking halen?
