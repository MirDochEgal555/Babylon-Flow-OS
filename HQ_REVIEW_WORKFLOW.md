# Babylon HQ Review Workflow

Babylon Flow is an HQ-curated archive, not a live multi-device database.
Each visitor can keep local entries in their browser and send field reports to
Babylon HQ; the next deployment makes verified lore available to everyone.

## Review a field report

1. Read the emailed report and confirm the people, location, and claimed
   effect with the group when necessary.
2. Add verified events, quotes, or NPCs to the corresponding `BABYLON_*`
   collection in `data.js`.
3. For a person or market correction, update that person's `stats` or
   `stock` in `BABYLON_PEOPLE`.
4. Update `BABYLON_ARCHIVE.updatedAt` to the current UTC timestamp. For a ledger
   change that existing browsers must receive, increment `canonicalRevision` and
   add any person-stat deltas to `ledgerPatches` under that revision. Seeded
   events and canonical quotes are then merged into each browser’s local archive
   on its next page load without removing locally logged lore.
5. Run the local checks:

   ```sh
   node --check data.js
   node --check app.js
   git diff --check
   ```

6. Commit the verified ledger update to `main`. The existing GitHub Pages
   workflow publishes it automatically.

## Information handling

- The browser access phrase is a social gate, not real access control.
- Event, quote, NPC, and change-request text is sent to Babylon HQ by the
  configured email service. Do not submit personal, confidential, or sensitive
  information.
- Browser data is device-local until a person exports it or HQ adds a verified
  report to the canonical ledger.
