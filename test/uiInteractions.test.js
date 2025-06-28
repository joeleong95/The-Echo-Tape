const assert = require('assert');
const path = require('path');

function createDomElement(tag = 'div') {
  const el = {
    tagName: tag.toUpperCase(),
    style: { display: 'none' },
    textContent: '',
    innerHTML: '',
    dataset: {},
    children: [],
    classList: {
      classes: [],
      add(c) { if (!this.classes.includes(c)) this.classes.push(c); },
      remove(c) { this.classes = this.classes.filter(x => x !== c); },
      contains(c) { return this.classes.includes(c); }
    },
    appendChild(child) { child.parentNode = this; this.children.push(child); },
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; },
    querySelectorAll(selector) {
      const results = [];
      function walk(node) {
        for (const child of node.children) {
          if (selector.startsWith('.')) {
            const cls = selector.slice(1);
            if (child.classList && child.classList.contains(cls)) results.push(child);
          } else if (selector.startsWith('#')) {
            if (child.id === selector.slice(1)) results.push(child);
          } else if (child.tagName === selector.toUpperCase()) {
            results.push(child);
          }
          walk(child);
        }
      }
      walk(this);
      return results;
    },
    setAttribute(attr, val) { if (attr === 'id') this.id = val; else if (attr === 'class') this.className = val; else this[attr] = val; },
    addEventListener(type, handler) { if (type === 'transitionend') handler(); else this[`on${type}`] = handler; },
    removeEventListener() {},
    scrollIntoView() {},
    click() { if (this.onclick) this.onclick(); },
    focus() { this.focused = true; }
  };
  Object.defineProperty(el, 'className', {
    get() { return this.classList.classes.join(' '); },
    set(val) {
      this.classList.classes = [];
      val.split(/\s+/).forEach(c => { if (c) this.classList.add(c); });
    }
  });
  Object.defineProperty(el, 'id', {
    get() { return this._id || ''; },
    set(val) { this._id = val; }
  });
  return el;
}


async function runTests() {
  await new Promise(r => setTimeout(r, 20));
  const { pathToFileURL } = require('url');
  const CaseFile = await import(pathToFileURL(path.join(__dirname, '../src/caseFile.mjs')));



  const overlay = createDomElement('div');
  overlay.className = 'case-file';
  const tabs = createDomElement('div');
  tabs.className = 'case-tabs';
  const b1 = createDomElement('button');
  b1.className = 'choice-btn case-tab-button';
  b1.dataset.target = '#t1';
  const b2 = createDomElement('button');
  b2.className = 'choice-btn case-tab-button';
  b2.dataset.target = '#t2';
  tabs.appendChild(b1);
  tabs.appendChild(b2);
  overlay.appendChild(tabs);
  const t1 = createDomElement('div');
  t1.id = 't1';
  t1.className = 'case-tab-content';
  overlay.appendChild(t1);
  const t2 = createDomElement('div');
  t2.id = 't2';
  t2.className = 'case-tab-content';
  overlay.appendChild(t2);
  const playBtn = createDomElement('button');
  playBtn.className = 'case-play-audio';
  overlay.appendChild(playBtn);
  const transcript = createDomElement('span');
  transcript.className = 'case-audio-transcript';
  transcript.style.display = 'none';
  overlay.appendChild(transcript);
  playBtn.nextElementSibling = transcript;
  const vhs = createDomElement('div');
  vhs.className = 'case-vhs';
  overlay.appendChild(vhs);
  const status = createDomElement('p');
  status.className = 'case-vhs-status';
  overlay.appendChild(status);
  const header = createDomElement('h2');
  header.className = 'case-header';
  header.textContent = 'hdr';
  overlay.appendChild(header);

  const origSetInterval = global.setInterval;
  global.setInterval = () => 1;
  CaseFile.init(overlay);
  global.setInterval = origSetInterval;
  b2.click();
  assert.ok(b2.classList.contains('active'));
  assert.strictEqual(t2.style.display, 'block');
  assert.strictEqual(t1.style.display, 'none');
  playBtn.click();
  assert.strictEqual(transcript.style.display, 'block');

  // Navigation history overlay test
  const elements = {};
  const ids = ['history-overlay', 'history-list', 'close-history-btn',
               'back-btn', 'history-btn', 'case-file-btn', 'case-file-overlay',
               'close-case-file-btn', 'scene-announcer'];
  ids.forEach(id => { elements[id] = createDomElement(id === 'history-list' ? 'pre' : 'div'); });
  elements['close-history-btn'].tagName = 'BUTTON';
  elements['back-btn'].tagName = 'BUTTON';
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

  const scene1 = createDomElement('div');
  scene1.id = 's1';
  scene1.className = 'interactive-scene visible';
  const h1 = createDomElement('h2');
  h1.textContent = 'Intro';
  scene1.appendChild(h1);
  elements['s1'] = scene1;

  const scene2 = createDomElement('div');
  scene2.id = 's2';
  scene2.className = 'interactive-scene';
  const h2 = createDomElement('h2');
  h2.textContent = 'Second';
  scene2.appendChild(h2);
  elements['s2'] = scene2;

  const scene3 = createDomElement('div');
  scene3.id = 's3';
  scene3.className = 'interactive-scene';
  scene3.textContent = 'Third scene';
  elements['s3'] = scene3;

  global.requestAnimationFrame = fn => fn();

  const navUrl = pathToFileURL(path.join(__dirname, '../src/sceneNavigation.mjs')).toString() + `?v=${Date.now()}`;
  const Navigation = await import(navUrl);

  await Navigation.goToScene('s2');
  await Navigation.goToScene('s3');
  Navigation.showHistory();
  assert.strictEqual(elements['history-list'].textContent, 'Intro \u2192 Second');
}

runTests();
