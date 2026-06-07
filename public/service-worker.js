const CACHE_NAME = 'love-story-v6';
const RUNTIME_CACHE = 'love-story-runtime-v6';
const IMAGE_CACHE = 'love-story-images-v6';

const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/placeholder.svg',
];

const KEEP_CACHES = new Set([CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE]);

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response?.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return null;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response?.status === 200) {
        caches.open(cacheName).then((cache) => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const fresh = await network;
  if (fresh) return fresh;

  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    return (await caches.match('/index.html')) || (await caches.match('/'));
  }

  return new Response('Offline', { status: 503, statusText: 'Offline' });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ESSENTIAL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => !KEEP_CACHES.has(name)).map((name) => caches.delete(name)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.hostname === 'res.cloudinary.com' || url.hostname.includes('cloudinary')) {
    event.respondWith(
      cacheFirst(request, IMAGE_CACHE).then(
        (response) =>
          response ||
          new Response(
            `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="#f0f0f0"/>
              <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#999" font-size="14">📴 Offline</text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
          )
      )
    );
    return;
  }

  if (url.origin === location.origin) {
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
      return;
    }

    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
