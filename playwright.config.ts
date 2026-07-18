import { defineConfig } from '@playwright/test'

/* Browser smoke suite. The dev server (vite + the cloudflare plugin) serves
   both the SPA and the /api/contact Worker, so the form's pre-domain 503
   fallback is exercised for real. Port 5199 is this project's test port —
   never the 5173 the human's own `yarn dev` uses. */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:5199' },
  webServer: {
    command: 'yarn dev --port 5199 --strictPort',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
