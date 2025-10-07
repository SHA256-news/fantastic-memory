# SHA256 News

A single-page React site styled with Tailwind CSS that highlights the latest Bitcoin mining headlines. Built with Vite so it can be deployed easily to GitHub Pages.

## Getting started

```bash
npm install
npm run dev
```

The site will be available at [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
```

The static assets will be generated in the `dist/` folder and can be published to GitHub Pages. The app fetches headline data from `public/api/sha256news-tweets.json`, so make sure that file is deployed with the build output.
