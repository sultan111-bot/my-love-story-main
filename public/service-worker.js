const CACHE_NAME = 'love-story-v1';
const RUNTIME_CACHE = 'love-story-runtime-v1';

// Install event
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event - Network First strategy
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

  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached response jika offline
        return caches.match(request).then(cached => {
          return cached || new Response('Offline', { status: 503 });
        });
      })
  );
});