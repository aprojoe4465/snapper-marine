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
| `/contact` | Phone, email, book CTA |
| `/privacy` | Privacy policy |
| `/book` | Service request form |
| `/book/success` | Confirmation after submit |

Phone CTA: **(772) 626-8149** (`+17726268149`).

## How booking works (MVP)

1. User submits `/book` (name, phone, email, service type, boat/trailer type/make, location type + details, preferred date/time, problem description, and optional photos).
2. `POST /api/book` validates and **appends** the request to `data/bookings.json`.
3. User is redirected to `/book/success?id=…`.

**Photo upload:** the form accepts up to 5 JPG, PNG, or WEBP images, resizes them in the browser, and caps the photo payload at 3 MB total (700 KB each) to stay below Vercel Hobby's request limit. Local development embeds image data as data URLs in `data/bookings.json`; on Vercel the file write is skipped and Resend email is the primary record.

### Important for Vercel

Vercel’s serverless filesystem is **ephemeral and read-only** — local development writes to `data/bookings.json`, while deployed Vercel requests skip that file and use the Resend notification as the primary booking record. For durable structured storage later, add a database such as Supabase or Upstash Redis.

### Booking email (Resend)

Booking submissions are emailed to `mbarnes@snappermarine.com` when `RESEND_API_KEY` is set. Add these variables in Vercel **Production**:

```env
RESEND_API_KEY=re_xxx
RESEND_FROM=Snapper Marine <onboarding@resend.dev>
```

`RESEND_FROM` is optional and defaults to the Resend onboarding sender for testing. After verifying `snappermarine.com` in Resend, set it to a sender on that domain, such as `Snapper Marine <bookings@snappermarine.com>`. If the API key is missing or Resend has an error, the customer still receives a success response; local file storage is best-effort, Vercel skips the file write, and the server logs the skipped or failed notification.

Common Resend failure: a `bookings@...` sender will be rejected until its domain is verified in Resend. Use `Snapper Marine <onboarding@resend.dev>` for testing, or verify `snappermarine.com` and then set `RESEND_FROM` to a sender on that verified domain.

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
