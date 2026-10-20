# RD Design — Multi-page Website

An expanded, responsive custom-coded RD Design website based on the original HTML/CSS/JS homepage, referencing the supplied WordPress screenshots for **content and IA** but not reproducing the old layouts. No framework build step or Node runtime is required for production.

## Pages included

| Route | Purpose |
| --- | --- |
| `/` / `index.html` | Existing homepage, updated navigation, identity treatment and working links |
| `about.html` | Studio history, tCds → RD Design and approach |
| `portfolio.html` | Portfolio overview with working architecture/interior filters |
| `architecture.html`, `interior.html` | Discipline landing pages |
| `leisure-architecture.html`, `commercial-architecture.html`, `residential-architecture.html` | Architecture galleries |
| `leisure-interior.html`, `commercial-interior.html`, `residential-interior.html` | Interior galleries |
| `news.html` | News & Views thematic landing content |
| `contact.html` | Contact information, embedded Google Map, maps link and enquiry form |
| `project-*.html` (18 pages) | Individual static portfolio detail pages, reached by clicking category project titles or cover images |

Photos for the new gallery pages come from the accompanying media archive (`media-2025...zip`), grouped according to their original file-name families and optimized as WebP. Category galleries now link to **18 distinct, static project detail pages** that show the existing photo sets and breadcrumb/next-project navigation. These are visual case studies, not fully client-verified editorial biographies: dates, budgets, locations, and unsupported project details have deliberately not been invented.

## Run locally

In VS Code use Live Server or `python -m http.server 8080` and open `http://localhost:8080`.

## Deploy to Vercel (static)

1. Import this folder as a repo. **Framework Preset: Other**.
2. Root directory: repository root. No install/build/output directory required.
3. Deploy. All HTML routes/assets work as static files.
4. On static Vercel, contact/newsletter submissions open the visitor's email app with a prefilled message. **This is not a server-side form submission**; they still need to press Send.
5. To enable server-side form submission from Vercel, host the `/api` folder on a PHP server and edit `assets/js/config.js`:

   ```js
   window.RD_PHP_API_BASE = 'https://your-php-domain.example';
   ```

   In PHP host environment configuration also set `RD_ALLOWED_ORIGIN=https://your-vercel-domain.vercel.app` to permit that specific Vercel origin. If the HTML and PHP server are the same host, leave `RD_PHP_API_BASE` blank.

## Deploy to regular PHP hosting

1. Upload project files into `public_html` or your site's document root, keeping directory layout.
2. Default index is `index.html` (also an `index.php` passthrough is supplied). `*.html` routes need no rewrite rules.
3. Enable PHP 8.0+ and a working `mail()` transport on your host, or install/configure a host-level mail service. **PHP mail() does not work until outbound mail is configured by the host.**
4. Configure environment variables in the hosting control panel (not committed to Git):

   - `RD_CONTACT_TO=studio@rddesign.com` (verify address before launch)
   - `RD_MAIL_FROM=no-reply@your-verified-domain.example` (use a sender address authorized by your mail provider)
   - `RD_ALLOWED_ORIGIN=https://your-vercel-domain.vercel.app` (only when sending from Vercel frontend; otherwise omit)

   The two forms submit to `POST /api/contact.php` and `POST /api/newsletter.php`. JSON responses have `ok` and `message` fields. Empty honeypot, same-origin checks and a basic rate limit are included. Newsletter requests are emailed to the studio; **no mailing-list service or automatic consent database exists**.

5. Test from the *live PHP host* using a real email address, then verify studio inbox/spam folder. The backend returns an error if `mail()` rejects delivery, but a successful `mail()` call cannot guarantee final inbox arrival.

## Branding and typography

- Navigation uses CSS `font-family: "Century Gothic", "Avenir Next", "Trebuchet MS", Arial, sans-serif;`. Century Gothic is commercial and **is not redistributed here**. Devices without that font installed render the fallback. For identical rendering on all devices, supply a licensed webfont and add the corresponding `@font-face` declaration.
- tCds name displays the conventional Sri Lankan company suffix `(Pvt) Ltd`. **Confirm this is the entity's actual registered name before public launch.**
- The tCds reference screenshot is now recreated as a clean, scalable **reference-based vector redraw** (`assets/images/tcds-mark.svg` and `tcds-logo-full.svg`, with PNG exports); the original screenshot is low-resolution, so this is not a vector original provided by the studio. Get brand-owner approval of exact logo contours and lettering before publication. The RD Design logo remains from existing project assets.
- The split identity section is compacted by removing redundant introductory text and using a smaller logo treatment.

## Functional checks

- Mobile menu and nested Portfolio menu support click/tap, keyboard and Escape.
- Portfolio filter updates cards and pressed states.
- Each project row retains its expandable photo gallery, and its title/photo now opens a distinct project page. Gallery images on category and detail pages open the existing Escape/arrow-key lightbox.
- Homepage project tiles navigate to relevant gallery categories.
- Contact phone/email and Google Maps use real links; the Contact page displays an embedded studio-location map; forms validate fields.
- Animations use gentle image transitions, staggered reveal, and respect reduced-motion settings; no persistent text-moving effect.
- Added page styles are in `assets/css/pages.css` and interactions in `assets/js/pages.js`. Existing homepage structure/animations are preserved; one existing JavaScript crash (`isTouch` undefined) is fixed.

## Still awaiting client content / launch verification

- Brand-owner sign-off on the screenshot-based tCds logo redraw and the precise registered corporate styling.
- Verified case-study narratives, precise project-to-photograph labels, photography rights and additional photos where available. The 18 project URLs work, but are intentionally photo-led until that content is confirmed.
- Social media profile URLs (not guessed), publishing dates/posts for news, and any mailing-list integration.
- Live host domain, working mail sender/DNS (SPF, DKIM), consent/privacy text approval and contact email confirmation.

## October 18, 2026 client refinements

- The Contact page now shows an embedded map **below the enquiry/contact section** for **47 Buthgamuwa Rd, Sri Jayawardenepura Kotte 10100, Sri Lanka**. The external "Open In Google Maps" links use the client's supplied URL.
- Headings and subheadings across all HTML pages use Title Case. Corporate mark styling such as `tCds`, `RD Design`, and `MINI` is preserved.
- Editorial sequence numbers (`01`, `02`, `03`, `01 / 03`, etc.) have been removed from portfolio/navigation/features, News, About and Contact. The image lightbox's redundant numerical step display is also removed; previous/next image controls still work.
- Responsive map styles are in the new `assets/css/contact-map.css`, loaded only by `contact.html`. The map is an external iframe and needs internet access; no API key or image asset is required for it.
- The original galleries and image paths remain unchanged. The new delivery ZIPs include the existing media in the complete-site archive and add the approved-for-review tCds reference redraw as new files.
- Review `UPDATE_GUIDE.md` for the exact replace/copy instructions.
