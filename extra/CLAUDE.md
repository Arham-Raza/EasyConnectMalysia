# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for Easy Connect Solutions Malaysia — an ITAD (IT Asset Disposition) and refurbished IT hardware company. No build tools, no package manager, no backend.

## Running Locally

Open `index.html` directly in a browser, or serve with any static HTTP server:

```
python -m http.server 8080
# or
npx serve .
```

No install step required. All external dependencies load from CDN.

## Architecture

Three files make up the entire frontend:

- **`index.html`** — Single-page layout with six anchor-linked sections (Home, About, Services, Products, Education, Contact). All translatable text elements carry a `data-i18n="<key>"` attribute.
- **`css/style.css`** — All styling. Uses CSS custom properties for the theme (see below). Glassmorphism design with `backdrop-filter` blur on cards and hero overlays. Responsive breakpoints at 1024px and 768px.
- **`js/lang.js`** — i18n system supporting English (`en`), Malay (`ms`), and Chinese (`zh`). `setLanguage(lang)` walks all `[data-i18n]` elements and replaces `textContent` from the translation map. Language preference persists in `localStorage`.
- **`js/app.js`** — Navbar scroll class, IntersectionObserver-driven stat counters (`animateValue()`), and AOS initialization.

## CSS Theme Variables

Defined at `:root` in `style.css`:

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `#003366` | Dark blue — primary brand color |
| `--primary-light` | `#1E40AF` | Hover states |
| `--accent` | `#0D9488` | Teal — CTAs, highlights |
| `--glass-white` | `rgba(255,255,255,0.85)` | Card backgrounds |
| `--glass-blue` | `rgba(0,51,102,0.05)` | Subtle section tints |

## Adding Translations

Add a key to all three language objects (`en`, `ms`, `zh`) inside `js/lang.js`, then add `data-i18n="<key>"` to the HTML element.

## External CDN Dependencies

- **Google Fonts** — Inter (300–800 weights)
- **Font Awesome 6.4.0** — Icons throughout the site
- **AOS 2.3.1** — Scroll-triggered fade/slide animations (initialized in `app.js`)

The site will degrade gracefully if CDNs are unavailable (no hard JS errors), but icons and animations won't display.

## Images

All assets are PNGs in `images/`. Files average ~850 KB — avoid adding uncompressed images. Background images use `background-attachment: fixed` for a parallax effect; this is intentional.
