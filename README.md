# CosmoSurge Clinics

Arabic-first marketing and appointment website for **CosmoSurge Clinics**, a multispecialty medical center in Zahraa El Maadi, Cairo. The site lets visitors browse specialists and their weekly clinic schedules, read specialist-authored health articles, and book an appointment online with an instant SMS confirmation.

Built with the Next.js App Router. Content comes from a PocketBase backend with curated local data as a fallback, so the site still renders if the backend is unavailable.

## Features

- **Bilingual UI** — Arabic (default, RTL) and English (LTR), with a persisted language toggle. Content types carry parallel `_a` Arabic fields.
- **Light / dark theme** — persisted in `localStorage` / `sessionStorage` with safe fallbacks for restricted browser contexts.
- **Doctor directory** — 10 specialties with filters, profiles, qualifications, clinic hours, reviews, and related articles.
- **Booking flow** — embedded widget + global dialog; doctors, upcoming dates derived from each doctor's schedule, procedure, patient details, client- and server-side validation, and a confirmation screen with a `CS-######` reference.
- **Persistence & notifications** — bookings are saved to a PocketBase `appointments` collection and dispatched to an SMS webhook in parallel; failures are reported in the API response without blocking the confirmation.
- **Health journal** — article index and detail pages with sections, FAQs, author info, reading time, and related posts.
- **SEO** — Arabic/English metadata, Open Graph and Twitter cards, `MedicalClinic` / `Physician` / `MedicalWebPage` JSON-LD, canonical URLs, generated `sitemap.xml` and `robots.ts`.
- **Resilient data layer** — 5-minute in-memory cache, `next: { revalidate: 300 }` fetches, a 750 ms backend timeout, and graceful fallback to bundled data.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, ISR) |
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

The `dev` and `start` scripts use `scripts/run-next.mjs`, which binds `0.0.0.0` and honours `PORT`, `--port=<n>`, and `--host=<name>` (useful in containers and cloud sandboxes).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `.next`, `dist`, and `server.js` |

## Configuration

Copy `.env.example` to `.env.local`. All variables are optional for local UI development; the defaults below are what the app uses when a value is missing.

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_URL` | `https://cs-clinics.pages.dev` | Canonical base URL for metadata, sitemap, and robots |
| `POCKETBASE_URL` | `https://server.drkaz.dev` | Server-side PocketBase endpoint |
| `NEXT_PUBLIC_POCKETBASE_URL` | same as above | Public fallback for the PocketBase URL |
| `POCKETBASE_BOOKINGS_COLLECTION` | `appointments` | Collection for created bookings |
| `POCKETBASE_ARTICLES_COLLECTION` | `articles` | Collection for articles |
| `POCKETBASE_DOCTORS_COLLECTION` | `doctors` | Collection for doctors |
| `POCKETBASE_ADMIN_EMAIL` / `POCKETBASE_ADMIN_PASSWORD` | empty | Optional superuser login for restricted collections |
| `SMS_PROVIDER_URL` | `https://notifier.drkaz.dev` | SMS webhook endpoint |
| `SMS_PROVIDER_API_KEY` | empty | Sent via `SMS_PROVIDER_AUTH_HEADER` |
| `SMS_PROVIDER_AUTH_HEADER` | `Authorization` | Header name for the API key |
| `SMS_CLINIC_TOPIC` | `01091966224` | Default notifier topic when a doctor has no personal phone |
| `SMS_SENDER_ID` | `CosmoSurge` | Sender ID in the SMS payload |
| `GEMINI_API_KEY` | — | Unused by current source (AI Studio legacy) |

If `notifier.drkaz.dev` is used, the app appends `&topic=<doctor phone or clinic topic>` to the URL, so the configured URL should already contain a `?` query string. Generic REST providers receive a JSON POST containing `to`, `sender`, `message`, `bookingReference`, plus booking/doctor fields.

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

### API endpoints

- `GET /api/doctors` — published doctors from PocketBase or fallback data: `{ "doctors": [...] }`.
- `GET /api/articles` — published articles: `{ "articles": [...] }`.
- `POST /api/bookings` — validates name, Egyptian/international phone, doctor, date, and time window; persists to PocketBase and dispatches SMS concurrently. Returns `201` with a booking reference plus `pocketbase` and `sms` status objects, or `400`/`500` with an error message.

Types for all payloads and responses live in `src/types/clinic.ts`.

## Project structure

```text
src/
  app/                   Routes, API handlers, layout, globals.css, sitemap, robots
  components/
    blog/                Article index and article view
    booking/             Booking widget and global booking dialog
    doctors/             Directory, cards, filters, profile view, avatar
    home/                Home page sections
    layout/              Header, footer, mobile bottom navigation
    providers/           Theme / locale / booking context
    ui/                  Button, input, dialog, image helpers
  data/                  Curated doctors (10), articles (6), clinic info
  lib/                   PocketBase client/cache, SMS dispatch, cn() helper
  types/                 Shared TypeScript interfaces
public/
  images/                Clinic and article photography
  doc_images/            Doctor portrait placeholders keyed by ID
scripts/run-next.mjs     Next.js wrapper handling PORT/host forwarding
```

## Deployment notes

- Run `npm run build` then `npm run start`; set `APP_URL` to the real public origin so canonical links, Open Graph images, sitemap, and robots are correct.
- Pages use ISR (`revalidate = 300`), so content updates appear within about five minutes.
- Read-only features degrade to bundled data when PocketBase is slow or unreachable; creating bookings requires a reachable PocketBase collection with the fields listed in `src/lib/pocketbase.ts` (`booking_ref`, `docid`, `date`, `name`, `phone`, `status`, etc.).
- The booking endpoint has no authentication or slot-locking: it validates input format but does not prevent double bookings. Add rate limiting and availability checks before exposing it at scale.
- Next.js images are unoptimized (`next.config.ts`) so no image optimizer service is required.
