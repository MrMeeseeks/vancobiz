# VancoBiz website

Next.js 16 (App Router) + TypeScript + Tailwind 4, with React Three Fiber for the 3D pieces.
Built as a static export and published to GitHub Pages.

- Live: https://mrmeeseeks.github.io/vancobiz/
- Logo Option B: https://mrmeeseeks.github.io/vancobiz/option-b/
- Club members page (separate repo): https://github.com/MrMeeseeks/vancobiz-club

## Run locally

```bash
npm install
npm run dev
```

## Pages

| Route | What it is |
|---|---|
| `/` | Main site, **logo Option A** (the script "VB" mark traced from vancobiz.com, in 3D liquid chrome) |
| `/option-b/` | **Logo Option B**: the Tile Grid logo as an interactive 2×2 puzzle cube, plus flat lockups |

A floating **Logo A | B** switch (`components/LogoOptionSwitch.tsx`) sits at the bottom of both
pages. It is visible to every visitor; remove it from `app/page.tsx` and
`components/option-b/OptionBPage.tsx` once a logo is chosen.

## Edit content

All copy lives in `lib/content.ts`, taken from vancobiz.com on Nov 16, 2026:
stats, services, work items, Club perks, team, packages, contact details and the Club link.

Still to confirm (marked `TODO(confirm)` in the file):

- Roles for **Arshia** and **Dorsa** (shown as "Creative Team"; vancobiz.com lists none).
- Whether package prices (Soldier / King / Queen) are monthly or one-time, and the currency.

Team photos are in `public/team/`. To change a portrait, replace the PNG with the same name.

## Where things are

| Section | File |
|---|---|
| 3D hero: chrome VB logo, lights, particles | `components/three/HeroScene.tsx` |
| Purple "Venom" blob behind the logo | `components/three/VenomBlob.tsx` |
| Traced VB logo shapes (nav SVG + 3D) | `lib/logoPaths.ts`, `components/Logo.tsx` |
| Service cards and their 3D icons | `components/SpatialServices.tsx`, `components/three/ServiceBadge.tsx` |
| Work carousel and Club section | `components/ShowcaseCarousel.tsx` |
| Gold Club pass with the engraved crown | `components/GoldPass.tsx` |
| Team, pricing, booking form | `components/TeamSection.tsx`, `components/Pricing.tsx`, `components/BookingSection.tsx` |
| Option B cube and lockups | `components/option-b/` |
| Colours (palette tokens) | `app/globals.css`, `lib/design.tsx` |

## Design review options

Add `?review` to the main site's URL to show a panel for comparing 3D logo styles and palettes
(brand purple + orange is the default). Choices are kept in the URL, e.g.
`/?logo=medallion&palette=electric`. Without `?review` visitors never see the panel.

## Booking form

With no backend, the form opens the visitor's email app with their answers pre-filled.
To receive submissions directly, set a repository variable `NEXT_PUBLIC_FORM_ENDPOINT`
(Settings → Secrets and variables → Actions → Variables), e.g. a Formspree URL, and re-run the deploy.

## Deploy

Every push to `main` builds a static export and publishes it to GitHub Pages
via `.github/workflows/deploy.yml`. The workflow sets `PAGES_BASE_PATH` to `/vancobiz`;
local dev runs at the root.
