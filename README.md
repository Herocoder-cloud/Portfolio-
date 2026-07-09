# Portfolio -- Rahulgiri Goswami

A single-page developer portfolio with a Three.js-powered 3D hero,
scroll-triggered reveal animations, magnetic buttons, and a custom
cursor -- showcasing five deployed projects.

**Live demo:** _add your Netlify/GitHub Pages URL here after deploying_

## What's in here

- **3D hero (`script.js` -> `initHero3D`)**: a wireframe icosahedron
  built with Three.js, loaded from a CDN (no build step). It rotates
  on its own and gently follows the mouse for parallax.
- **Scroll reveal (`initScrollReveal`)**: uses `IntersectionObserver`
  to add a `.visible` class to elements as they enter the viewport,
  with a small stagger so grouped elements don't all animate at once.
- **Magnetic buttons (`initMagneticButtons`)**: buttons and links with
  the `.magnetic` class nudge slightly toward the cursor within their
  own bounding box.
- **Custom cursor (`initCustomCursor`)**: a small dot that follows the
  mouse and grows when hovering any link or button. Desktop only --
  hidden automatically on touch devices via a `(hover: hover)` media
  query, since a synthetic cursor makes no sense on a phone.

Every animation respects `prefers-reduced-motion` and is wrapped in a
try/catch during initialization, so if Three.js fails to load (e.g. a
flaky CDN), the rest of the page still works -- it just loses the 3D
background, nothing else breaks.

## Tech stack

- Vanilla HTML/CSS/JS, no framework, no build step
- Three.js (CDN) for the 3D hero
- Google Fonts: Bricolage Grotesque (display), Inter (body), JetBrains
  Mono (labels/tags)

## Updating your project links

All five project cards and their live/GitHub links live directly in
`index.html` inside `<article class="project-card">` blocks -- update
the `href` values there when a project's URL changes.

## Deploying this yourself

Same as the other projects: push to a GitHub repository, then either:

- **Netlify**: Add new site -> import repo -> deploy (no build command,
  publish directory `.`)
- **GitHub Pages**: repo Settings -> Pages -> Deploy from branch `main`,
  folder `/ (root)`

No environment variables or backend needed -- it's fully static.
