# Plaza Real Silao — Site Redesign & Investor Data Room

**Date:** 2026-06-18
**Status:** Approved (design direction green-lit)
**Author:** Antonio Murrieta + Claude

---

## 1. Goal

Completely re-design the Plaza Real Silao website to:

1. **Modernize** the look and feel into one cohesive, premium-but-warm brand system built from the existing logo.
2. **Make it faster** — cut page weight and render-blocking resources, targeting Lighthouse 95+.
3. **Announce the new anchor tenants** — Modatelas and Smart Fit (under construction, opening soon) with an anticipation-driven "Próximamente" moment + email lead capture.
4. **Add a genuinely-secured investor data room** — elegant, gated by real authentication, with view-only / watermarked documents.

The site serves **two audiences at once**:
- **Visitors / locals** searching for the plaza, its stores, hours, and location.
- **Investors** evaluating the plaza as an asset (the public site is part of the pitch; the data room is the private layer).

## 2. Non-Goals (YAGNI)

- No migration to a JS framework. Stays **vanilla HTML/CSS/JS** (per decision).
- No CMS, no e-commerce, no user accounts beyond investor access.
- No backend server. Forms continue using the existing no-backend pattern (FormSubmit). Auth is handled at the edge by Cloudflare Access, not custom code.
- No attempt to make documents 100% un-screenshottable (impossible on the web — see §7).

## 3. Decisions (locked)

| Decision | Choice |
|---|---|
| Scope | **Whole site** — Home, Tiendas, Espacios, FAQ, + new Inversionistas + Data Room |
| Build | **Vanilla static, optimized** (no framework) |
| New-store announcement | **Hero teaser badge + dedicated "Próximamente" section** with email capture |
| Data room security | **Cloudflare Pages + Cloudflare Access** (real edge auth) |
| Investor access model | **Per-investor email login** (one-time PIN, allow-list, revocable) |
| Hosting | **Migrate GitHub Pages → Cloudflare Pages** (free, faster CDN, unlocks Access) |

## 4. Design System

Built from the logo's own palette (the current purple/violet theme is removed entirely — it clashes with the brand).

### Color tokens
- `--cream` `#F7F2E7` — primary background
- `--terracotta` `#DD6B4A` — primary accent (CTAs, links, highlights)
- `--amber` `#E89A2D` — secondary accent
- `--espresso` `#33200F` — primary text + dark surfaces/sections
- Supporting warm neutrals (sand, muted brown, soft shadow `rgba(51,32,15,…)`).
- Final values to be tuned by sampling `images/logo-silao.webp` directly.

### Typography
- **Headings:** Fraunces (warm modern serif) — editorial/premium lift.
- **Body / UI:** Inter (clean, fast, already in use).
- **Self-hosted** woff2, latin subset, limited weights, `font-display: swap`, hero weight preloaded. Net result: faster than the current Google Fonts + Font Awesome setup.

### Motifs
- Subtle **arch shapes** echoing the plaza's Moorish architecture (section dividers, image framing).
- Soft rounded cards, warm shadows.
- The logo's interlocking-petal mark as a faint background texture in section breaks.

## 5. Information Architecture

One shared design-system stylesheet drives all pages.

```
/                      Home (redesigned)
/tiendas/              Store directory (filter + search; coming-soon entries)
/tiendas/detalle.html  Store detail (restyled)
/espacios/             Available spaces / leasing (restyled)
/faq/                  FAQ (restyled)
/inversionistas/       NEW — public investor-relations landing (ungated)
/inversionistas/data-room/   NEW — gated by Cloudflare Access (view-only docs)
```

### Homepage section flow
1. **Hero** — plaza photo, headline ("La plaza de confianza de Silao"), *"Muy pronto: Modatelas + Smart Fit"* teaser badge linking to the Próximamente section, CTAs (Ver Tiendas / Cómo Llegar).
2. **Próximamente spotlight** — see §6.
3. **Plaza en números** — stats band (tiendas, anchor brands, años desde 2019, ubicación frente a la central de autobuses, estacionamiento). Orients visitors + makes the investment case.
4. **Por qué Plaza Real** — value props (restyled).
5. **Tiendas destacadas** — featured store cards from `data/stores.json`.
6. **Ubicación / Cómo llegar** — map + location advantage.
7. **Inversionistas teaser** — understated band → `/inversionistas/`.
8. **Contacto + footer.**

## 6. Modatelas + Smart Fit — Anticipation Section

- Dedicated **"Próximamente"** section: two large premium cards (one per brand) — brand logo, one-line description, *"Próximamente 2026"* (or real date), and an **"Avísame cuando abra"** email capture per card (existing FormSubmit pattern → builds a launch list).
- Hero badge anchors down to this section.
- Coming-soon entries also appear in `/tiendas/` (visually marked, not linking to a live detail page).
- Placeholders used until real logos / dates are supplied.

## 7. Investor Data Room

### Hosting + auth
- Migrate the static site to **Cloudflare Pages** (connect the GitHub repo; same files; point domain via Cloudflare DNS).
- **Cloudflare Access** self-hosted application protects `/inversionistas/data-room/*` and its document assets.
  - Policy: allow-list of specific investor emails; one-time PIN delivered by email.
  - Free tier covers up to 50 users; access is logged; investors revocable individually.

### Document handling
- PDFs stored under the protected path.
- Rendered **view-only**: embedded PDF viewer (e.g., PDF.js), download/print UI removed, context menu (right-click) disabled.
- **Dynamic watermark** overlays each page with the viewer's email + timestamp.

### Honest constraint
View-only + watermarking deters casual download and makes any leak traceable. It **cannot** prevent a determined screenshot — no web technology can. The watermark is the real deterrent and is the professional standard.

### Public Inversionistas page (ungated)
- Tells the value story (location, foot traffic, anchors, growth, occupancy) with the "Plaza en números" highlights.
- Primary CTA: **"Entrar al Data Room"** → gated path (non-approved users hit the Cloudflare login).

## 8. Performance Plan

| Area | Action | Impact |
|---|---|---|
| Images | Drop PNG duplicates; serve WebP/AVIF with `srcset` + explicit width/height; lazy-load below fold; compress plaza hero | **~12MB → ~1.5MB**; fixes CLS |
| Icons | Remove Font Awesome CDN; inline ~15 SVGs we actually use | Removes render-blocking request + large download |
| CSS | Consolidate ~5,400 lines across 7 files into one tokenized system; inline critical CSS; defer rest | Smaller, faster first paint |
| JS | Collapse 3 overlapping image-loader scripts into one; defer non-critical JS | Less JS, fewer requests |
| Fonts | Self-host woff2, subset, limit weights, preload hero font | Faster than current external fonts |
| Hosting | Cloudflare CDN + long-cache asset headers | Faster global delivery |

**Targets:** Lighthouse 95+ (Perf/SEO/A11y/Best practices), LCP < 2s, CLS ≈ 0.

## 9. Build / Deploy Approach

- Vanilla static. Reuse/refresh existing image-optimization shell scripts for a one-time asset pass; no framework build required.
- Deploy: push to repo → Cloudflare Pages builds & serves the static output.
- Preserve existing SEO assets (structured data, sitemap, robots, manifest, PWA service worker) and update them to the new palette/content.

## 10. Inputs Needed (non-blocking — placeholders until provided)

1. Modatelas + Smart Fit logos and opening dates.
2. Data-room PDFs.
3. Investor emails to allow-list.
4. Real stats for the "Plaza en números" band.
5. Cloudflare account access (the one step requiring the owner; click-by-click instructions to be provided).

## 11. Risks & Mitigations

- **Cloudflare migration touches DNS/domain.** Mitigation: keep GitHub Pages live until Cloudflare is verified; document exact steps; cut over only after the new site is confirmed working.
- **Document security expectations.** Mitigation: set expectations explicitly (§7); rely on watermark + access logs.
- **Scope creep across 5+ pages.** Mitigation: build the design system + homepage first as the reference, then apply to inner pages page-by-page.

## 12. Success Criteria

- Cohesive warm/editorial brand across every page; no purple remnants.
- Próximamente section live with working "Avísame" capture.
- Investor page + data room gated by Cloudflare Access with per-investor email login and watermarked view-only docs.
- Lighthouse 95+ and page weight cut by ~85%.
- Deploy pipeline working on Cloudflare Pages with the custom domain.
