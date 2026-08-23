import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { host: true },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      
      // Enables PWA behavior (service worker) during development
      devOptions: {
        enabled: true,
        type: 'module', // Uses ES modules for dev service worker
      },

      // Static assets to precache from your public/ folder
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'],

      // App metadata for "Add to Home Screen"
      manifest: {
        name: 'Academic Vault',
        short_name: 'AV',
        description: 'Application for all academic needs',
        theme_color: '#7B5E77',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});