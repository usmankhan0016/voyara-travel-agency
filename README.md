# Voyara — Luxury Travel Agency Landing Page

A premium, fully responsive single-page travel agency website built with the Next.js App Router,
TypeScript, Tailwind CSS and GSAP. Voyara presents four core offerings — **visa services, flight
ticket booking, hotel booking and car rental** — behind a working 4-tab search engine, a filterable
destination slider and scroll-driven animation throughout.

No backend, no external APIs: every collection is mock data served from a single module.

---

## Tech stack

| Concern | Choice |
| :--- | :--- |
| Framework | Next.js 16 (App Router) with the React Compiler enabled |
| Language | TypeScript 5 (strict) |
| UI runtime | React 19 |
| Styling | Tailwind CSS 3 with a custom brand token layer |
| Animation | GSAP 3 + ScrollTrigger |
| Icons | `lucide-react` |
| Utilities | `clsx` + `tailwind-merge` (via a `cn()` helper) |
| Fonts | Plus Jakarta Sans, self-hosted through `next/font` |

---

## Getting started

Requires **Node.js 20 or newer**.

```bash
# 1. clone and enter the project
git clone <repository-url>
cd travel-agency-site

# 2. install dependencies
npm install

# 3. start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (next/core-web-vitals)
```

### Deploying

The project is a stock Next.js app with no environment variables and no runtime services, so it
deploys to Vercel as-is: import the repository and accept the detected defaults.

---

## Architecture

```text
src/
├── app/
│   ├── layout.tsx          # root layout: font variable, metadata
│   ├── page.tsx            # the single page — composes every section in order
│   ├── globals.css         # Tailwind layers, glassmorphism helpers, base styles
│   └── icon.svg            # favicon (auto-detected by the App Router)
├── components/
│   ├── layouts/            # chrome that frames the page
│   │   ├── navbar.tsx      # pill nav, scroll-spy, GSAP slide-out mobile drawer
│   │   └── footer.tsx      # link columns, newsletter, copy-to-clipboard contacts
│   ├── sections/           # one file per page section
│   │   ├── hero.tsx
│   │   ├── partners.tsx
│   │   ├── booking-widget.tsx
│   │   ├── services.tsx
│   │   ├── destinations.tsx
│   │   ├── stats-counter.tsx
│   │   ├── testimonials.tsx
│   │   └── contact-form.tsx
│   └── ui/
│       └── section-heading.tsx   # shared eyebrow + title + description header
├── data/
│   └── mock-data.ts        # every static collection and all page copy
└── lib/
    ├── utils.ts            # cn() — clsx + tailwind-merge
    └── tilt.ts             # pointer-tracking scale-and-tilt hover helper
```

A few conventions worth knowing before reading the code:

- **The data layer is centralised.** `src/data/mock-data.ts` owns the services, destinations,
  stats, testimonials, partners, search results, nav links, brand details and section copy, each
  with an exported interface. No component hardcodes an array.
- **Server by default.** `app/page.tsx` is a server component; only sections that animate or hold
  state are marked `"use client"`.
- **Animations are scoped and reverted.** Each section's scroll-driven tweens register ScrollTrigger
  inside `gsap.context(..., containerRef)` and return `ctx.revert()`, so nothing leaks across
  unmounts or Fast Refresh. The navbar drawer is the one exception: it kills its own tweens
  instead, because reverting on every toggle would snap an interrupted slide back to its start.
- **Design tokens live in Tailwind.** Brand colours, shadows (`shadow-card`, `shadow-card-hover`,
  `shadow-glass`, `shadow-pill`), radii and keyframes are defined in `tailwind.config.ts` rather
  than written inline, so the palette is changed in one place.
- **Reduced motion is respected.** Counters, the destination autoplay and the tilt hover all check
  `prefers-reduced-motion` and degrade to a static or instant state.

---

## Features

### Booking engine — 4 tabs, working mock search

A prominent tabbed search bar covering **Flights**, **Hotels**, **Visa** and **Car Rental**, each
with its own field set (origin/destination and cabin class for flights, check-in/check-out and
guests for hotels, destination/citizenship/visa type for visas, pickup and vehicle class for cars).

- Per-tab validation with inline errors: required fields, past dates, a return date before
  departure, a destination matching the origin, a one-night minimum stay, and applying for a visa
  to your own country. The first invalid field receives focus on submit.
- An animated loading state on the search button, then a results panel that reveals matched mock
  options with a staggered GSAP entrance, plus a toast reporting the match count.
- Each result can be "reserved", which resolves after a short delay into a generated booking
  reference and a confirmation toast.
- Form state is held per tab, so switching tabs does not lose what was typed.

### Services

The four offerings render as a horizontal expanding accordion on desktop — collapsed vertical pills
that open into a split image-and-detail card — and as scrollable chip tabs with a single card on
smaller screens. Each service carries a badge, a four-point checklist that re-staggers on open, and
a call to action.

### Destinations

A full-bleed slider over nine curated packages, with **working region filter pills**
(`All`, `Europe`, `Asia`, `Middle East`, `Islands`). Every region holds at least two destinations,
so no filter lands on an empty-looking rail. Selecting a region rebuilds the slider around that
subset.

Clicking a thumbnail morphs that card into the full-bleed background via an animated `clip-path`
while the track shifts and the copy swaps. Supporting details: a vertical progress rail, arrows,
progress dots, a slide counter, savable bookmarks, an oversized watermark, and autoplay that pauses
on hover and on focus.

### Stats counters

Four KPI cards — 99.4% visa approval, 150+ destinations, 24k+ travellers, 24/7 support — whose
numbers tick from zero to target on first scroll into view, alongside micro bar charts that grow
from their baseline.

### Testimonials

A split quote-and-portrait card over three verified reviews, each with a rating, the package booked
and an outcome badge. Advancing exits the outgoing quote and blurs out the portrait before the
incoming one animates in; dots and arrows both drive it.

### Contact

A controlled lead form (name, email, phone, service selector, destinations and dates) with a
simulated submission that swaps in a success panel and then resets itself. Beside it sit direct
contact channels with the office address.

### Animation summary

| Requirement | Where |
| :--- | :--- |
| Staggered hero reveal on load | `hero.tsx` |
| ScrollTrigger batch card reveals | services, destinations, stats, testimonials, contact |
| Numeric counters from 0 on scroll | `stats-counter.tsx` |
| Scale-and-tilt hover micro-interactions | `lib/tilt.ts`, applied to the stat and destination cards |
| Slide-out mobile drawer | `navbar.tsx` |
| `clip-path` card-to-background morph | `destinations.tsx` |

### Responsiveness

Built against three breakpoints. Mobile (`< 640px`) gets a slide-out drawer with a scroll lock and
Escape handling, stacked single-column sections and horizontally scrollable tab strips; tablet
(`640–1024px`) moves to two-column grids; desktop (`> 1024px`) adds the four-column grids, the
expanding services accordion and the hover micro-interactions.

Accessibility carried through: semantic landmarks and headings, labelled form controls with
`aria-invalid` and `aria-describedby` error wiring announced via `role="alert"`, `aria-pressed` and
`aria-current` on the filters and sliders, keyboard-operable slider cards, and a `role="dialog"`
drawer that closes on Escape.

---

## Notes

Images are local assets under `public/` for destinations, services and the hero; the testimonial and
hero preview portraits are served from Unsplash and whitelisted in `next.config.ts`. All of them run
through `next/image`.

The contact form, the newsletter field and every search and reservation are mock interactions — they
resolve locally and send nothing anywhere.
