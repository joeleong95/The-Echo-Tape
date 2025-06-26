// Service worker for The Echo Tape
const CACHE_PREFIX = 'echo-tape-';
let CACHE_NAME = 'echo-tape-dev';

async function getBuildNumber() {
  try {
    const text = await fetch('CHANGELOG.md', {cache: 'no-store'}).then(r => r.text());
    const match = text.match(/\[(\d+\.\d+\.\d+\.\d+)\]/);
    return match ? match[1] : 'dev';
  } catch (err) {
    return 'dev';
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const build = await getBuildNumber();
    CACHE_NAME = CACHE_PREFIX + build;
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      '/',
      'index.html',
      'style.css',
      'script.js',
      'state.js',
      'audio.js',
      'ui.js',
      'episodes/episode0.js',
      'episodes/episode0.json',
      'episodes/episode1.js',
      'episodes/episode1.json',
      'audio/click.ogg',
      'audio/static.ogg',
      'audio/tape_fx.ogg',
      'audio/titleMusic.ogg',
      'audio/titleMusic2.ogg',
      'images/joeNewtTape.png',
      'images/joeNewtTape2.png',
      'images/joeNewtTape3.png',
      'images/joeNewtTape4.png'
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const build = await getBuildNumber();
    CACHE_NAME = CACHE_PREFIX + build;
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
