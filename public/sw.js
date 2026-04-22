/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE.BEAST.INFRA
TAG: CORE.BEAST.SERVICE_WORKER
DESCRIPTION: Service worker for BEAST AI Academy offline support

5WH:
  WHAT = sw.js — Service worker
  WHY = Provides offline caching and faster load times for the academy
  WHO = Leeway Innovations
  WHERE = public/sw.js
  WHEN = 2026-04-21
  HOW = Standard ServiceWorker API with cache-first strategy

AGENTS: WARD
LICENSE: MIT
*/

const CACHE_NAME = 'beast-ai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
