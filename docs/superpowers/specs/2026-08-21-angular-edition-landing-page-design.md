# LoanLens: Angular Edition + Case-Study Landing Page

Date: 2026-08-21
Status: Approved

## Overview

LoanLens is an existing React + Vite + Tailwind + Zustand loan/mortgage affordability
calculator (`loan_lens/`, this repo). This project adds two new, independent sibling
projects:

1. **`loan-lens-angular/`** — a full Angular port of LoanLens with feature parity to
   the React app, but a newly designed interface (not a Tailwind reskin of the React
   UI).
2. **`loan-lens-landing/`** — a small static case-study/explainer page describing what
   LoanLens is, why it was built twice (once in React, once in Angular), and how each
   version was built. Links out to both live apps.

The existing React app (`loan_lens/`) is **not modified** except for being deployed to
Vercel so the landing page has a real URL to link to.

## Goals

- Full behavioral parity between the React and Angular versions: same loan products,
  same PITI/amortization math, same salary-affordability math, same city/weather/job/
  realtor features, same persisted user inputs.
- A genuinely distinct visual design for the Angular app, built via the
  `frontend-design` skill — same information architecture (product selector → search
  form → results → city/jobs/listings), different look.
- A landing page that works for two audiences in distinct sections: a plain-language
  "what is this" for general visitors, and a technical "how it was built" for
  developers, with both versions live-linked.
- All three apps deployed to Vercel.

## Non-goals

- No changes to the existing React app's code.
- No shared backend/API — both apps call the public Open-Meteo API directly from the
  client, same as today.
- No test-suite build-out beyond what's needed to trust the ported calculation logic
  (see Testing below) — this is a personal/portfolio project, not a team codebase.
- No design system shared between the React and Angular apps — they're intentionally
  allowed to look different.

## Repo layout

```
~/coding_stuff/personal_projects/
  loan_lens/            existing repo, untouched, deployed as-is
  loan-lens-angular/    new git repo, Angular CLI project
  loan-lens-landing/    new git repo, static HTML/CSS
```

## Angular app (`loan-lens-angular`)

### Stack

- Angular 19, standalone components (no NgModules)
- TypeScript strict mode
- Tailwind v4 for utility styling
- Signals for state (replacing Zustand) — no NgRx; the state shape is small and a
  single signal-backed service is a direct analog to the current `useStore`
- `HttpClient` for the Open-Meteo weather call (replacing the `fetch` in
  `useCityData`)

### Source mapping

Pure logic ports mechanically to typed TS — lowest-risk part of this project:

| React (current)              | Angular (new)                          |
|-------------------------------|------------------------------------------|
| `store/useStore.js`          | `core/services/loan-state.service.ts` (signals, localStorage sync) |
| `hooks/useCityData.js`       | `core/services/city-data.service.ts` (HttpClient, signals) |
| `data/cities.js`             | `core/data/cities.ts` |
| `data/jobs.js`                | `core/data/jobs.ts` |
| `data/loanProducts.js`       | `core/data/loan-products.ts` |
| `utils/amortization.js`      | `core/utils/amortization.ts` |
| `utils/affordability.js`     | `core/utils/affordability.ts` |
| `utils/formatters.js`        | `core/utils/formatters.ts` |
| `utils/realtorUrl.js`        | `core/utils/realtor-url.ts` |

Components, one per current React component, same responsibilities, new markup/styling:
`navbar`, `loan-product-selector`, `search-mode-toggle`, `property-search-form`,
`salary-search-form`, `amortization-results`, `payment-breakdown-chart` (plain inline
SVG donut, ported directly — no charting library, matching the current approach),
`amortization-schedule`, `salary-requirement`, `affordability-result`,
`city-info-panel`, `job-listings`, `realtor-listings`, `dynamic-background`, `footer`.
`app.component.ts` is the root and mirrors the orchestration currently in `App.jsx`
(computing PITI/schedule/required-salary/max-affordable via `computed()` signals
instead of `useMemo`).

### State & data flow

- `LoanStateService` holds `loanProductId`, `searchMode`, `selectedCityId`,
  `propertyPrice`, `downPaymentPercent`, `interestRate`, `loanTerm`, `annualSalary`,
  `dtiRatio` as signals, with setters, and persists to `localStorage` under a single
  key (mirrors Zustand's `persist` middleware behavior) — read on service
  construction, written on every change via an `effect()`.
- `CityDataService` exposes signals for the selected city's static data plus live
  weather; on city change it re-fetches from Open-Meteo and fails gracefully back to
  static data only, exactly like today (try/catch, no user-facing error state).
- Derived values (PITI, schedule, required salary, max affordable price) are
  `computed()` signals in `app.component.ts`, replacing the `useMemo` chain.

### Design

The Angular app gets its own interface via the `frontend-design` skill during
implementation — new color system, typography, and layout treatment. It keeps the
same per-loan-product theming concept (the current app tints the whole UI by loan
type: home/auto/personal/student) but the execution is new, not copied from the
React app's blue/red/green/purple gradient backgrounds.

## Landing page (`loan-lens-landing`)

Single static page, plain HTML/CSS (no framework needed), built with the
`frontend-design` skill for visual quality, deployed as a static Vercel site.

Sections:
1. **Hero** — plain-language "what is LoanLens" for a general visitor (a loan/mortgage
   affordability calculator: figure out your payment from a price, or your max price
   from a salary).
2. **Why it was built** — short general-audience blurb, plus the developer rationale
   for building the same app twice.
3. **How it was built** — technical section aimed at developers: React/Vite/Tailwind/
   Zustand vs Angular/signals/Tailwind, side by side, key architectural decisions
   (client-only, public weather API, localStorage persistence, no backend).
4. **Links out** to both live apps (React original, Angular edition).

## Deployment

All three projects deploy to Vercel via the already-authenticated CLI
(`thejaredchapman`):

- `loan_lens/` deploys as-is (Vite/React preset, no code changes).
- `loan-lens-angular/` deploys as an Angular build.
- `loan-lens-landing/` deploys as a static site.

Each deploy is confirmed with the user immediately before pushing to production,
consistent with treating deploys as a visible, hard-to-reverse action.

## Testing

- Port the calculation utilities (`amortization.ts`, `affordability.ts`) with basic
  unit tests confirming they produce the same output as the current JS versions for a
  handful of representative inputs — these are the highest-value/lowest-effort tests
  since they're pure functions and parity bugs here are the easiest to silently ship.
- Manual verification in the browser: both search modes, a few loan products, city
  switch (weather fetch + fallback), persisted state surviving a reload.
- No component/e2e test suite — out of scope for a two-app portfolio port.

## Risks

- Angular's reactivity model (signals/computed) is different enough from React's
  hooks that a literal line-by-line port isn't possible for `app.component.ts`'s
  derived-value chain; it's re-derived from the same math, not transliterated.
- Open-Meteo is a public, unauthenticated API with no key — both apps depend on it
  being available; the existing graceful-fallback behavior is preserved rather than
  hardened further, matching current scope.
