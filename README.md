# Alex Motors

One-page business-card website for the Alex Motors auto repair shop (Ireland).

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- Self-hosted [Bebas Neue](https://fontsource.org/fonts/bebas-neue) display font

## Development

Requires Node 24 (`.nvmrc`) and [Yarn 4](https://yarnpkg.com/) (`corepack enable`).

```sh
yarn install
yarn dev      # dev server with HMR
yarn build     # type-check + production build to dist/
yarn preview   # build, then serve it with the Worker via wrangler dev
yarn lint      # oxlint
yarn test      # unit tests (Vitest)
yarn test:e2e  # Playwright smoke suite
```

## Deployment

Cloudflare Workers: static assets plus a small Worker (`worker/`) that handles
`/api/*` (the contact form). Configuration lives in `wrangler.jsonc`.

- **Automatic.** Every push to `main` is built and deployed by Cloudflare
  Workers Builds (Git integration set up in the Cloudflare dashboard). The
  build shows up on the commit as the `Workers Builds: alex-motors` check.
- **CI does not deploy.** GitHub Actions (`.github/workflows/ci.yml`) runs
  lint, unit tests, build and the Playwright smoke suite on PRs and on `main`.
- **Manual deploy** from a local checkout, if ever needed: `yarn deploy`
  (build + `wrangler deploy`, requires `wrangler login`).
