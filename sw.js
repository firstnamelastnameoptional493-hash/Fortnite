const CACHE_NAME = 'fortnite-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/Fortnite',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())
    ))
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      // Optionally cache runtime requests
      try {
        const cloned = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
      } catch (e) {}
      return resp;
    })).catch(() => caches.match('/index.html'))
  );
});
