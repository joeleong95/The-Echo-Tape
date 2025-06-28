const assert = require('assert');
const path = require('path');

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

const elements = {};

function createDomElement(tag = 'div') {
  const el = {
    tagName: tag.toUpperCase(),
    _id: '',
    _className: '',
    style: { display: 'none' },
    textContent: '',
    innerHTML: '',
    dataset: {},
    children: [],
    parentNode: null,
    classList: {
      classes: [],
      add(cls) { if (!this.classes.includes(cls)) this.classes.push(cls); },
      remove(cls) { this.classes = this.classes.filter(c => c !== cls); },
      contains(cls) { return this.classes.includes(cls); }
    },
    appendChild(child) { child.parentNode = this; this.children.push(child); },
    querySelector(selector) {
      if (selector === '.choice-btn') {
        return this.children.find(c => c.classList && c.classList.contains('choice-btn')) || null;
      }
      return null;
    },
    querySelectorAll() { return []; },
    setAttribute(attr, val) {
      if (attr === 'id') {
        this.id = val;
      } else if (attr === 'class') {
        this.className = val;
      } else {
        this[attr] = val;
      }
    },
    addEventListener(type, handler) {
      if (type === 'transitionend') handler();
    },
    removeEventListener() {},
    scrollIntoView() {},
    focus() { this.focused = true; }
  };
  Object.defineProperty(el, 'id', {
    get() { return this._id; },
    set(val) { this._id = val; elements[val] = this; }
  });
  Object.defineProperty(el, 'className', {
    get() { return this._className; },
    set(val) {
      this._className = val;
      this.classList.classes = [];
      val.split(/\s+/).forEach(c => { if (c) this.classList.add(c); });
    }
  });
  return el;
}

function setupDOM() {
  const ids = [
    'sfx-click', 'sfx-static', 'tape-fx',
    'title-music', 'title-music2',
    'mute-music-btn', 'mute-sfx-btn',
    'music-volume', 'sfx-volume',
    'back-btn', 'vhs-screen', 'scene-announcer'
  ];
  ids.forEach(id => { elements[id] = id.includes('music') || id.includes('sfx') || id === 'tape-fx' || id.startsWith('title-') ? createAudioElement() : createDomElement(id === 'music-volume' || id === 'sfx-volume' ? 'input' : 'div'); });
  elements['mute-music-btn'].textContent = '';
  elements['mute-sfx-btn'].textContent = '';
  elements['music-volume'].value = 1;
  elements['sfx-volume'].value = 1;
  elements['back-btn'].disabled = false;
  global.document = {
    getElementById: id => elements[id] || null,
    querySelector(selector) {
      if (selector === '.interactive-scene.visible') {
        return Object.values(elements).find(e => e.classList && e.classList.contains('interactive-scene') && e.classList.contains('visible')) || null;
      }
      return null;
    },
    querySelectorAll() { return []; },
    createElement: tag => createDomElement(tag),
    addEventListener: () => {}
  };
  return elements;
}

async function runTests() {
  const storage = createStubStorage();
  global.window = {};
  global.localStorage = storage;
  global.DOMException = global.DOMException || class extends Error {};
  global.DOMPurify = { sanitize: html => html.replace(/<script[^>]*>.*?<\/script>/gi, '') };
  global.window.DOMPurify = global.DOMPurify;
  setupDOM();
  global.requestAnimationFrame = fn => fn(0);
  global.performance = { now: () => 0 };

  const { pathToFileURL } = require('url');
  const State = await import(pathToFileURL(path.join(__dirname, '../src/state.mjs')));
  const Audio = await import(pathToFileURL(path.join(__dirname, '../src/audio.mjs')));

  // State module tests
  State.loadState();
  assert.strictEqual(State.getState('hasTape'), false);
  State.setState('hasTape', true);
  assert.strictEqual(State.getState('hasTape'), true);
  assert.deepStrictEqual(JSON.parse(storage.store.echoTapeState), {
    awareOfLoop: false,
    hasTape: true,
    reviewedCaseFile: false,
    trustBroken: false,
    visitedLarkhill: false,
    foundEvidence1: false,
    interviewedGranny: false,
    musicMuted: false,
    sfxMuted: false,
    musicVolume: 1,
    sfxVolume: 1
  });

  State.setProgress('1', 'start');
  const exported = State.exportSaveData();
  assert.deepStrictEqual(exported.progress, { episode: '1', scene: 'start' });
  assert.strictEqual(exported.state.hasTape, true);
  State.setState('hasTape', false);
  State.clearProgress();
  State.importSaveData(exported);
  assert.strictEqual(State.getState('hasTape'), true);
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

  // UI module tests
  const Ui = await import(pathToFileURL(path.join(__dirname, '../src/ui.mjs')));

  // Minimal scene elements after loading ui.js
  const screen = elements['vhs-screen'];
  const scene1 = document.createElement('div');
  scene1.id = 'scene1';
  scene1.classList.add('interactive-scene');
  const btn1 = document.createElement('button');
  btn1.classList.add('choice-btn');
  scene1.appendChild(btn1);
  screen.appendChild(scene1);

  const scene2 = document.createElement('div');
  scene2.id = 'scene2';
  scene2.classList.add('interactive-scene');
  const btn2 = document.createElement('button');
  btn2.classList.add('choice-btn');
  scene2.appendChild(btn2);
  screen.appendChild(scene2);

  global.fetch = () => Promise.reject(new Error('offline'));
  global.window.localEpisodes = {
    episode1: { start: 'scene1', scenes: [
      { id: 'scene1', html: '<button class="choice-btn" data-scene="scene2">Next</button><script>alert("x")</script>' },
      { id: 'scene2', html: '<p>End</p>' }
    ] }
  };

  await Ui.loadEpisode('1');
  assert.strictEqual(document.querySelector('.interactive-scene.visible').id, 'scene1');
  assert.ok(!document.getElementById('scene1').innerHTML.includes('<script>'));
  assert.strictEqual(elements['back-btn'].textContent, 'Home');

  await Ui.goToScene('scene2');
  assert.strictEqual(document.querySelector('.interactive-scene.visible').id, 'scene2');
  assert.strictEqual(elements['back-btn'].textContent, '\u2190 Back');
  assert.strictEqual(State.getProgress().scene, 'scene2');

  await Ui.goToScene('scene1', true);
  assert.strictEqual(document.querySelector('.interactive-scene.visible').id, 'scene1');
  assert.strictEqual(elements['back-btn'].textContent, 'Home');

  delete global.window.localEpisodes;
  await Ui.loadEpisode('99');
  const errHtml = document.getElementById('vhs-screen').innerHTML;
  assert.ok(/Failed to load episode/i.test(errHtml));
  assert.ok(errHtml.includes('retry-load-btn'));
}

runTests();

