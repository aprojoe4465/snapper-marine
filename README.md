# Snapper Marine, LLC — Marketing & Booking Site

Professional marketing site with **service booking requests** for Snapper Marine, LLC (**mobile marine and boat trailer service** — on-site at dock, marina, or home).

- **Stack:** Next.js 14 (App Router) + TypeScript  
- **Domain (planned):** [snappermarine.com](https://snappermarine.com) (IONOS)  
- **Deploy target:** Vercel (free hobby tier — same pattern as Snapitag)

## Local development

```bash
cd /workspace/snapper-marine
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, logo, Book / Call CTAs |
| `/services` | On-site mobile marine services |
| `/mobile-marine` | On-site / dock / marina / home service |
| `/service-area` | Broward, Palm Beach, Martin, and St. Lucie counties (Florida) |
| `/about` | Company overview |
| `/contact` | Phone, email placeholder, book CTA |
| `/book` | Service request form |
| `/book/success` | Confirmation after submit |

Phone CTA: **(954) 934-4474** (`+19549344474`). Update in `lib/site.ts` if the business number differs.

## How booking works (MVP)

1. User submits `/book` (name, phone, email, service type, boat/trailer type/make, location type + details, preferred date/time, problem description).
2. `POST /api/book` validates and **appends** the request to `data/bookings.json`.
3. User is redirected to `/book/success?id=…`.

**Photo upload:** stubbed for later (hint on the form).

### Important for Vercel

Vercel’s serverless filesystem is **ephemeral** — JSON writes to `data/` work in local `next dev` / `next start`, but **will not persist** on Vercel production. For go-live, wire email (below) or a free store (e.g. Supabase table / Upstash Redis).

### Wire email (Resend — recommended free tier)

1. Create a [Resend](https://resend.com) account and API key.
2. Verify a sending domain (or use Resend’s onboarding address for tests).
3. Add env vars on Vercel:

```env
RESEND_API_KEY=re_xxx
BOOKING_NOTIFY_TO=you@yourinbox.com
BOOKING_FROM=bookings@snappermarine.com
```

4. In `app/api/book/route.ts`, after `appendBooking`, send mail (install `resend` and uncomment/adapt):

```ts
// npm i resend
import { Resend } from "resend";

if (process.env.RESEND_API_KEY) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.BOOKING_FROM!,
    to: process.env.BOOKING_NOTIFY_TO!,
    subject: `Service request — ${entry.name}`,
    text: JSON.stringify(entry, null, 2),
  });
}
```

### Alternative: Formspree

Point the form at a Formspree endpoint, or `fetch` Formspree from the API route with your form ID. No server file writes required.

### Alternative: Supabase (free)

Create a `bookings` table and insert from `/api/book` with the Supabase JS client + service role key (server-only env).

## Deploy to Vercel (free)

1. Push this repo to GitHub (create a private or public repo).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
3. Framework preset: **Next.js**. Root directory: repo root.
4. Deploy. You’ll get a `*.vercel.app` URL.
5. After email/store is wired, add the env vars under **Project → Settings → Environment Variables**, then redeploy.

CLI option:

```bash
npx vercel
npx vercel --prod
```

## Point snappermarine.com (IONOS) at Vercel

1. In Vercel: **Project → Settings → Domains** → add `snappermarine.com` and `www.snappermarine.com`.
2. Follow Vercel’s DNS instructions. Typical setup:
   - **Apex (`snappermarine.com`):** A record → `76.76.21.21` (confirm current IP in Vercel UI), **or** use IONOS/Vercel nameserver options if offered.
   - **www:** CNAME → `cname.vercel-dns.com` (exact target shown in Vercel).
3. In **IONOS DNS** for `snappermarine.com`:
   - Remove conflicting A/CNAME records for `@` and `www` that point elsewhere.
   - Add the records Vercel shows.
4. Wait for DNS propagation (often minutes; up to 48h). Vercel will issue HTTPS automatically.

Do **not** point the domain at IONOS web hosting if you want Vercel to serve the site — DNS only needs to resolve to Vercel.

## Project layout

```
app/                 # App Router pages + api/book
components/          # Header, Footer, BookingForm
lib/site.ts          # Brand, phone, areas
lib/bookings.ts      # JSON persistence helpers
data/bookings.json   # Local MVP store (starts as [])
public/logo.png      # Brand logo
```

## Brand notes

- Background: near-black  
- Accents: chrome/silver + electric blue (`#0070ff`) matching the logo  
- Logo: `public/logo.png`

## License / ownership

Private business site for Snapper Marine, LLC.
