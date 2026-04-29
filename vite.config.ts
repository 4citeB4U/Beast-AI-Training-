/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: CORE.BEAST.INFRA
TAG: CORE.BEAST.CONFIG.VITE
DESCRIPTION: Vite configuration for BEAST AI Academy

5WH:
  WHAT = vite.config.ts — Build tool configuration
  WHY = Orchestrates the React and Tailwind-Vite build pipeline
  WHO = Leeway Innovations
  WHERE = vite.config.ts
  WHEN = 2026-04-21
  HOW = Native Vite configuration with React and Tailwind plugins

AGENTS: GOVERNOR
LICENSE: MIT
*/

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '/Beast-AI-Training-/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'leeway-sdk': path.resolve(__dirname, 'LeeWay-Standards'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'motion'],
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('lucide')) return 'vendor-lucide';
              if (id.includes('motion')) return 'vendor-motion';
              if (id.includes('idb')) return 'vendor-idb';
              return 'vendor';
            }
            if (id.includes('LeeWay-Standards')) {
              return 'vendor-leeway-sdk';
            }
            if (id.includes('src/data')) {
              return 'vendor-data';
            }
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.

      watch: {
        usePolling: true, // Better for some file systems (like networked or older hardware)
        interval: 1000,
      },
      fs: {
        strict: false, // Allow serving files from the parent directory if needed
      }
    },
  };
});
