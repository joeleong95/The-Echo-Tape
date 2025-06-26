const assert = require('assert');

function createStubStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: key => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: key => { delete store[key]; },
    store
  };
}

function createAudioElement() {
  return {
    loop: false,
    paused: true,
    currentTime: 0,
    volume: 1,
    muted: false,
    playCalls: 0,
    pauseCalls: 0,
    play() { this.paused = false; this.playCalls++; return { catch(){} }; },
    pause() { this.paused = true; this.pauseCalls++; }
  };
}

function setupDOM() {
  const elements = {
    'sfx-click': createAudioElement(),
    'sfx-static': createAudioElement(),
    'tape-fx': createAudioElement(),
    'title-music': createAudioElement(),
    'title-music2': createAudioElement(),
    'mute-music-btn': { textContent: '' },
    'mute-sfx-btn': { textContent: '' },
    'music-volume': { value: 1 },
    'sfx-volume': { value: 1 }
  };
  global.document = {
    getElementById: id => elements[id] || null,
    addEventListener: () => {}
  };
  return elements;
}

function runTests() {
  const storage = createStubStorage();
  global.window = {};
  global.localStorage = storage;
  global.DOMException = global.DOMException || class extends Error {};
  const elements = setupDOM();
  global.requestAnimationFrame = fn => fn(0);
  global.performance = { now: () => 0 };

  require('../state.js');
  require('../audio.js');

  const State = global.window.StateModule;
  const Audio = global.window.AudioModule;

  // State module tests
  State.loadState();
  assert.strictEqual(State.getState('hasTape'), false);
  State.setState('hasTape', true);
  assert.strictEqual(State.getState('hasTape'), true);
  assert.deepStrictEqual(JSON.parse(storage.store.echoTapeState), {
    awareOfLoop: false,
    hasTape: true,
    musicMuted: false,
    sfxMuted: false,
    musicVolume: 1,
    sfxVolume: 1
  });

  State.setProgress('1', 'start');
  assert.deepStrictEqual(State.getProgress(), { episode: '1', scene: 'start' });
  State.clearProgress();
  assert.deepStrictEqual(State.getProgress(), { episode: null, scene: null });

  // Audio module tests
  Audio.setMusicVolume(0.5);
  assert.strictEqual(elements['title-music'].volume, 0.5);
  Audio.setSfxVolume(0.3);
  assert.strictEqual(elements['sfx-click'].volume, 0.3);
  Audio.setMusicMuted(true);
  assert.strictEqual(elements['title-music'].muted, true);
  Audio.setSfxMuted(true);
  assert.strictEqual(elements['sfx-click'].muted, true);
  Audio.setSfxMuted(false);
  elements['sfx-click'].paused = true;
  Audio.playClickSound();
  assert.strictEqual(elements['sfx-click'].playCalls, 1);
  elements['sfx-static'].paused = false;
  elements['sfx-static'].currentTime = 5;
  Audio.stopVhsSound();
  assert.strictEqual(elements['sfx-static'].paused, true);
  assert.strictEqual(elements['sfx-static'].currentTime, 0);
}

runTests();

