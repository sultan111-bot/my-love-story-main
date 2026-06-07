const CACHE_NAME = 'love-story-v3';
const RUNTIME_CACHE = 'love-story-runtime-v3';

// Assets yang harus di-cache saat install
const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install - cache semua assets
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching essential assets');
        return cache.addAll(ESSENTIAL_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Cache everything untuk offline access
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // ⭐ CACHE FIRST - ambil dari cache dulu, baru fetch ke network
  event.respondWith(
    caches.match(request).then(cached => {
      // Kalau ada di cache, return cached (INSTANT!)
      if (cached) {
        // Background fetch untuk update cache
        fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
        }).catch(() => {});
        
        return cached; // Return cached immediately (CEPAT!)
      }

      // Kalau tidak ada di cache, fetch dari network
      return fetch(request)
        .then(response => {
          // Cache response yang berhasil
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline - return cached atau error page
          return caches.match(request).then(cached => {
            return cached || new Response(
              `<h1>📴 Offline</h1><p>Tidak ada koneksi internet</p>`,
              { 
                status: 503,
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
        });
    })
  );
});

// Handle push notifications (untuk update)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});