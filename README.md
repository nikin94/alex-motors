# Alex Motors

One-page business-card website for the Alex Motors auto repair shop (Ireland).

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- Self-hosted [Bebas Neue](https://fontsource.org/fonts/bebas-neue) display font

## Development

```sh
npm install
npm run dev      # dev server with HMR
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

## Deployment

Static build (`dist/`), intended for Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
