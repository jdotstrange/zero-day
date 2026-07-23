import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // Use root-relative paths so JS/CSS load correctly on deep routes after refresh.
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'zero-day-spa-fallback',
      closeBundle() {
        const indexHtmlPath = path.resolve(__dirname, 'dist/index.html')
        const notFoundHtmlPath = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(indexHtmlPath)) {
          fs.copyFileSync(indexHtmlPath, notFoundHtmlPath)
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
  },
  preview: {
    // Match production SPA behavior when testing `npm run preview`.
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
