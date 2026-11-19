# CosmoSurge Clinics

Arabic-first marketing and appointment website for **CosmoSurge Clinics**, a multispecialty medical center in Zahraa El Maadi, Cairo. The site lets visitors browse specialists and their weekly clinic schedules, read specialist-authored health articles, and book an appointment online with an instant SMS confirmation.

Built with the Next.js App Router. Articles are read from PocketBase at build time and rendered as static HTML (with curated local data as a fallback), bookings are written to PocketBase, and the specialist directory is bundled locally.

## Features

- **Bilingual UI** — Arabic (default, RTL) and English (LTR), with a persisted language toggle. Content types carry parallel `_a` Arabic fields.
- **Light / dark theme** — persisted in `localStorage` / `sessionStorage` with safe fallbacks for restricted browser contexts.
- **Doctor directory** — 10 specialties with filters, profiles, qualifications, clinic hours, reviews, and related articles.
- **Booking flow** — embedded widget + global dialog; doctors, upcoming dates derived from each doctor's schedule, procedure, patient details, client- and server-side validation, and a confirmation screen with a `CS-######` reference.
- **Persistence & notifications** — bookings are saved to a PocketBase `bookings` collection and dispatched to an SMS webhook in parallel; failures are reported in the API response without blocking the confirmation.
- **Health journal** — statically generated article index and detail pages with sections, FAQs, author info, reading time, and related posts.
- **SEO** — Arabic-first article metadata with English alternates, absolute Open Graph images with alt text, `MedicalClinic` / `Physician` / `MedicalWebPage` JSON-LD, canonical URLs, generated `sitemap.xml` and `robots.ts`.
- **Static article delivery** — PocketBase is queried once during `next build` with `cache: "force-cache"`; blog pages export `dynamic = "force-static"` and are served as pre-rendered HTML without a runtime backend request. A 5 s build-time timeout and bundled fallback keep builds resilient.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, static generation) |
| UI | React 19, TypeScript, Tailwind CSS v4, Radix UI (Dialog/Select/Tabs), lucide-react, Motion |
| Fonts | Plus Jakarta Sans, DM Sans, Cairo (Arabic), JetBrains Mono via `next/font/google` |
| Backend | PocketBase (`pocketbase` SDK for writes, REST for reads) |
| SMS | Configurable HTTP webhook (built-in support for `notifier.drkaz.dev` convention) |
| Tooling | npm or Bun, `tsx`/`esbuild` packages, `tsc --noEmit` for linting |

> Note: `GEMINI_API_KEY` and `@google/genai` are leftover AI Studio boilerplate; no source file currently calls the Gemini API.

## Getting started

### Prerequisites

- Node.js 20.9+ (Node 22 recommended) and npm; alternatively Bun (`bun.lock` is committed).
- Access to a PocketBase instance and an SMS webhook to exercise the write paths. Read-only pages work without them thanks to local fallback data.

### Install and run

```bash
npm install                 # or: bun install
cp .env.example .env.local  # then edit the values you need
npm run dev                 # http://localhost:3000
```

The `dev` script uses `scripts/run-next.mjs`, which binds `0.0.0.0` and honours `PORT`, `--port=<n>`, and `--host=<name>` (useful in containers and cloud sandboxes). Static output is served with the Cloudflare Pages tooling instead.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server (UI only; no Pages Function) |
| `npm run build` | Export the static site to `out/` |
| `npm run start` | Preview `out/` locally with `wrangler pages dev`, including `/api/bookings` |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `.next`, `out`, `dist`, and `server.js` |

## Configuration

Copy `.env.example` to `.env.local`. All variables are optional for local UI development; the defaults below are what the app uses when a value is missing.

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_URL` | `https://cs-clinics.pages.dev` | Canonical base URL for metadata, sitemap, and robots |
| `POCKETBASE_URL` | `https://cosmo-pb.prkln.app` | Deployment PocketBase instance used for reads and writes |
| `NEXT_PUBLIC_POCKETBASE_URL` | same as above | Public fallback for the PocketBase URL |
| `POCKETBASE_BOOKINGS_COLLECTION` | `bookings` | Collection for created bookings |
| `POCKETBASE_ARTICLES_COLLECTION` | `articles` | Collection for articles |
| `POCKETBASE_ADMIN_EMAIL` / `POCKETBASE_ADMIN_PASSWORD` | empty | Optional superuser login for restricted collections |
| `BASE_URL` | empty | Third-party SMS API base URL |
| `USERNAME` / `PASSWORD` | empty | SMS API credentials (sent as query parameters) |
| `SENDERNAME` | empty | SMS sender ID |
| `SMS_BASE_URL`, `SMS_USERNAME`, `SMS_PASSWORD`, `SMS_SENDERNAME` | empty | Optional prefixed aliases for the four variables above |
| `GEMINI_API_KEY` | — | Unused by current source (AI Studio legacy) |

There is no doctors collection: the directory is maintained in `src/data/doctors.ts`. `.env.local` (git-ignored) carries the deployment URLs and credentials; mirror these variables in your hosting provider's environment settings.

SMS delivery uses a single `GET` request to `<BASE_URL>?username=<USERNAME>&password=<PASSWORD>&sendername=<SENDERNAME>&mobiles=<phone>&message=<text>` with `Content-Type: application/json`, `Accept: application/json`, and `Accept-Language: en-US` headers. All values are URL-encoded. Three messages are dispatched per booking: the confirmation to the patient, a booking alert to the doctor's personal phone, and the same alert plus the doctor's name to the assistant's phone. Provider credentials are never echoed in API responses.

### PocketBase collections

Only two application collections are needed on the deployment instance (`https://cosmo-pb.prkln.app`):

| Collection | Access rules | Fields |
| --- | --- | --- |
| `articles` | list/view public; create/update/delete admin-only | `slug` (unique), `title`, `title_a`, `excerpt`, `excerpt_a`, `category`, `category_a`, `publishedAt` (date), `updatedAt` (date), `readTimeMinutes`, `image` (file, single image ≤ 5 MB), `coverImage` (legacy text path), `coverAlt`, `authorId`, `authorName`, `authorName_a`, `authorTitle`, `authorTitle_a`, `keywords` (JSON), `sections` (JSON), `faqs` (JSON), `published` (bool) |
| `bookings` | create public; list/view/update/delete admin-only | `booking_ref` (unique), `docid`, `docname`, `docname_a`, `clinic`, `clinic_a`, `procedure`, `schedule_day`, `schedule_start`, `schedule_end`, `date`, `name`, `phone`, `dob`, `notes`, `locale`, `status` |

`articles` is sorted by `-publishedAt` and filtered to `published = true`; remote records override bundled articles with matching slugs. The instance is seeded with the six bundled articles, so the static build is sourced from PocketBase.

Upload a cover image to an article's `image` file field in PocketBase (JPEG, PNG, WebP, GIF or AVIF, up to 5 MB) — the app turns it into a public PocketBase file URL for the article page, the journal index, and the social/SEO tags, so no image needs to be added to this project. `coverImage` is kept only as a fallback for legacy text paths, and `coverAlt` supplies the image alt text.

`bookings` is write-only from the site — patient records are not exposed publicly.

## Routes and API

### Pages

| Route | Description |
| --- | --- |
| `/` | Home: hero, specialty strip, doctor directory, pillars, articles, contact/location |
| `/doctors` | Filterable specialist directory |
| `/doctors/[id]` | Doctor profile, weekly schedule, reviews, related articles |
| `/blog` | Article index |
| `/blog/[slug]` | Article detail with sections, FAQs, and structured data |
| `/contact` | Address, map embed, phone/WhatsApp/email links, opening hours |
| `/sitemap.xml`, `/robots.txt` | Generated SEO endpoints |

### API endpoint

- `POST /api/bookings` — a Cloudflare Pages Function (`functions/api/bookings.ts`), not part of the static export. Validates name, Egyptian/international phone, doctor, date, and time window; persists to PocketBase and dispatches the three SMS messages concurrently. Returns `201` with a booking reference plus `pocketbase`, `sms`, and `notifications` status objects, or `400`/`500` with an error message.

Types for all payloads and responses live in `src/types/clinic.ts`.

## Project structure

```text
src/
  app/                   Static routes, layout, globals.css, sitemap, robots
  components/
    blog/                Article index and article view
    booking/             Booking widget and global booking dialog
    doctors/             Directory, cards, filters, profile view, avatar
    home/                Home page sections
    layout/              Header, footer, mobile bottom navigation
    providers/           Theme / locale / booking context
    ui/                  Button, input, dialog, image helpers
  data/                  Curated doctors (10), articles (6), clinic info
  lib/                   PocketBase client/cache, booking service, site URL helper, SMS dispatch, cn() helper
  types/                 Shared TypeScript interfaces
functions/
  api/bookings.ts        Cloudflare Pages Function for booking writes and SMS
public/
  images/                Clinic and article photography
  doc_images/            Doctor portrait placeholders keyed by ID
scripts/run-next.mjs     Next.js wrapper handling PORT/host forwarding
out/                     Generated static site (build output, git-ignored)
```

## Deployment notes (Cloudflare Pages, static)

`next.config.ts` sets `output: "export"` and `trailingSlash: true`, so `npm run build` writes a fully static site to **`out/`**.

| Cloudflare Pages setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | repository root |

`functions/api/bookings.ts` is picked up automatically by Pages as a function at `/api/bookings`; everything else is pre-rendered HTML, CSS and JS. For local testing of the function, use `npx wrangler pages dev out`, or deploy directly with `npx wrangler pages deploy out`.

- **SMS variables must exist in the Pages project's runtime environment** — `.env.local` is only read by Next.js at build time and is NOT visible to Pages Functions at request time. In the Cloudflare dashboard go to **Pages → your project → Settings → Environment variables** and add `BASE_URL`, `USERNAME`, `PASSWORD`, `SENDERNAME` for both Production and Preview (as Secrets if you prefer). The function reads them from its `env` bindings and passes them directly into the SMS dispatcher; it no longer relies on a Worker `process.env` polyfill.
- Set `APP_URL` to the real public origin so canonical links, absolute Open Graph images, sitemap, and robots are correct. Set `POCKETBASE_URL` and the collection names in the same Pages environment settings.
- For local function testing, copy `.dev.vars.example` to `.dev.vars` (used by `wrangler pages dev out`) — `.env.local` alone will not configure the function locally either.
- The function logs the names of the variables it received and each SMS attempt (`[bookings]`, `[SMS]`) to the Pages Functions logs. No credentials or full provider URLs are logged. If a variable is missing, the booking response includes an `sms.note` explaining exactly what is missing.
- Blog routes are fully static: the `articles` collection is read during the build, `generateStaticParams()` creates a page for every published slug, and no PocketBase request occurs at request time. Rebuild to publish article changes or image uploads.
- If PocketBase is unreachable at build time, bundled articles are used; creating bookings still requires a reachable `bookings` collection with the fields listed in `src/lib/pocketbase.ts` (`booking_ref`, `docid`, `date`, `name`, `phone`, `status`, etc.).
- The booking endpoint has no authentication or slot-locking: it validates input format but does not prevent double bookings. Add rate limiting and availability checks before exposing it at scale.
- `npm run dev` serves the Next.js app without the Pages Function, so `/api/bookings` is unavailable in that mode; use `wrangler pages dev out` to exercise bookings locally.
- Next.js images are unoptimized (`next.config.ts`) so no image optimizer service is required.
