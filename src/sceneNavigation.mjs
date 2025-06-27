'use strict';

/**
 * Scene navigation helpers and overlays.
 * @module sceneNavigation
 */

import * as StateModule from './state.mjs';
import * as AudioModule from './audio.mjs';
import * as CaseFileModule from './caseFile.mjs';
import DOMPurifyLib from 'dompurify';

const DOMPurify = typeof window !== 'undefined' && window.DOMPurify ? window.DOMPurify : DOMPurifyLib;

const backBtn = document.getElementById('back-btn');
const historyBtn = document.getElementById('history-btn');
const historyOverlay = document.getElementById('history-overlay');
const historyList = document.getElementById('history-list');
const closeHistoryBtn = document.getElementById('close-history-btn');
const caseFileBtn = document.getElementById('case-file-btn');
const caseFileOverlay = document.getElementById('case-file-overlay');
const closeCaseFileBtn = document.getElementById('close-case-file-btn');
const sceneAnnouncer = document.getElementById('scene-announcer');

let sceneHistory = [];
let currentEpisode = null;
let firstSceneId = null;

function setCurrentEpisode(ep) {
    currentEpisode = ep;
}

function setFirstSceneId(id) {
    firstSceneId = id;
}

function clearHistory() {
    sceneHistory = [];
}

/**
 * Display a scene element.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function showScene(scene) {
    scene.style.display = 'block';
    requestAnimationFrame(() => scene.classList.add('visible'));
}

/**
 * Fade out a scene and hide it.
 * @param {HTMLElement} scene
 * @returns {Promise<void>}
 */
function hideSceneElement(scene) {
    return new Promise(resolve => {
        scene.classList.remove('visible');
        scene.addEventListener('transitionend', function handler() {
            scene.style.display = 'none';
            scene.removeEventListener('transitionend', handler);
            resolve();
        }, { once: true });
    });
}

/**
 * Fetch and display an episode's scenes.
 * @param {string} ep
 * @param {string|null} resumeScene
 * @returns {Promise<void>}
 */
async function loadEpisode(ep, resumeScene) {
    const screen = document.getElementById('vhs-screen');
    if (!screen) return;
    let data;
    try {
        const resp = await fetch(`episodes/episode${ep}.json`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        data = await resp.json();
    } catch (err) {
        console.warn('Fetch failed, trying embedded episode data', err);
        if (window.localEpisodes && window.localEpisodes[`episode${ep}`]) {
            data = window.localEpisodes[`episode${ep}`];
        } else {
            console.error('Episode data not found');
            screen.innerHTML = '<div class="dialogue">Failed to load episode. ' +
                'Please check your connection and try again.</div>' +
                '<button id="retry-load-btn" class="choice-btn">Retry</button>';
            const retryBtn = document.getElementById('retry-load-btn');
            if (retryBtn) retryBtn.addEventListener('click', () => loadEpisode(ep, resumeScene));
            return;
        }
    }

    screen.innerHTML = '';
    const builtIds = [];
    data.scenes.forEach(scene => {
        if (scene.showIf) {
            let ok = true;
            for (const key in scene.showIf) {
                if (StateModule.getState(key) !== scene.showIf[key]) {
                    ok = false;
                    break;
                }
            }
            if (!ok) return;
        }
        const div = document.createElement('div');
        div.id = scene.id;
        div.className = 'interactive-scene';
        div.setAttribute('role', 'dialog');
        div.setAttribute('aria-label', scene.id);
        div.innerHTML = DOMPurify.sanitize(scene.html || '');
        div.querySelectorAll('[data-show-if]').forEach(el => {
            const condStr = el.getAttribute('data-show-if');
            if (!condStr) return;
            try {
                const cond = JSON.parse(condStr);
                let match = true;
                for (const key in cond) {
                    if (StateModule.getState(key) !== cond[key]) {
                        match = false;
                        break;
                    }
                }
                if (!match) el.remove();
            } catch (e) {
                console.error('Invalid data-show-if', e);
            }
        });
        screen.appendChild(div);
        builtIds.push(scene.id);
    });

    clearHistory();
    setFirstSceneId(data.start && builtIds.includes(data.start) ? data.start : builtIds[0]);
    let startId = firstSceneId;
    if (resumeScene && builtIds.includes(resumeScene)) {
        startId = resumeScene;
    }
    const progress = StateModule.getProgress();
    if (progress.episode === ep && progress.scene && builtIds.includes(progress.scene)) {
        startId = progress.scene;
    }
    if (startId) {
        await goToScene(startId);
    }
}

/**
 * Navigate to a new scene by id.
 * @param {string} sceneId
 * @param {boolean} [fromBack=false]
 * @returns {Promise<void>}
 */
async function goToScene(sceneId, fromBack = false) {
    const targetScene = document.getElementById(sceneId);
    if (!targetScene) return;
    const currentScene = document.querySelector('.interactive-scene.visible');
    if (currentScene && currentScene !== targetScene) {
        if (!fromBack) {
            sceneHistory.push(currentScene.id);
        }
        if (currentScene.id === 'scene-case-file') {
            CaseFileModule.stopGlitch();
        }
        await hideSceneElement(currentScene);
    }
    showScene(targetScene);
    if (sceneId === 'scene-case-file') {
        CaseFileModule.init(targetScene);
    }
    announceScene(targetScene);
    AudioModule.playSceneSound();
    updateBackButton();
    targetScene.scrollIntoView({ behavior: 'smooth' });
    focusFirstChoice(targetScene);
    StateModule.setProgress(currentEpisode, sceneId);
    if (sceneId === 'scene-tobecontinued') {
        StateModule.updateStateSummary();
    }
}

/**
 * Enable or disable the back button based on history.
 * @returns {void}
 */
function updateBackButton() {
    if (!backBtn) return;
    const currentScene = document.querySelector('.interactive-scene.visible');
    const atFirst = currentScene && currentScene.id === firstSceneId;
    if (atFirst) {
        backBtn.disabled = false;
        backBtn.textContent = 'Home';
        backBtn.setAttribute('aria-label', 'Return to title');
    } else {
        backBtn.textContent = '\u2190 Back';
        backBtn.setAttribute('aria-label', 'Go back');
        backBtn.disabled = sceneHistory.length === 0;
    }
}

/**
 * Toggle visibility of the continue button based on saved progress.
 * @returns {void}
 */
function updateContinueButton() {
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        const prog = StateModule.getProgress();
        continueBtn.style.display = prog.episode ? 'block' : 'none';
    }
}

/**
 * Navigate back to the previous scene in history.
 * @returns {void}
 */
function goBack() {
    if (sceneHistory.length === 0) return;
    const prev = sceneHistory.pop();
    goToScene(prev, true);
}

/**
 * Back button handler deciding between goBack and return to title.
 * @param {Function} returnToTitle
 * @returns {void}
 */
function handleBackBtn(returnToTitle) {
    const currentScene = document.querySelector('.interactive-scene.visible');
    const atFirst = currentScene && currentScene.id === firstSceneId;
    if (atFirst) {
        returnToTitle();
    } else {
        goBack();
    }
}

/**
 * Display the navigation history overlay.
 * @returns {void}
 */
function showHistory() {
    if (!historyOverlay) return;
    historyList.textContent = sceneHistory.join(' \u2192 ');
    historyOverlay.classList.add('visible');
    historyOverlay.setAttribute('aria-hidden', 'false');
    if (closeHistoryBtn) closeHistoryBtn.focus();
}

/**
 * Hide the navigation history overlay.
 * @returns {void}
 */
function closeHistory() {
    if (!historyOverlay) return;
    historyOverlay.classList.remove('visible');
    historyOverlay.setAttribute('aria-hidden', 'true');
    if (historyBtn) historyBtn.focus();
}

/**
 * Open the case file overlay.
 * @returns {void}
 */
function showCaseFile() {
    if (!caseFileOverlay) return;
    CaseFileModule.init(caseFileOverlay);
    caseFileOverlay.classList.add('visible');
    caseFileOverlay.setAttribute('aria-hidden', 'false');
    if (closeCaseFileBtn) closeCaseFileBtn.focus();
}

/**
 * Close the case file overlay.
 * @returns {void}
 */
function closeCaseFile() {
    if (!caseFileOverlay) return;
    CaseFileModule.stopGlitch();
    caseFileOverlay.classList.remove('visible');
    caseFileOverlay.setAttribute('aria-hidden', 'true');
    if (caseFileBtn) caseFileBtn.focus();
}

/**
 * Focus the first choice button in a scene for accessibility.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function focusFirstChoice(scene) {
    const first = scene.querySelector('.choice-btn');
    if (first) {
        first.focus();
    }
}

/**
 * Update off-screen announcer text for screen readers.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function announceScene(scene) {
    if (sceneAnnouncer) {
        sceneAnnouncer.textContent = scene.innerText || scene.textContent || '';
    }
}

/**
 * Handle arrow key navigation within choice buttons.
 * @param {KeyboardEvent} event
 * @returns {void}
 */
function handleKeydown(event) {
    if (historyOverlay && historyOverlay.classList.contains('visible')) return;
    const currentScene = document.querySelector('.interactive-scene.visible');
    if (!currentScene) return;
    const choices = Array.from(currentScene.querySelectorAll('.choice-btn'));
    if (choices.length === 0) return;
    let index = choices.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        index = (index + 1) % choices.length;
        choices[index].focus();
        event.preventDefault();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        index = (index - 1 + choices.length) % choices.length;
        choices[index].focus();
        event.preventDefault();
    } else if (/^[1-9]$/.test(event.key)) {
        const num = parseInt(event.key, 10) - 1;
        if (num >= 0 && num < choices.length) {
            choices[num].focus();
            choices[num].click();
        }
    }
}

export {
    loadEpisode,
    goToScene,
    updateBackButton,
    updateContinueButton,
    goBack,
    handleBackBtn,
    showHistory,
    closeHistory,
    showCaseFile,
    closeCaseFile,
    handleKeydown,
    setCurrentEpisode,
    clearHistory
};
