/*
LEEWAY HEADER — DO NOT REMOVE

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
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
