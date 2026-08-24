# Johnstone Building — website

A static website for [Johnstone Building](https://johnstonebuilding.co.nz/), an Auckland
luxury residential construction company.

Plain HTML, one CSS file, one JavaScript file. **No backend, no build step, no
dependencies.** Push to `main` and the site is live.

---

## How it works

```
edit the .html files  →  git commit  →  git push  →  host rebuilds  →  live
```

There is nothing to compile. What is in this repository is exactly what gets served.
You can open `index.html` straight off your desktop and it will work.

---

## Files

```
index.html               Homepage
work.html                Portfolio grid with filtering
services.html            The five service lines + FAQ
about.html               The practice, principles, numbers
contact.html             Enquiry form and details
project-headland.html    Case study
project-kohu.html        Case study
project-showroom.html    Case study
thanks.html              Form success page
404.html                 Not-found page

assets/css/site.css      All styling. Brand tokens live at the very top.
assets/js/site.js        All behaviour. Vanilla, ~350 lines, commented.
assets/img/              Photography (see assets/img/README.md)
assets/favicon.svg       Monogram favicon

netlify.toml             Netlify config (publish root, cache + security headers)
.github/workflows/       GitHub Pages deploy workflow
sitemap.xml, robots.txt  SEO
site.webmanifest         PWA/icon metadata
```

---

## Running it locally

```bash
# any static server works — this one needs nothing installed but Python
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Deploying

Pick one. All three watch the git branch and redeploy on push.

### Netlify (recommended — the contact form works with zero setup)

1. New site → Import an existing project → pick this repository.
2. Build command: *(leave empty)*. Publish directory: `.`
3. Deploy. `netlify.toml` already sets the caching and security headers.
4. Domain settings → add `johnstonebuilding.co.nz`, then point the domain's
   nameservers or an `ALIAS`/`CNAME` record at Netlify.
5. Enquiries land under **Forms → enquiry** in the Netlify dashboard. Add an email
   notification there so they also arrive in the inbox.

### Cloudflare Pages

Same idea: connect the repo, no build command, output directory `/`.
The contact form falls back to email mode — see below.

### GitHub Pages

`.github/workflows/pages.yml` is already here. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.
Add a `CNAME` file containing `johnstonebuilding.co.nz` for the custom domain.

---

## Contact form

Static hosting has no server, so the form has two modes. It is set to Netlify mode.

**Netlify mode** (current): the `<form>` in `contact.html` carries
`data-mode="netlify"` plus `data-netlify="true"`. Netlify intercepts the POST,
stores the submission and redirects to `thanks.html`.

**Email mode** (everywhere else): delete `data-mode="netlify"` from the form tag.
The form then validates the fields and opens the visitor's mail client with a
formatted enquiry already written, addressed to the value of `data-email`.

To use a third-party endpoint instead (Formspree, Basin, Getform), remove
`data-mode="netlify"` and set `action` to the endpoint URL.

---

## Rebranding this for another client

This site is built to be cloned. In order of effort:

1. **Colours and type** — everything is a CSS custom property in the `:root` block at
   the top of `assets/css/site.css`. Change `--ink`, `--bone`, `--bronze` and the two
   `--font-*` values and the whole site re-skins consistently.
2. **Fonts** — swap the Google Fonts `<link>` in each page's `<head>` and update
   `--font-display` / `--font-sans`.
3. **Images** — drop replacements into `assets/img/` using the same filenames.
   See `assets/img/README.md` for the sizes.
4. **Copy** — edit the HTML directly. The shared header, mobile menu, closing
   call-to-action band and footer are byte-identical on every page, so a find-and-replace
   across all `.html` files is safe.
5. **Metadata** — per page: `<title>`, `<meta name="description">`, the `og:*` tags,
   `<link rel="canonical">`. Homepage also has a `GeneralContractor` JSON-LD block.
   Update `sitemap.xml`, `robots.txt` and `site.webmanifest` with the new domain.

---

## Design notes

- **Type**: Instrument Serif for display, Inter Tight for interface. All sizes are
  `clamp()`-based, so nothing needs a breakpoint to stay proportional.
- **Motion**: `IntersectionObserver` reveals, a masked line-by-line headline rise,
  a slow image un-zoom, hero parallax, animated counters, and a cursor-following
  image preview on the capability rows. Everything is transform/opacity only.
- **`prefers-reduced-motion`** is fully honoured — all of the above collapses to a
  static page, and the preloader is skipped entirely.
- **Accessibility**: skip link, visible focus rings, `aria-current` on the active nav
  item, labelled form fields, an `aria-live` form status, and semantic landmarks.
- **No-JS**: every page is fully readable and navigable with JavaScript disabled.
- **Performance**: no frameworks, no libraries. Two local assets and one font request.

---

## Before this goes live

See **[CONTENT-TODO.md](CONTENT-TODO.md)** — the project names, photography, statistics
and phone number in this build are placeholders and need to be replaced with real
Johnstone Building content.
