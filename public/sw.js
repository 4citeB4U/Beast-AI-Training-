const CACHE_NAME = 'beast-ai-v1';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'assets/setup.png',
  'assets/agent-engineer.png',
  'assets/advanced.png',
  'assets/cert.png',
  'assets/society.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
