# RD Design — Client-requested updates (1 November 2026)

This update is based on the supplied RD Design ZIP, the client's forwarded email screenshot, "Edited Content 1.docx", "Edited Content 2.docx" and "Form 1 Format.png".

## Files and changes

**Modified HTML (31 files):** Every existing `*.html` has only its primary ABOUT navigation entry changed to an ABOUT dropdown with links to `about.html#about-us`, `about.html#process`, and `about.html#design-ethos`. The existing Portfolio dropdown and all page content outside the scoped areas are retained.

- `index.html`: Exact home hero and Selected Works title/subtitle from Edited Content 1; applies the narrower-font-size adjustment needed for the longer hero heading. Existing story panels and hero slide media are unchanged.
- `about.html`: Preserves the existing tCds/RD Design two-identity story. Integrates all About Us, Process and Design Ethos client paragraphs from Edited Content 2, with two sample images; preserves the original three Process illustration cards.
- `contact.html`: Replaces the detailed project-only enquiry form with Full Name, Email ID, Mobile Number, Company Name, Category (General Enquiries / Careers / Vendors), and Message. Map, studio contact details and newsletter remain intact.

**Updated code files (4):**

- `assets/css/pages.css` — adds only scoped CSS for the nav text proportions and About/photo/form refinements.
- `assets/js/pages.js` — changes only the contact email-client handoff to include new form fields/category. Newsletter and other JavaScript remain unchanged.
- `api/contact.php` — validates the new fields and 3-category whitelist; uses optional category email routing.
- `api/_common.php` — allows `rd_mail` to accept an optional recipient (existing newsletter calls remain unchanged).

**New images (2):**

- `assets/images/studio/ruchi-portrait-sample.webp` — **illustrative sample portrait, NOT Ruchi Dhillon**.
- `assets/images/studio/studio-team-sample.webp` — **illustrative team image, NOT RD Design staff**.

The sample images are temporary, generated placeholders. Do not publish as factual representations of the studio. Their captions on `about.html` explicitly disclose that they are samples.

## Exactly which photos to swap later

1. Replace **Ruchi portrait**: `assets/images/studio/ruchi-portrait-sample.webp` (583 x 1024). On `about.html`, locate `class="studio-client-photo--portrait"`. When replacing it, update its `alt` text to accurately describe the actual photo and remove the temporary disclaimer line (`Sample portrait — not Ruchi Dhillon. Replace before launch.`). Keep the qualifications only after verifying the final studio preference.
2. Replace **Studio Team**: `assets/images/studio/studio-team-sample.webp` (930 x 1024). On `about.html`, locate `class="studio-client-photo--team"`; update the `alt` text, and remove (`Sample photograph — not RD Design staff. Replace before launch.`).

**Fastest replacement:** convert actual photos to WebP, overwrite the respective sample filenames in `assets/images/studio/`, and update the two About Us photo `alt` values/captions. Alternatively, use new filenames and edit the matching `src` values in `about.html`.

The photo containers use `object-fit: cover` for consistent responsive cropping. Test crop position on desktop and mobile with the client's actual photos.

## Enquiry email setup when client supplies addresses

The form supports 3 categories: `general`, `careers`, `vendors`.

On a PHP host, keep existing `RD_CONTACT_TO` configured as a verified studio fallback. Later add these host environment variables with the **real addresses**:

```
RD_GENERAL_TO=<verified general enquiries inbox>
RD_CAREERS_TO=<verified careers inbox>
RD_VENDORS_TO=<verified vendors inbox>
```

Also keep `RD_MAIL_FROM` as a verified sender, with outbound PHP mail transport working. Do not put guessed addresses in source code. If a category-specific environment variable is absent, the PHP handler sends to `RD_CONTACT_TO` (if configured). If recipient or sender configuration is missing, the handler returns a clear 503 error rather than claiming delivery.

On static Vercel / local-only hosting without PHP endpoint, the existing form behavior remains a **mailto handoff**: the visitor's email client opens a prepared email addressed to the existing studio address, with the selected category in subject/body. The visitor must press Send. To get server-side submissions on Vercel, connect an actual PHP API via the existing `assets/js/config.js` setting and configure `RD_ALLOWED_ORIGIN` on the PHP host.

## Deployment options

- **Entire website**: unzip `RD_Design_Complete_Updated_Project.zip`, deploy its `R-D-Design/` contents to the site root. Existing assets from the provided ZIP are included. `.git` internals are intentionally omitted.
- **Only changed files**: unzip `RD_Design_Changed_Files_Only.zip`, copy its `R-D-Design/` subtree over your existing matching directory, retaining exact subfolders. Take a backup first.
- **Separate categories**: unzip the Modified HTML / Updated Code / New Photos packages into the existing site root; each retains its relative file paths.

## Checks completed

- Client Word-document text matches the new rendered HTML verbatim (only Word's layout whitespace normalized).
- All 31 pages retain the Portfolio dropdown and footer newsletter; ABOUT submenu anchors resolve on About page.
- Existing original project images and homepage animation JavaScript are byte-for-byte unchanged.
- Desktop/mobile layout inspected at 1440px and 390px widths using a local in-memory browser; no horizontal overflow was observed, and both sample images loaded.
- JavaScript syntax (`node --check`) and PHP syntax (`php -l`) pass.
- PHP POST tests: invalid categories and malformed/short fields return HTTP 422; without configured mail delivery, valid category requests correctly return HTTP 503. **Actual email delivery cannot be tested until live addresses and mail transport are configured.**

## Client items still pending

- Authentic portrait photo and actual team photo; replace before public publishing.
- Three destination email IDs and verified sender/mail transport; run real delivery tests after configuration.
- Additional future project-specific photos/content remain for a later phase (nothing changed here).
- Century Gothic is a commercial font not bundled in this package; the existing CSS font stack uses installed Century Gothic or fallbacks. For pixel-identical font rendering on all devices, the studio must supply a licensed webfont.
