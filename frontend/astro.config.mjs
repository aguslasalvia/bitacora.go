// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Build output is static (React island included) and served by the Go
// backend as plain files — see internal/routes/routes.go.
export default defineConfig({
  outDir: '../web',
  build: {
    assets: '_astro',
  },
  integrations: [react()],
});
