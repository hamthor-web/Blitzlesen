/* Blitzlesen: lokale Offline-Version für GitHub Pages, auch unter Unterpfaden. */
const CACHE_NAME = 'blitzlesen-offline-v2';
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  new URL('index.html', BASE).href,
  new URL('manifest.webmanifest', BASE).href,
  new URL('icons/icon-192.png', BASE).href,
  new URL('icons/icon-512.png', BASE).href,
  new URL('icons/icon-maskable-512.png', BASE).href
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('blitzlesen-offline-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(BASE)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(new URL('index.html', BASE).href,copy)).catch(()=>{});
      }
      return response;
    }).catch(async () => (await caches.match(new URL('index.html', BASE).href)) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
