const CACHE_NAME = 'vitaminm-mp3-v3';
const STATIC_CACHE = 'vitaminm-static-v3';

const STATIC_ASSETS = [
  './',
  './index.html',
  './title.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (![CACHE_NAME, STATIC_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // MP3は再生時にキャッシュ
  if (req.url.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(req);
        if (cached) return cached;

        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // その他は通常キャッシュ優先
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
