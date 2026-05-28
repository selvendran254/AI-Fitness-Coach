import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: { enabled: false },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'AI Fitness Coach',
        short_name: 'FitCoach',
        description: 'AI fitness coaching for diabetics & BP patients',
        theme_color: '#0f766e',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:3001\/api\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 10 },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ai-fitness-coach/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  // Use alias to shared/src (ESM). Pre-bundling the workspace CJS dist drops named exports like DEVICE_PROVIDERS.
  optimizeDeps: {
    exclude: ['@ai-fitness-coach/shared'],
  },
  server: {
    host: true, // listen on 0.0.0.0 — required for VM / remote browser
    port: 5173,
    strictPort: true, // fail loudly if 5173 busy (don't silently use 5174)
    open: true, // auto-open browser when possible
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});
