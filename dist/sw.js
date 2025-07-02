// Service worker for The Echo Tape
const CACHE_PREFIX = 'echo-tape-';
const CACHE_NAME = 'echo-tape-1.0.2-2b3a2205';
const RUNTIME_CACHE = `${CACHE_NAME}-runtime`;

const ASSETS = [
  // ASSETS_START
      '/',
      'index.html',
      'style.css',
      'src/script.mjs',
      'src/state.mjs',
      'src/audio.mjs',
      'src/ui.mjs',
      'src/sceneNavigation.mjs',
      'src/dompurify.mjs',
      'episodes/episode0.json',
      'episodes/episode1.json',
      'episodes/episode2.json',
      'dist/episodes/episode0.js',
      'dist/episodes/episode1.js',
      'dist/episodes/episode2.js',
      'dist/episodes/manifest.json',
      'dist/episodes/manifest.js',
      'audio/click.ogg',
      'audio/introEP1.ogg',
      'audio/static.ogg',
      'audio/tape_fx.ogg',
      'audio/titleMusic.ogg',
      'audio/titleMusic2.ogg',
      'audio/voice1.ogg',
      'audio/voice2.ogg',
      'images/joeNewtTape.jpg',
      'images/joeNewtTape2.jpg',
      'images/joeNewtTape3.jpg',
      'images/joeNewtTape4.jpg',
      // ASSETS_END
].map(p => self.location.origin + (p.startsWith('/') ? p : '/' + p));
const ASSET_SET = new Set(ASSETS);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME && key !== RUNTIME_CACHE) {
        return caches.delete(key);
      }
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const url = event.request.url;
    const isAsset = ASSET_SET.has(url);
    const cacheName = isAsset ? CACHE_NAME : RUNTIME_CACHE;
    const cached = await caches.match(event.request);
    if (isAsset && cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.status === 200 && response.type === 'basic') {
        const cache = await caches.open(cacheName);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return cached;
    }
  })());
});
