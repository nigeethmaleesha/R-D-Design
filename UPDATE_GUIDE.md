# RD Design — Installation Guide (18 October 2026)

## What changed

**Modified HTML pages (13):** `index.html`, `about.html`, `portfolio.html`, `architecture.html`, `interior.html`, all six architecture/interior category gallery pages, `news.html`, and `contact.html`. Heading and section-title casing is consistent; 01/02/03 editorial counters are removed; the Contact page has a new Google Maps section.

**Updated existing files:** `assets/css/pages.css` (removes obsolete number styles and styles the renamed enquiry label), `assets/js/pages.js` (removes only the lightbox's number label while keeping image navigation), `README.md` (documentation).

**New files:** `assets/css/contact-map.css` (responsive map styling) and this guide.

## Use the separate update packages

1. **Back up your current deployment** before replacing files.
2. Unzip `RD_Design_Modified_HTML.zip`, `RD_Design_Updated_CSS_JS_Docs.zip` and `RD_Design_New_Files.zip` to the **same RD Design project root**, preserving each relative folder path.
3. **Do not delete `assets/images/` on the existing website**. The user intentionally omitted images from the supplied ZIP. Keep all original images in their existing locations.
4. Deploy or publish the updated project to your hosting provider as usual.
5. Visit the Contact page, scroll past the contact information/form, and verify the map appears. Use **Open In Google Maps** to check the exact location.
6. Spot-check portfolio category filters, photo expand/lightbox navigation, mobile menu and contact form on the live deployment.

### Alternative: full-code package

`RD_Design_Complete_No_Images.zip` contains every provided source file plus all changes, but **not the original photos/logos**. Merge it with your existing project assets; do not deploy it as a replacement that deletes images.

### Map

- Studio address: **47 Buthgamuwa Rd, Sri Jayawardenepura Kotte 10100, Sri Lanka**
- Client Google Maps URL: https://maps.app.goo.gl/u9nyZy56wvTLsRBj7
- The map iframe uses the coordinates resolved from that link: `6.9098476, 79.9005024`. It needs internet access to display and doesn't require an API key.

### Scope and testing

- Existing photos, image paths, content sections, page links, and backend PHP handlers were left intact.
- HTML structure, map references, relative stylesheet paths, editorial counters, and JavaScript syntax were checked programmatically.
- Automated headless browser viewing was blocked in this runtime, so live visual and map tile rendering should still be verified after deployment.
