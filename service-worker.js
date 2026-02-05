const CACHE_NAME = 'vitaminm-v20260205';

self.addEventListener('install', event => {
  self.skipWaiting(); // ← これが重要
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // ← 即反映
});
