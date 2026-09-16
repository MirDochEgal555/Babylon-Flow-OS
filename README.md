# Babylon-Flow-OS

## Email delivery

Every visitor who logs an event or quote triggers an email to `rogee.oc@gmail.com`. This works from any deployed HTTP(S) site—there is no localhost restriction in the app.

The site must be served by a web server. Opening `index.html` directly as a `file://` URL prevents the email provider from accepting submissions. For local preview only:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). For production, deploy these static files to any host (such as GitHub Pages, Netlify, or Vercel). The recipient needs to activate the FormSubmit email link once; after that, logs from all visitors are emailed automatically.
