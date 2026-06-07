# Tep Worlds — Community Portal

The community portal at **tep.one**, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

## Repository layout

```
.
├── astro.config.mjs         # Site config, brand, navigation
├── src/
│   ├── assets/              # Logo and images
│   ├── components/          # Reusable Astro components
│   ├── content/docs/        # Markdown/MDX pages
│   └── styles/custom.css    # Tep Worlds brand overrides
├── public/
│   └── data/                # Generated forum RSS data
└── .github/workflows/       # Build/deploy + RSS fetcher
```

## Adding or editing pages

Every page is a Markdown (`.md`) or MDX (`.mdx`) file under `src/content/docs/`. To add a new page:

1. Create a file in the appropriate subfolder.
2. Add a `title` to the frontmatter.
3. (Optional) Add it to the sidebar in `astro.config.mjs`.

To add a new world:

1. Create `src/content/docs/worlds/your-world/overview.md`
2. Add a sidebar entry in `astro.config.mjs`

That's it. Commit, push, and the site rebuilds automatically.

## Local development

```bash
npm install
npm run dev
# opens at http://localhost:4321
```

## Deployment

- Push to `main` triggers GitHub Actions to build and deploy
- The RSS feed is refreshed every 6 hours by a separate workflow
- The site is served from the `gh-pages` branch via GitHub Pages

## Custom domain

- `CNAME` file in the repo root points to `tep.one`
- DNS at Namecheap is configured to point `tep.one` to GitHub Pages IPs
- HTTPS is enabled in GitHub Pages settings
