const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

async function runTests() {
  const swPath = path.join(__dirname, '..', 'dist', 'sw.js');
  const code = fs.readFileSync(swPath, 'utf8');

  const events = {};
  const ctx = {
    self: {
      location: { origin: 'https://example.com' },
      addEventListener(type, fn) { events[type] = fn; },
      skipWaiting() {},
      clients: { claim() {} }
    },
    caches: {
      cached: 'cached-response',
      async match() { return this.cached; },
      async open() { return { put() {} }; },
      async keys() { return []; }
    },
    fetch: null,
    console
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);

  assert.ok(typeof events.fetch === 'function');

  // Successful network response should be returned and cached
  let putCalled = false;
  ctx.fetch = async () => ({ status: 200, type: 'basic', clone() { return this; } });
  ctx.caches.open = async () => ({ put() { putCalled = true; } });
  ctx.caches.match = async () => null;
  let p;
  events.fetch({ request: { method: 'GET' }, respondWith(pr) { p = pr; } });
  const resp1 = await p;
  assert.strictEqual(resp1.status, 200);
  assert.ok(putCalled);

  // Network failure should fall back to cached response
  ctx.fetch = async () => { throw new Error('fail'); };
  ctx.caches.match = async () => 'cached-response';
  putCalled = false;
  events.fetch({ request: { method: 'GET' }, respondWith(pr) { p = pr; } });
  const resp2 = await p;
  assert.strictEqual(resp2, 'cached-response');
}

runTests();
