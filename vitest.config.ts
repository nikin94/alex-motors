import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    /* 'cloudflare:email' exists only inside the Workers runtime; unit tests
       run under Node, so the import resolves to a stub that just captures
       the constructor arguments for assertions. */
    alias: {
      'cloudflare:email': fileURLToPath(new URL('./tests/stubs/cloudflare-email.ts', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
  },
})
