# Babylon-Flow-OS

## Lore archive

The app now keeps its working archive in IndexedDB, which is more durable than
the original per-key `localStorage` approach and is resilient to normal page
reloads and browser restarts. Existing `localStorage` lore is migrated the
first time the updated app opens.

Use **ADMIN → EXPORT JSON** after an important session to keep a portable
backup. **IMPORT JSON** restores one of those backups on a new device. The
checked-in `BABYLON_ARCHIVE` in `data.js` is the canonical deployment ledger;
add forwarded email reports there before the next GitHub Pages deployment so
they become the shared baseline for everybody.

## Photo album

Put shared JPEGs or PNGs in [`photos/`](photos/README.md) and add their filenames to
`BABYLON_PHOTOS` in `data.js`; those images ship with the site and are visible
to everyone after deployment. **PHOTO ALBUM** also supports browser-local JPEG
uploads (up to 200 images, 12 MB each), which are not included in JSON archive
exports.

The exact review and publication procedure is in
[HQ_REVIEW_WORKFLOW.md](HQ_REVIEW_WORKFLOW.md).

## Change requests by email

Anyone can use **REQUEST A CHANGE** beneath Active Assets, the request action in an individual person profile, or **REQUEST A STOCK CHANGE** in the Trip Stock Exchange. The short form emails a proposed person-stat or share-price change—with supporting evidence—to Babylon HQ. It deliberately does **not** update the shared ledger automatically, so a reviewer can verify the request before adding it to `data.js` and deploying.

## Email delivery

Every visitor who logs an event, quote, or change request triggers an email to `rogee.oc@gmail.com`. This works from any deployed HTTP(S) site—there is no localhost restriction in the app. The email is a field report/notification, not a direct database write; forward it here and it can be verified and committed into the canonical ledger.

The site must be served by a web server. Opening `index.html` directly as a `file://` URL prevents the email provider from accepting submissions. For local preview only:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). For production, deploy these static files to any host (such as GitHub Pages, Netlify, or Vercel). The recipient needs to activate the FormSubmit email link once; after that, logs from all visitors are emailed automatically.

## Data handling

The access phrase is a social gate, not security. Submitted field reports are
sent to Babylon HQ through the configured email service, and browser archives
remain on the visitor's device until they are exported or HQ publishes verified
entries. Do not submit sensitive personal information.
