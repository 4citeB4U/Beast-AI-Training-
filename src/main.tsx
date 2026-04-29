/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.UNKNOWN
TAG: UI.BEAST.UNKNOWN

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=file

5WH:
WHAT = BEAST AI Component: main.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/main.tsx
WHEN = 2026-04-21
HOW = Autonomous Agent Engineering

AGENTS:
VECTOR
ARIA
WARD
GOVERNOR

LICENSE:
MIT
*/

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { agentLeeRuntimeBootstrap } from 'leeway-sdk/src/core/AgentLeeRuntimeBootstrap';

const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).then(() => {
      console.log('SW_READY: Beast AI Service Worker registered.');
    }).catch((error) => {
      console.error('SW_FAILURE: Service Worker registration failed.', error);
    });
  });
};

const boot = async () => {
  const root = document.getElementById('root');
  const splash = document.getElementById('splash-screen');
  
  if (!root) return;

  // 1. Initial Render (Immediate)
  const rootElement = createRoot(root);
  rootElement.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // 2. Visual Turbo-Handoff
  // Hide splash as soon as React has painted the first frame
  const hideSplash = () => {
    if (splash) {
      (splash as HTMLElement).style.opacity = '0';
      (splash as HTMLElement).style.visibility = 'hidden';
      document.body.style.overflow = 'auto';
    }
  };

  // Fail-safe: Hide splash screen after 3s regardless of paint
  const failSafe = setTimeout(hideSplash, 3000);

  requestAnimationFrame(() => {
    setTimeout(() => {
      clearTimeout(failSafe);
      hideSplash();
    }, 400); // Small delay to ensure App shell is visible
  });

  // 3. Background SDK Establishment (Non-blocking)
  const initializeSDK = async () => {
    try {
      // Set performance mode from persistence
      const saved = localStorage.getItem('beast_ai_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.preferences?.performanceMode) {
          agentLeeRuntimeBootstrap.setLiteMode(true);
        }
      }

      // Initialize Leeway SDK in the background
      await agentLeeRuntimeBootstrap.initialize();
      console.log('✅ LEEWAY_CORE: System integrity verified.');
    } catch (error) {
      console.warn('⚠️ LEEWAY_CORE: System degradation detected.', error);
    }
  };

  // Run SDK init without blocking the UI
  initializeSDK();
};

registerServiceWorker();
boot();
