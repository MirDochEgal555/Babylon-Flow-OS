# Babylon Flow photo uploads

Put shared JPEG or PNG photos in this folder, using simple lowercase names such
as `ibiza-001.jpg`, `javea-pool-02.jpeg`, or `pool-party.png`.

To show a photo in the published album, add it to `BABYLON_PHOTOS` in
`../data.js`:

```js
{ src: 'photos/ibiza-001.jpg', caption: 'Ibiza survival evidence', addedAt: '23 SEP 2026' }
```

Commit and deploy the JPEG and `data.js` together. The browser album's local
upload button is separate: those files stay only on the current device.
