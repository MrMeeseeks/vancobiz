# VancoBiz website

Next.js (App Router) + TypeScript + Tailwind, with React Three Fiber for the 3D hero and service badges.

## Run locally

```bash
npm install
npm run dev
```

## Edit content

All copy, stats, case studies, Club perks and contact details live in `lib/content.ts`.
Before launch, confirm:

- The four stats are real and current.
- The case studies marked `illustrative: true` (shown with a "Sample" tag) are replaced with real results or removed.
- The contact email is the real business inbox.

## Booking form

With no backend, the form opens the visitor's email app with their answers pre-filled.
To receive posts instead, set a repository variable `NEXT_PUBLIC_FORM_ENDPOINT`
(Settings → Secrets and variables → Actions → Variables), e.g. a Formspree URL, and re-run the deploy.

## Deploy

Every push to `main` builds a static export and publishes it to GitHub Pages
via `.github/workflows/deploy.yml`.
