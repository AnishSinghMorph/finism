# Finism website

Marketing site for Finism Solutions (Global Capability Centres). React + Vite + TypeScript, Tailwind 4.

**Motion stack:** GSAP + ScrollTrigger (scroll-driven sections), Motion (hover, page and layout animation), Lenis (smooth scroll), React Three Fiber (the Finism dot, lazy-loaded on wide screens).

## Run

```
npm install
npm run dev        # http://localhost:5173
npm run build
node scripts/readiness.check.ts   # checks the Readiness Check rules against the wireframe's six sample buyers
```

## Where things are

- `src/content.ts`: page copy from the wireframe. Placeholders are marked in comments.
- `src/readiness.ts`: Readiness Check rules (to be validated by Finism).
- `src/routes.ts`: nav and routes. `src/pages/`: one file per page.
- Brand tokens (colours, Nunito Sans / Inter) are in `src/index.css`.

Forms have no backend yet: submitting opens the visitor's email app with the answers prefilled.
