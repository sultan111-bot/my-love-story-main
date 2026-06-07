const CACHE_NAME = 'love-story-v5';
const RUNTIME_CACHE = 'love-story-runtime-v5';
const IMAGE_CACHE = 'love-story-images-v5';

const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching essential assets');
        return cache.addAll(ESSENTIAL_ASSETS).catch(() => {
          console.log('[SW] Some assets failed to cache (non-critical)');
        });
      })
      .then(() => {
        console.log('[SW] Install complete');
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== IMAGE_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') {
    return;
  }

  // ⭐ CACHE EXTERNAL IMAGES (Cloudinary, etc)
  if (url.hostname === 'res.cloudinary.com' || url.hostname.includes('cloudinary')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const cloned = response.clone();
              caches.open(IMAGE_CACHE).then(cache => {
                cache.put(request, cloned);
              });
            }
            return response;
          })
          .catch(() => {
            // Return placeholder image when offline
            return new Response(
              `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#999" font-size="14">
                  📴 Offline
                </text>
              </svg>`,
              {
                headers: { 'Content-Type': 'image/svg+xml' }
              }
            );
          });
      })
    );
    return;
  }

  // ⭐ CACHE INTERNAL ASSETS
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          fetch(request)
            .then(response => {
              if (response && response.status === 200) {
                const cloned = response.clone();
                caches.open(RUNTIME_CACHE).then(c => c.put(request, cloned));
              }
            })
            .catch(() => {});
          
          return cached;
        }

        return fetch(request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            const cloned = response.clone();
            caches.open(RUNTIME_CACHE).then(c => c.put(request, cloned));
            return response;
          })
          .catch(() => {
            return new Response(
              JSON.stringify({ error: 'Offline' }),
              { 
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
      })
    );
    return;
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});