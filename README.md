# Alpha Globe Ltd — Website

A production-ready, static, multi-page website. No build tools or frameworks
required — plain HTML, CSS, and vanilla JavaScript, deployable to any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3 + CloudFront, or a
standard cPanel/shared host).

## Structure

```
/index.html, about.html, services.html, team.html, blog.html,
  contact.html, privacy.html, terms.html, disclaimer.html, faq.html, 404.html
/blog/                  → three example blog articles
/partials/header.html   → shared site header (fetched at runtime)
/partials/footer.html   → shared site footer (fetched at runtime)
/assets/css/style.css   → full design system
/assets/js/include.js   → loads header/footer partials into every page
/assets/js/main.js      → mobile nav, cookie consent, forms, scroll reveal
/assets/img/            → favicon + social preview SVGs
/sitemap.xml, /robots.txt, /llm.txt
```

## How the shared header/footer work

Every page includes:
```html
<div data-include="header" data-root="./"></div>
...
<div data-include="footer" data-root="./"></div>
```
`assets/js/include.js` fetches `partials/header.html` and `partials/footer.html`
and injects them, so the navigation and footer only need to be edited in one
place. Pages inside `/blog/` use `data-root="../"` so the fetch paths resolve
correctly one level up.

**This requires the site to be served over http(s)** — opening `index.html`
directly from disk (`file://`) will block the fetch due to browser security
rules. To preview locally, run a simple local server from the project root,
for example:
```
npx serve .
```
or
```
python3 -m http.server 8080
```
Once deployed to any real static host, this works automatically with no
extra configuration.

## GDPR / cookie consent

`assets/js/main.js` includes a cookie consent banner that:
- Blocks nothing until the user chooses (defaults to necessary-only)
- Lets users Accept all / Reject non-essential / Manage preferences
- Stores the choice in `localStorage` and exposes `window.__alphaGlobeConsent`
- Can be reopened anytime via the "Cookie Settings" link in the footer

**Before adding analytics (e.g. GA4, Meta Pixel, etc.):** only load the
script when `window.__alphaGlobeConsent.analytics === true`, or listen for
the `consent:updated` event dispatched on `document`. This keeps the site
compliant — analytics must not fire before consent is given.

## Before going live — replace these placeholders

- **Phone, email, address:** currently `0123 456 7890` / `hello@alphaglobe.uk`
  / `20 Westbrook Crescent, Welling, Kent, DA16 1PU` — replace throughout
  `partials/header.html`, `partials/footer.html`, `contact.html`, and the
  JSON-LD schema block in `build.js`/generated `<head>` tags.
- **Social links:** `facebook.com` / `linkedin.com` / `instagram.com` in
  `partials/footer.html` point to the homepages, not a real profile — update
  with your real profile URLs.
- **Domain:** replace `https://www.alphaglobe.uk` in `sitemap.xml`, `robots.txt`,
  `llm.txt`, and the canonical/OG tags in every page's `<head>` once your
  final domain is confirmed.
- **Team page:** photos and bios are intentionally role-based placeholders
  (see the comment at the top of `team.html`) — replace with real staff
  photos and accurate bios once confirmed.
- **Images:** hero/section visuals currently use styled colour-gradient
  placeholders (the "arch" shape) rather than photography. Swap in real,
  consented photography of your homes, staff, and activities for the
  strongest impression — replace the relevant `.arch-frame` background
  styles or add an `<img>` inside them.
- **Contact form backend:** `assets/js/main.js` currently shows a success
  message on submit but does not send data anywhere. Connect it to a real
  endpoint (a serverless function, form service, or CRM webhook) before
  launch — see the comment in `initForms()`.
- **CQC / regulatory badge:** once registration is confirmed, add your CQC
  rating/badge and registration number to `about.html` and the footer, per
  the recommendation in the earlier website audit.

## Accessibility & performance notes

- Semantic HTML5, skip-to-content link, visible focus states, and
  `prefers-reduced-motion` support are built in.
- All colour pairings follow the WCAG AA contrast levels verified in
  `AlphaGlobe_New_Redesign_Palette.md`.
- Fonts are loaded from Google Fonts (Fraunces + Inter); self-host them if
  you need to avoid third-party font requests for performance or privacy
  reasons.

## Credit

Footer includes "Developed by: GreaterHeight Technologies" (linked to
https://greaterheight.tech) as requested, centred beneath the legal links.
