// Service worker for The Echo Tape
const CACHE_PREFIX = 'echo-tape-';
const CACHE_NAME = 'echo-tape-0.0.0.12';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      // ASSETS_START
      '/',
      'index.html',
      'style.css',
      'src/script.mjs',
      'src/state.mjs',
      'src/audio.mjs',
      'src/ui.mjs',
      'episodes/episode0.json',
      'episodes/episode1.json',
      'dist/episodes/episode0.js',
      'dist/episodes/episode1.js',
      'audio/click.ogg',
      'audio/static.ogg',
      'audio/tape_fx.ogg',
      'audio/titleMusic.ogg',
      'audio/titleMusic2.ogg',
      'images/joeNewtTape.png',
      'images/joeNewtTape2.png',
      'images/joeNewtTape3.png',
      'images/joeNewtTape4.png',
      // ASSETS_END
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
        return caches.delete(key);
      }
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.status === 200 && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (err) {
      return cached;
    }
  })());
});
