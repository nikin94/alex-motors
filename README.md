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
yarn build    # type-check + production build to dist/
yarn preview  # serve the production build locally
```

## Deployment

Static build (`dist/`), intended for Cloudflare Pages:

- Build command: `yarn build`
- Output directory: `dist`
