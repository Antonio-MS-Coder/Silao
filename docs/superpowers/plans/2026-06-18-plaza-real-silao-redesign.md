# Plaza Real Silao Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the entire Plaza Real Silao site into one warm/editorial brand system built from the logo, announce the Modatelas + Smart Fit openings, add a Cloudflare-gated investor data room, and cut page weight ~85%.

**Architecture:** Vanilla static HTML/CSS/JS. One shared tokenized stylesheet (`css/main.css`) + inlined critical CSS drives every page. Shared nav/footer keep being injected by `js/components.js`. Hosting moves from GitHub Pages to Cloudflare Pages so Cloudflare Access can gate `/inversionistas/data-room/*` with per-investor email login. Documents render view-only via PDF.js with a dynamic per-viewer watermark.

**Tech Stack:** HTML5, CSS (custom properties), vanilla JS (ES module-free IIFEs, matching existing code), PDF.js (data room only), Cloudflare Pages + Cloudflare Access, FormSubmit (forms), `cwebp`/`avifenc` (image pipeline).

## Global Constraints

- No framework, no bundler. Pure static files served as-is. (Spec §2, §9)
- Remove the purple/violet theme entirely — zero `#667eea`/`#764ba2`/purple remnants. (Spec §4)
- Palette tokens (verbatim, tune to logo): cream `#F7F2E7`, terracotta `#DD6B4A`, amber `#E89A2D`, espresso `#33200F`. (Spec §4)
- Fonts: Fraunces (headings) + Inter (body), **self-hosted** woff2, latin subset, `font-display: swap`. (Spec §4)
- Remove Font Awesome CDN; icons become inline SVG. (Spec §8)
- All content in Spanish (es-MX), matching existing copy voice. (existing site)
- Preserve SEO assets: structured data, `sitemap.xml`, `robots.txt`, `manifest.json`, `sw.js`, canonical tags, OG tags — update them to new palette/content, don't drop them. (Spec §9)
- Every `<img>` gets explicit `width`/`height` + `loading="lazy"` below the fold. (Spec §8)
- Honest security: data room is view-only + watermarked; do NOT claim downloads are impossible. (Spec §7)
- Keep GitHub Pages live until Cloudflare is verified; cut over only after confirmation. (Spec §11)
- Commit after every task. Work stays on branch `redesign-warm-editorial`.

**Verification note:** This is a static site with no test runner. "Tests" = browser checks via the gstack `/browse` skill (DOM state, screenshots), `git grep`/`bash` assertions (no banned tokens, file weights), and Lighthouse via `/benchmark`. Each task ends with a concrete, runnable check.

---

## Phase 0 — Foundation (design system + performance base)

### Task 1: Design tokens + base stylesheet

**Files:**
- Create: `css/main.css`
- Create: `css/critical-new.css` (above-the-fold subset, to be inlined later)
- Modify (later tasks): all page `<head>`s switch to `css/main.css`

**Interfaces:**
- Produces: CSS custom properties on `:root` consumed by every later task — exact names below. Utility classes: `.container`, `.btn`, `.btn-primary`, `.btn-secondary`, `.section`, `.eyebrow`, `.card`, `.badge`.

- [ ] **Step 1: Write the token + base layer**

Create `css/main.css` starting with:

```css
/* Plaza Real Silao — Design System (warm/editorial) */
:root {
  /* Brand (from logo) */
  --cream: #F7F2E7;
  --sand: #EFE7D6;
  --terracotta: #DD6B4A;
  --terracotta-dark: #C2563A;
  --amber: #E89A2D;
  --espresso: #33200F;
  --cocoa: #5A4632;
  --ink: #2A1B0E;

  /* Semantic */
  --bg: var(--cream);
  --bg-alt: #FFFDF8;
  --surface: #FFFFFF;
  --text: var(--espresso);
  --text-muted: #6B5743;
  --line: rgba(51, 32, 15, 0.12);
  --accent: var(--terracotta);
  --accent-2: var(--amber);

  /* Type */
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Scale */
  --container: 1180px;
  --radius: 14px;
  --radius-lg: 22px;
  --shadow-sm: 0 1px 2px rgba(51,32,15,.06), 0 1px 3px rgba(51,32,15,.08);
  --shadow-md: 0 6px 18px rgba(51,32,15,.10);
  --shadow-lg: 0 20px 45px rgba(51,32,15,.14);
  --ease: cubic-bezier(.2,.7,.2,1);

  /* Spacing */
  --s1:.25rem; --s2:.5rem; --s3:.75rem; --s4:1rem; --s5:1.5rem;
  --s6:2rem; --s7:3rem; --s8:4rem; --s9:6rem;
}

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{font-size:16px;scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--font-body);line-height:1.6;color:var(--text);background:var(--bg);overflow-x:hidden}
h1,h2,h3,h4{font-family:var(--font-display);font-weight:600;line-height:1.08;letter-spacing:-.01em;color:var(--ink)}
h1{font-size:clamp(2.4rem,6vw,4rem)}
h2{font-size:clamp(1.9rem,4vw,2.8rem)}
h3{font-size:clamp(1.2rem,2.5vw,1.6rem)}
p{color:var(--text-muted)}
a{color:var(--terracotta-dark);text-decoration:none;transition:color .2s var(--ease)}
a:hover{color:var(--terracotta)}
img{max-width:100%;height:auto;display:block}

.container{width:100%;max-width:var(--container);margin:0 auto;padding:0 var(--s5)}
.section{padding:var(--s9) 0}
.eyebrow{font-family:var(--font-body);font-weight:600;letter-spacing:.12em;text-transform:uppercase;
  font-size:.8rem;color:var(--terracotta)}

.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.6rem;border-radius:999px;
  font-weight:600;font-size:1rem;cursor:pointer;border:1.5px solid transparent;transition:all .2s var(--ease)}
.btn-primary{background:var(--terracotta);color:#fff}
.btn-primary:hover{background:var(--terracotta-dark);color:#fff;transform:translateY(-1px);box-shadow:var(--shadow-md)}
.btn-secondary{background:transparent;color:var(--espresso);border-color:var(--line)}
.btn-secondary:hover{border-color:var(--espresso);color:var(--espresso)}

.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);
  box-shadow:var(--shadow-sm);overflow:hidden;transition:transform .25s var(--ease),box-shadow .25s var(--ease)}
.card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.badge{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .7rem;border-radius:999px;
  font-size:.78rem;font-weight:600;background:var(--sand);color:var(--cocoa)}

/* Arch motif divider */
.arch-top{border-top-left-radius:50% 60px;border-top-right-radius:50% 60px}

@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
```

- [ ] **Step 2: Verify it parses and tokens resolve**

Create a scratch file `_scratch.html` linking `css/main.css` with a `<button class="btn btn-primary">Test</button>` and an `<h1>`. Open it:

Run: `/browse open file://$(pwd)/_scratch.html` then screenshot.
Expected: cream background, espresso serif H1, rounded terracotta button. No console errors.

- [ ] **Step 3: Remove scratch + commit**

```bash
rm -f _scratch.html
git add css/main.css css/critical-new.css
git commit -m "🎨 Add warm/editorial design system tokens + base layer"
```

---

### Task 2: Self-host Fraunces + Inter

**Files:**
- Create: `fonts/` with woff2 files
- Modify: `css/main.css` (add `@font-face`)

**Interfaces:**
- Consumes: `--font-display`, `--font-body` from Task 1.
- Produces: working self-hosted webfonts; no external font request.

- [ ] **Step 1: Download subset woff2 files**

Use google-webfonts-helper (gwfh.mranftl.com) or `fonts.gstatic.com`. Fetch latin subset:
- Inter: 400, 500, 600
- Fraunces: 500, 600 (opsz set to display)

```bash
mkdir -p fonts
# Example (adjust URLs from gwfh download links):
curl -L -o fonts/inter-400.woff2 "<inter-regular-latin-woff2-url>"
curl -L -o fonts/inter-500.woff2 "<inter-medium-latin-woff2-url>"
curl -L -o fonts/inter-600.woff2 "<inter-semibold-latin-woff2-url>"
curl -L -o fonts/fraunces-500.woff2 "<fraunces-500-latin-woff2-url>"
curl -L -o fonts/fraunces-600.woff2 "<fraunces-600-latin-woff2-url>"
```

Fallback if download is blocked: keep a `<link>` to Google Fonts for Fraunces+Inter ONLY (still drop Font Awesome) and note it in commit. Self-hosting preferred.

- [ ] **Step 2: Add @font-face to top of `css/main.css`**

```css
@font-face{font-family:"Inter";font-style:normal;font-weight:400;font-display:swap;
  src:url("/fonts/inter-400.woff2") format("woff2")}
@font-face{font-family:"Inter";font-weight:500;font-display:swap;src:url("/fonts/inter-500.woff2") format("woff2")}
@font-face{font-family:"Inter";font-weight:600;font-display:swap;src:url("/fonts/inter-600.woff2") format("woff2")}
@font-face{font-family:"Fraunces";font-weight:500;font-display:swap;src:url("/fonts/fraunces-500.woff2") format("woff2")}
@font-face{font-family:"Fraunces";font-weight:600;font-display:swap;src:url("/fonts/fraunces-600.woff2") format("woff2")}
```

- [ ] **Step 3: Verify fonts load**

Run: `/browse open file://$(pwd)/index.html` (after Task 5 the page exists; for now reuse a scratch H1).
Check: DevTools → Network shows woff2 from `/fonts/`, not gstatic. H1 renders in Fraunces.
Run: `ls -la fonts/ && du -sh fonts/` — Expected: 5 files, total < 250KB.

- [ ] **Step 4: Commit**

```bash
git add fonts css/main.css
git commit -m "🔤 Self-host Fraunces + Inter (latin subset)"
```

---

### Task 3: Inline SVG icon system (remove Font Awesome)

**Files:**
- Create: `images/icons/sprite.svg` (SVG `<symbol>` sprite)
- Modify: `js/components.js` (nav/footer use `<svg><use>` instead of `<i class="fas">`)

**Interfaces:**
- Produces: sprite with symbol ids: `bag, map, parking, shield, store, building, help, pin, clock, phone, mail, chevron-up, facebook, instagram, whatsapp, utensils, bell, heart, cap, landmark`.
- Consumed by: all later tasks via `<svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#NAME"></use></svg>`.

- [ ] **Step 1: Create the sprite**

Create `images/icons/sprite.svg` (use Lucide/Feather 24×24 paths; one `<symbol>` per id). Example shape:

```xml
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </symbol>
  <!-- repeat for every id in Interfaces list -->
</svg>
```

Add `.ico{width:1.25em;height:1.25em;display:inline-block;vertical-align:-.15em}` to `css/main.css`.

- [ ] **Step 2: Verify each symbol renders**

Create `_icons.html` rendering all 20 ids via `<use>`. `/browse open` + screenshot.
Expected: all 20 icons visible, none broken/empty.

- [ ] **Step 3: Remove scratch + commit**

```bash
rm -f _icons.html
git add images/icons/sprite.svg css/main.css
git commit -m "✨ Add inline SVG icon sprite (replaces Font Awesome)"
```

---

### Task 4: Image optimization pass + remove redundant JS loaders

**Files:**
- Delete: PNG duplicates where a `.webp` twin exists (`images/stores/*.png`, `images/plaza/*.png` with webp twins)
- Delete: `js/smart-image-loader.js`, `js/image-optimizer.js`, `js/universal-image-loader.js`
- Modify: page `<head>`/`<script>` references (done per-page in later tasks)

**Interfaces:**
- Produces: lean `images/` (< 2MB) using `.webp`; native `loading="lazy"` replaces the loader scripts.

- [ ] **Step 1: Baseline measure**

```bash
du -sh images/   # expect ~12M
```

- [ ] **Step 2: Delete PNG twins + compress plaza photos**

```bash
# delete PNGs that already have a .webp sibling
for f in images/stores/*.png images/plaza/*.png; do
  [ -f "${f%.png}.webp" ] && rm -f "$f"
done
# ensure plaza heroes have compressed webp (quality ~72)
command -v cwebp >/dev/null && for f in images/plaza/*.jpg; do
  cwebp -q 72 "$f" -o "${f%.jpg}.webp"
done
du -sh images/
```

Expected: images total drops sharply (target < 2MB). If `cwebp` missing: `brew install webp`.

- [ ] **Step 3: Remove the 3 loader scripts**

```bash
git rm js/smart-image-loader.js js/image-optimizer.js js/universal-image-loader.js
```

(Pages will use native `loading="lazy"` + `<picture>`/`srcset`; references removed in page tasks.)

- [ ] **Step 4: Verify weight + commit**

Run: `du -sh images/` — Expected: < 2MB.
```bash
git add -A images
git commit -m "🚀 Drop PNG duplicates + remove redundant image loaders (~12MB→<2MB)"
```

---

## Phase 1 — Homepage

### Task 5: Rebuild shared nav + footer with new system

**Files:**
- Modify: `js/components.js` (markup → new classes + SVG `<use>`; add Inversionistas link)

**Interfaces:**
- Consumes: sprite (Task 3), tokens (Task 1).
- Produces: `.navbar`, `.nav-menu`, `.mobile-sidebar`, `.footer` markup styled by `css/main.css`. Nav items: Inicio, Tiendas, Espacios, FAQ, **Inversionistas**, Visítanos.

- [ ] **Step 1: Update `navigationHTML` + `footerHTML`** to use `<svg class="ico"><use href="/images/icons/sprite.svg#…"></use></svg>` and the new class names; add `<li><a href="${basePath}/inversionistas/">Inversionistas</a></li>`. Keep the existing inject/active-link/mobile logic.

- [ ] **Step 2: Add nav/footer CSS** to `css/main.css` (sticky translucent cream navbar with blur, terracotta active underline, espresso footer with cream text).

- [ ] **Step 3: Verify** Run: `/browse open file://$(pwd)/index.html`; screenshot desktop + mobile (375px). Open hamburger.
Expected: nav shows 6 items incl. Inversionistas; icons render; mobile sidebar opens/closes; no Font Awesome 404s in console.

- [ ] **Step 4: Commit** `git add js/components.js css/main.css && git commit -m "🧭 Rebuild nav + footer in new design system"`

---

### Task 6: Homepage hero + Próximamente spotlight + "Avísame" capture

**Files:**
- Modify: `index.html` (head: swap CSS/JS refs, drop Font Awesome + Google Fonts CDN, add font preload, inline critical CSS, update theme-color `#33200F`; body: hero + próximamente)
- Modify: `css/main.css` (hero + próximamente styles)
- Modify: `js/home.js` (Avísame submit handler)

**Interfaces:**
- Consumes: nav (Task 5), tokens, sprite.
- Produces: `#proximamente` section anchor; `.avisame-form` posting to FormSubmit.

- [ ] **Step 1: Update `index.html` `<head>`** — remove `<link>` Font Awesome + Google Fonts; add `<link rel="preload" href="/fonts/fraunces-600.woff2" as="font" type="font/woff2" crossorigin>`; `<link rel="stylesheet" href="/css/main.css">`; inline critical CSS from `css/critical-new.css`; set `<meta name="theme-color" content="#33200F">`; keep GA + structured data (update `image`/colors only).

- [ ] **Step 2: Replace hero markup**

```html
<section class="hero">
  <div class="hero-media"><img src="/images/plaza/plaza-main.webp" alt="Plaza Real Silao"
      width="1600" height="900" fetchpriority="high"></div>
  <div class="container hero-inner">
    <a href="#proximamente" class="hero-badge badge">
      <svg class="ico"><use href="/images/icons/sprite.svg#store"></use></svg>
      Muy pronto: Modatelas + Smart Fit</a>
    <h1>La plaza de confianza<br>de Silao</h1>
    <p class="hero-sub">20+ tiendas locales y nacionales · Frente a la central de autobuses · Estacionamiento gratuito</p>
    <div class="hero-cta">
      <a href="/tiendas/" class="btn btn-primary">Ver todas las tiendas</a>
      <a href="#ubicacion" class="btn btn-secondary">Cómo llegar</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add Próximamente section** (two brand cards + per-card Avísame form posting to FormSubmit, mirroring the existing form in `espacios/index.html`):

```html
<section id="proximamente" class="section proximamente">
  <div class="container">
    <p class="eyebrow">Próximamente</p>
    <h2>Dos nuevas marcas llegan a Plaza Real</h2>
    <div class="prox-grid">
      <article class="card prox-card">
        <div class="prox-logo"><img src="/images/stores/modatelas.webp" alt="Modatelas"
            width="320" height="160" loading="lazy"></div>
        <h3>Modatelas</h3>
        <p>Telas, mercería y todo para tus proyectos de costura y decoración.</p>
        <span class="badge">Apertura 2026</span>
        <form class="avisame-form" action="https://formsubmit.co/contacto@plazarealsilao.com" method="POST">
          <input type="hidden" name="_subject" value="Avísame: Modatelas">
          <input type="email" name="email" required placeholder="Tu correo">
          <button class="btn btn-primary" type="submit">Avísame cuando abra</button>
        </form>
      </article>
      <!-- duplicate card for Smart Fit: #smartfit, gym copy -->
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add AJAX submit + success state in `js/home.js`** (prevent default, POST via fetch to the form action with `Accept: application/json`, swap form for "✓ ¡Listo! Te avisaremos."). Add placeholder `images/stores/modatelas.webp` + `smartfit.webp` (solid-color placeholders until real logos arrive).

- [ ] **Step 5: Add hero + próximamente CSS** to `css/main.css` (full-bleed hero image with espresso gradient scrim, cream headline; responsive 2-col prox-grid → 1-col on mobile).

- [ ] **Step 6: Verify** `/browse open file://$(pwd)/index.html`; screenshot. Submit an Avísame form with a test email.
Expected: hero badge scrolls to #proximamente; two brand cards; form shows success state; no console errors; `git grep -i "667eea\|font-awesome\|fontawesome" index.html` returns nothing.

- [ ] **Step 7: Commit** `git add index.html css/main.css js/home.js images/stores/modatelas.webp images/stores/smartfit.webp && git commit -m "🏠 New homepage hero + Próximamente (Modatelas + Smart Fit) with Avísame capture"`

---

### Task 7: Homepage body — stats band, value props, featured stores, location, investor teaser, contact

**Files:**
- Modify: `index.html` (replace remaining sections)
- Modify: `css/main.css`
- Modify: `js/home.js` (featured store card markup → new classes + SVG)

**Interfaces:**
- Consumes: `data/stores.json`, sprite, tokens.
- Produces: `#ubicacion` anchor; `.stats`, `.featured-grid`, `.invest-teaser`, `#contact` sections.

- [ ] **Step 1: Add "Plaza en números" stats band** — 4–5 stat cells (e.g., `22+ tiendas`, `Desde 2019`, `Frente a la central`, `Estacionamiento gratis`, `2 nuevas marcas`). Real values are placeholders in `data-` comments for the owner.

- [ ] **Step 2: Restyle "Por qué Plaza Real"** value props (4 feature cards, SVG icons).

- [ ] **Step 3: Update `loadStorePreview()` in `js/home.js`** to emit `.card` markup with `<svg><use>` category icons (map old FA category icons → sprite ids) and `<img loading="lazy" width height>`.

- [ ] **Step 4: Add Ubicación section** (`#ubicacion`) — keep Google Maps iframe (`loading="lazy"`), add address/hours beside it with SVG icons.

- [ ] **Step 5: Add Inversionistas teaser band** — understated espresso band: "¿Interesado en invertir o conocer la oportunidad?" → `<a class="btn" href="/inversionistas/">Conoce la oportunidad</a>`.

- [ ] **Step 6: Restyle Contacto** section + ensure footer/back-to-top use sprite.

- [ ] **Step 7: Verify** `/browse open file://$(pwd)/index.html`; full-page screenshot at 1280px + 375px. Confirm featured stores load from JSON (6 cards), images lazy-load, no console errors.

- [ ] **Step 8: Commit** `git add index.html css/main.css js/home.js && git commit -m "🏠 Homepage body: stats, value props, featured stores, location, investor teaser, contact"`

---

## Phase 2 — Inner pages

### Task 8: Tiendas listing + filters + coming-soon entries

**Files:**
- Modify: `tiendas/index.html` (head swap, markup), `js/stores.js`, `css/main.css`
- Modify: `data/stores.json` (add Modatelas + Smart Fit with `"status":"coming-soon"`)

- [ ] **Step 1:** Swap head to new system (drop FA/Google Fonts, add main.css + font preload + inline critical CSS).
- [ ] **Step 2:** Add Modatelas + Smart Fit to `data/stores.json` with `"status":"coming-soon"` and category `retail`/`health`.
- [ ] **Step 3:** Update `js/stores.js` card render → `.card` + SVG icons; coming-soon cards show a "Próximamente" `.badge` overlay and are non-clickable (no detail link).
- [ ] **Step 4:** Restyle category filter chips (terracotta active state) + search input in `css/main.css`.
- [ ] **Step 5: Verify** `/browse open file://$(pwd)/tiendas/index.html`; click each category filter, type in search.
Expected: 24 stores (22 + 2 coming-soon); coming-soon visibly marked + non-clickable; filters narrow the grid; no console errors.
- [ ] **Step 6: Commit** `git add tiendas/index.html js/stores.js css/main.css data/stores.json && git commit -m "🏬 Tiendas page in new system + coming-soon entries"`

---

### Task 9: Store detail page

**Files:**
- Modify: `tiendas/detalle.html`, `js/store-detail.js`, `css/main.css`

- [ ] **Step 1:** Swap head to new system.
- [ ] **Step 2:** Restyle detail layout (hero image, services list with SVG checks, hours/location card) using tokens; coming-soon stores show a Próximamente state instead of contact.
- [ ] **Step 3: Verify** `/browse open "file://$(pwd)/tiendas/detalle.html?id=elektra"`; screenshot. Try `?id=modatelas` (coming-soon state).
Expected: store renders from JSON; back link works; no console errors.
- [ ] **Step 4: Commit** `git add tiendas/detalle.html js/store-detail.js css/main.css && git commit -m "🏪 Store detail page in new system"`

---

### Task 10: Espacios + FAQ pages

**Files:**
- Modify: `espacios/index.html`, `espacios/gracias.html`, `js/espacios.js`, `faq/index.html`, `js/faq.js`, `css/main.css`
- Delete: `css/espacios.css`, `css/eventos.css`, `css/faq.css`, `css/styles.css`, `css/base.css`, `css/components.css`, `css/critical.css` (after confirming nothing else references them)

- [ ] **Step 1:** Swap both pages' heads to new system; restyle the leasing form (keep FormSubmit) + FAQ accordion using tokens + sprite.
- [ ] **Step 2:** `git grep -l "styles.css\|faq.css\|espacios.css\|eventos.css\|base.css\|critical.css"` — confirm only files we're about to update reference the old CSS, then delete the old CSS files.
- [ ] **Step 3: Verify** `/browse open` both pages; expand an FAQ item; submit the leasing form (→ gracias.html).
Expected: both pages on-brand; accordion works; form redirects to gracias; no 404 for deleted CSS.
- [ ] **Step 4: Commit** `git add -A && git commit -m "📄 Espacios + FAQ in new system; remove legacy CSS"`

---

## Phase 3 — Investor page + data room

### Task 11: Public Inversionistas page

**Files:**
- Create: `inversionistas/index.html`, `js/inversionistas.js` (optional)
- Modify: `css/main.css`, `sitemap.xml`

**Interfaces:**
- Produces: ungated investor story page; primary CTA → `/inversionistas/data-room/`.

- [ ] **Step 1:** Build the page (new system head): hero ("La oportunidad Plaza Real Silao"), value story (ubicación/foot-traffic/anchors/ocupación as stat cards reusing `.stats`), "Plaza en números" highlights, and a CTA card **"Entrar al Data Room"** → `/inversionistas/data-room/`. Use placeholder figures flagged for the owner.
- [ ] **Step 2:** Add page to `sitemap.xml`; add `noindex` to the data-room path only (NOT this page).
- [ ] **Step 3: Verify** `/browse open file://$(pwd)/inversionistas/index.html`; screenshot. CTA links to data-room.
- [ ] **Step 4: Commit** `git add inversionistas/index.html css/main.css sitemap.xml && git commit -m "📈 Public Inversionistas page"`

---

### Task 12: Data room — view-only PDF.js viewer + dynamic watermark

**Files:**
- Create: `inversionistas/data-room/index.html`, `inversionistas/data-room/viewer.js`, `inversionistas/data-room/docs/.gitkeep`
- Create: `inversionistas/data-room/_headers` (noindex; later Access-gated)
- Modify: `css/main.css`

**Interfaces:**
- Consumes: PDF.js (pinned CDN or vendored under `/vendor/pdfjs/`), Cloudflare identity endpoint `/cdn-cgi/access/get-identity`.
- Produces: a document list that renders PDFs to `<canvas>` (no native download button), watermarked with the viewer's email + date.

- [ ] **Step 1: Build the data-room shell** — list of documents (titles + a "Ver" button each). On click, render with PDF.js into a canvas container. Vendor PDF.js (`pdf.min.js` + `pdf.worker.min.js`) under `/vendor/pdfjs/` so it works behind the gate offline of CDNs.

- [ ] **Step 2: Fetch viewer identity for the watermark**

```js
// viewer.js
async function getViewer(){
  try{ const r = await fetch('/cdn-cgi/access/get-identity'); if(r.ok){const j=await r.json(); return j.email||j.name||'acceso autorizado';}}catch(e){}
  return 'acceso autorizado';
}
```

- [ ] **Step 3: Render PDF page to canvas + overlay watermark** (tiled, low-opacity, email + ISO date), and harden against casual copy:

```js
// after rendering each page canvas at scale:
function stampWatermark(ctx, w, h, label){
  ctx.save(); ctx.globalAlpha=.12; ctx.fillStyle='#33200F';
  ctx.font='16px Inter, sans-serif'; ctx.translate(w/2,h/2); ctx.rotate(-Math.PI/8);
  for(let y=-h;y<h;y+=120) for(let x=-w;x<w;x+=320) ctx.fillText(label, x, y);
  ctx.restore();
}
document.addEventListener('contextmenu', e=>e.preventDefault());
document.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey)&&['s','p'].includes(e.key.toLowerCase())) e.preventDefault(); });
```

Add a visible honest note on the page: *"Documentos confidenciales — vista protegida y marcada con tu identidad."*

- [ ] **Step 4: Add `_headers`** for `inversionistas/data-room/*`: `X-Robots-Tag: noindex` and `Content-Security-Policy` as appropriate. (Cloudflare Access policy is added in Task 13.)

- [ ] **Step 5: Verify (local, pre-gate)** Place a sample PDF in `docs/`. `/browse open file://$(pwd)/inversionistas/data-room/index.html`.
Expected: PDF renders to canvas; watermark tiled across it ("acceso autorizado" locally); right-click disabled; no native download button present.

- [ ] **Step 6: Commit** `git add inversionistas/data-room vendor/pdfjs css/main.css && git commit -m "🔒 Data room: view-only PDF.js viewer with dynamic watermark"`

---

## Phase 4 — Infrastructure (owner-assisted)

### Task 13: Cloudflare Pages migration + Cloudflare Access gate

**Files:**
- Create: `docs/superpowers/runbooks/cloudflare-setup.md` (the click-by-click the owner follows)

> This task changes DNS + hosting and needs the owner's Cloudflare account. Keep GitHub Pages live until verified (Spec §11).

- [ ] **Step 1: Write the runbook** with these exact steps:
  1. Create Cloudflare account; **Add a site** for `plazarealsilao.com`; copy the two nameservers.
  2. At the domain registrar, replace nameservers with Cloudflare's; wait for "Active".
  3. **Workers & Pages → Create → Pages → Connect to Git** → select the `Silao` repo, branch `main` (after merge), build command: *none*, output dir: `/` (root). Deploy.
  4. **Custom domains** → add `plazarealsilao.com` + `www`. Confirm SSL active.
  5. **Zero Trust → Access → Applications → Add → Self-hosted**: name "Data Room", domain `plazarealsilao.com`, path `/inversionistas/data-room`.
  6. **Policy**: Action *Allow*; Include → *Emails* → paste the investor list. Identity: **One-time PIN** (enable in Zero Trust → Settings → Authentication).
  7. Session duration e.g. 24h. Save.
- [ ] **Step 2: Verify gate** From a non-allowed email/incognito, visit `/inversionistas/data-room/` → Cloudflare OTP screen blocks it. From an allowed email → OTP → page loads, watermark shows that email (via `/cdn-cgi/access/get-identity`).
- [ ] **Step 3: Verify public pages are NOT gated** (home, tiendas, inversionistas landing all load without login).
- [ ] **Step 4: Commit** `git add docs/superpowers/runbooks/cloudflare-setup.md && git commit -m "☁️ Cloudflare Pages + Access setup runbook"`

---

## Phase 5 — Verification

### Task 14: Performance + cross-page QA

- [ ] **Step 1: No-regression greps**

```bash
git grep -i "667eea\|764ba2\|font-awesome\|fontawesome\|cdnjs" -- '*.html' '*.css' '*.js' || echo "CLEAN"
```
Expected: `CLEAN` (no purple, no Font Awesome, no CDN icon refs).

- [ ] **Step 2: Weight check** `du -sh images/ && wc -l css/*.css`
Expected: images < 2MB; CSS consolidated to `main.css` (+ optional small files), far below the old 5,400 lines.

- [ ] **Step 3: Lighthouse** Run `/benchmark` (or Chrome Lighthouse) on home, tiendas, inversionistas.
Expected: Performance/SEO/Best-Practices/A11y ≥ 95; LCP < 2s; CLS ≈ 0.

- [ ] **Step 4: Responsive + functional sweep** via `/browse` at 375 / 768 / 1280: nav + mobile menu, Avísame submit, tiendas filters/search, FAQ accordion, leasing form, data-room gate.

- [ ] **Step 5: Commit any fixes** then finish the branch (PR) via superpowers:finishing-a-development-branch.

---

## Self-Review (coverage vs spec)

- §3 decisions → Tasks 5 (nav link), 6 (announcement), 13 (Cloudflare + email login). ✓
- §4 design system → Tasks 1–3. ✓
- §5 IA → Tasks 5–12 (all pages incl. new Inversionistas + data room). ✓
- §6 Próximamente → Task 6 (+ 8 coming-soon in directory). ✓
- §7 data room → Tasks 12 (viewer/watermark/view-only) + 13 (Access/email login). ✓
- §8 performance → Tasks 2 (fonts), 3 (icons), 4 (images/JS), 6/7 (lazy+dims), 14 (verify). ✓
- §9 build/deploy → Task 13; SEO assets preserved across page tasks. ✓
- §11 risks → Task 13 keeps GH Pages live until verified. ✓
- §12 success criteria → Task 14. ✓

Type/name consistency: sprite ids (Task 3) reused verbatim in Tasks 5–12; `getViewer()`/`stampWatermark()` defined in Task 12; tokens defined in Task 1 used throughout. ✓
