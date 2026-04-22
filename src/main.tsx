/*
LEEWAY HEADER — DO NOT REMOVE

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

const boot = async () => {
  const splash = document.getElementById('splash-screen');
  
  try {
    // Activate Leeway SDK Runtime
    await agentLeeRuntimeBootstrap.initialize();
    
    // Slight delay for smoothness
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (splash) {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      document.body.style.overflow = 'auto';
    }
  } catch (error) {
    console.error('LEEWAY_BOOT_FAILURE: System integrity compromised.', error);
    const bootText = document.querySelector('.boot-text');
    if (bootText) {
      bootText.textContent = 'INTEGRITY_BREACH: SYSTEM_HALTED';
      bootText.style.color = '#ef4444';
    }
    return; // Don't render if core fails
  }
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

boot();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
