// Puzzle Pieces PWA — Service Worker
// Caches the app shell only (this file, index.html, manifest, icons).
// Puzzle pictures come live from image.pollinations.ai (AI-generated) and
// are intentionally left uncached here — a new puzzle should always
// generate a fresh image.

const CACHE = 'jigsaw-puzzle-cache-v1';
const SHELL = ['/jigsaw-puzzle/', '/jigsaw-puzzle/index.html', '/jigsaw-puzzle/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only handle same-origin GET requests; let cross-origin (pollinations, fonts)
  // requests go straight to the network untouched.
  if (url.origin !== self.location.origin || e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
