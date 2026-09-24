import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Using the generateSW strategy for simplicity and reliability
      injectRegister: 'auto',
      strategies: 'generateSW',
      registerType: 'prompt',
      includeAssets: ['vite.svg', 'icons/apple-touch-icon.png', 'icons/masked-icon.svg'],
      manifest: {
        name: 'SkillForge',
        short_name: 'SkillForge',
        description: 'Interactive learning platform for mastering in-demand skills',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.svg',
            sizes: '1920x1080',
            type: 'image/svg+xml',
            form_factor: 'wide',
            label: 'SkillForge Desktop View'
          },
          {
            src: '/screenshots/mobile.svg',
            sizes: '1080x1920',
            type: 'image/svg+xml',
            form_factor: 'narrow',
            label: 'SkillForge Mobile View'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        // Backend-owned OAuth navigation paths must reach the network: the
        // default NavigationRoute would otherwise serve cached index.html for
        // /auth/google/callback (the provider redirect target), so the
        // callback never reaches the backend in SW-controlled browsers and
        // the SPA falls through to "/". /auth/callback stays SPA-served.
        navigateFallbackDenylist: [/^\/auth\/google/],
        runtimeCaching: [
          // Add image caching strategy
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // CSS and JS assets
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Font files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Mirror the production nginx rewrite (/api/auth/* -> /auth/*) so the
        // canonical frontend-facing auth prefix resolves the same way in dev.
        rewrite: (path) => path.replace(/^\/api\/auth\//, '/auth/')
      },
      '/auth': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    cors: true
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
    sourcemap: process.env.NODE_ENV !== 'production', // Only generate sourcemaps in development
    reportCompressedSize: false, // Speed up build
    cssCodeSplit: true, // Split CSS into chunks
    rollupOptions: {
      output: {
        // Optimize chunk strategy
        manualChunks: (id) => {
          // Create separate chunks for large dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            return 'vendor'; // All other dependencies
          }
          
          // Split code by feature area
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
        },
        // Optimize chunk size
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize assets
    assetsInlineLimit: 4096, // 4kb - inline small assets
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Remove console logs in production
        drop_debugger: process.env.NODE_ENV === 'production'
      }
    },
  },
})
