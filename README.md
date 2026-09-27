# Daya Enterprises — Premium 3D Website

A cinematic, scroll-driven corporate website for **Daya Enterprises** (Pune) — LED displays,
CCTV & surveillance, road safety, gantry fabrication, thermoplastic road marking, RPM
installation and structural fabrication.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber ·
Drei · Three.js · GSAP / ScrollTrigger**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose                              |
| --------------- | ------------------------------------- |
| `npm run dev`   | Local development server              |
| `npm run build` | Production build                      |
| `npm run start` | Serve the production build locally    |
| `npm run lint`  | Lint the codebase                     |

## Project structure

```
src/
  app/            Root layout, global styles, SEO metadata, page assembly
  lib/            Content (single source of truth), hooks (reduced motion, device capability)
  components/     UI sections
  components/three/  React Three Fiber scenes (hero highway, LED billboard, CCTV, road safety)
```

## Content

All business facts (name, phone, email, address, services, established year) live in
`src/lib/content.ts`. Update copy there rather than hunting through components — every
section reads from this single file. No client names, project counts, certifications or
statistics have been invented; placeholders are used where the brief said data wasn't
available yet (e.g. the map in the Contact section, and project photography).

## Replacing placeholder assets

- **Project photography**: `src/components/Projects.tsx` currently renders gradient
  placeholder tiles per category. Swap in real photos (e.g. via `next/image`) when available.
- **3D models**: the hero and featured scenes are built from primitive Three.js geometry
  (boxes, cylinders, planes) rather than external `.glb` models, since none were supplied.
  Swapping in real GLTF models later means loading them with `useGLTF` from `@react-three/drei`
  inside `src/components/three/*` and replacing the primitive meshes.
- **Map**: `src/components/ContactSection.tsx` has a placeholder card instead of an embedded
  map, per the brief's instruction not to fabricate a location from the PIN code alone. Add a
  Google Maps embed/iframe once exact coordinates are confirmed.
- **Contact form**: currently opens a pre-filled `mailto:` link (no backend was specified).
  To collect submissions directly, wire the `handleSubmit` function in `ContactSection.tsx` to
  a backend or a service like Formspree, Resend, or EmailJS.

## Performance & accessibility

- `prefers-reduced-motion` is respected throughout (GSAP animations and 3D camera motion
  are disabled/simplified).
- A device-capability check (`src/lib/useDeviceCapability.ts`) skips the heavy 3D canvases on
  narrow, low-core, touch devices in favor of a lightweight gradient fallback.
- Semantic HTML, heading hierarchy, ARIA labels, and focus-visible states are used throughout.
- SEO: page title/description match the brief, plus JSON-LD `LocalBusiness` structured data
  in `src/app/layout.tsx`.

## Deployment

This is a standard Next.js app — deploy it on [Vercel](https://vercel.com) (recommended, zero
config) by importing the GitHub repository, or anywhere else that supports Next.js SSR/ISR.
