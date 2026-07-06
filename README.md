# Sportsx Table Tennis Hub

A premium, dark-themed, 3D table tennis club platform — Next.js 14 + React + Tailwind + Three.js + Framer Motion.

Built from the Stitch spec for project **Sportsx Table Tennis Hub** (`18287587193004609236`).

## Stack

| Layer       | Tech                                                |
|-------------|-----------------------------------------------------|
| Frontend    | Next.js 14 (App Router), React 18, TypeScript       |
| Styling     | Tailwind CSS, glassmorphism utilities, dark theme   |
| 3D          | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Motion      | Framer Motion (animations)                          |
| Icons       | `lucide-react`                                      |
| PWA         | `public/manifest.webmanifest`                       |

## Pages

| Route             | What's there                                                                 |
|-------------------|------------------------------------------------------------------------------|
| `/`               | 3D hero, stats, leaderboard preview, social nights preview, AI teaser        |
| `/login`          | Email/password, remember me, forgot password, social SSO buttons             |
| `/signup`         | Full name, username, email, phone, DOB, photo upload, password               |
| `/dashboard`      | Member profile, holographic player card, stats, match history, locked matches |
| `/leaderboard`    | Podium + table, daily/weekly/monthly/all-time filter, search                 |
| `/social-nights`  | Tue–Fri 7–9 PM schedule, RSVP, live tonight, AI suggestions, June calendar   |
| `/matchmaking`    | Level filter, lock-match flow, AI suggestions                                |
| `/messages`       | One-to-one chat, online status, typing indicator, match invite button        |
| `/shop`           | Category filter, search, product grid, cart drawer (Card, PayPal, Apple Pay) |
| `/cafe`           | Categorised menu, order panel, pay & collect                                 |
| `/about`          | Story, achievements, vision, timeline                                        |
| `/contact`        | Form, hours, phone, map placeholder                                          |
| `/admin`          | **Control panel** — password-gated. Edit site/branding, members, products, cafe, events |

## Control panel (admin)

Go to **`/admin`** and log in. Default password: **`sportsx2026`**
(change it by creating `tt/.env.local` with `ADMIN_PASSWORD=yourpassword`).

What you can control — changes are saved to `data/store.json` and show on the live site after refresh:

| Tab          | Controls                                                                    |
|--------------|------------------------------------------------------------------------------|
| **Site**     | Club name (navbar/footer), hero headline + subtitle, member/match stats, contact phone/email/address |
| **Members**  | Add / edit / delete players → updates Leaderboard + Social Nights            |
| **Products** | Add / edit / delete gear → updates Shop                                       |
| **Cafe**     | Add / edit / delete menu items → updates Cafe                                 |
| **Events**   | Add / edit / delete social nights → updates Social Nights + Home             |

**How it works:** a file-based JSON store (`lib/store.ts` → `data/store.json`, seeded
from `lib/data.ts`) exposed through REST routes under `app/api/*`. Write routes
(`POST`/`PUT`/`DELETE`) require the `x-admin-token` header; `GET` is public. Public
pages read live data via `lib/useData.ts` (client) or `readStore()` (server). To move
to a real database later, swap the body of `readStore`/`writeStore` for Prisma — the
API and UI stay the same.

## Cross-page

- **Navbar** — fixed glass nav with scroll-aware compaction.
- **Footer** — contact info, social links.
- **AI Assistant** — floating cyan button on every page. Three-step logic:
  1. FAQ table lookup.
  2. Knowledge base (products / cafe items / events / ranking rules).
  3. Placeholder fallback for the external AI API — drop your key into `OPENAI_API_KEY` and wire a route at `app/api/ai/route.ts` to enable.

## Match point system

- Win = +5 points, loss = 0.
- Points never expire.
- A match is only official once both players confirm — mocked in the dashboard table with `Confirmed` / `Pending` status.

## Run it

```bash
cd "%USERPROFILE%\OneDrive\Desktop\tt"
npm install
npm run dev
```

Open <http://localhost:3000>.

## What's mocked vs real

This repo ships the full, premium, animated frontend. To make it production:

| Feature              | Status         | To productionise                                           |
|----------------------|----------------|------------------------------------------------------------|
| Auth UI              | Frontend only  | Wire to NextAuth / JWT API                                 |
| Real-time chat       | Mocked replies | Add Socket.io server, replace `setTimeout` echo            |
| Shop checkout        | Cart UI only   | Add Stripe Payment Intents + `app/api/checkout/route.ts`   |
| Cafe orders          | Order UI only  | Same Stripe flow + admin notification                      |
| AI assistant         | FAQ + KB done  | Wire `OPENAI_API_KEY` and `app/api/ai/route.ts` fallback   |
| Database             | In-memory      | Add Postgres + Prisma; data shapes are in `lib/data.ts`    |
| Admin auth gate      | Not enforced   | Add role check in `app/admin/layout.tsx`                   |

## Database shapes

All the table schemas the spec asks for live as TypeScript types in `lib/data.ts`:
`Player`, `Product`, `CafeItem`, `Event`, `MatchHistory`, `FAQ`. Wire them to Prisma 1:1.

---

Built by Sportsx.
