'use strict';

/**
 * Logic for the in-game case file overlay.
 * @module caseFile
 */

import * as AudioModule from './audio.mjs';
import * as StateModule from './state.mjs';

let glitchInterval = null;

function applyShowIf(scene) {
    scene.querySelectorAll('[data-show-if]').forEach(el => {
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
            el.style.display = match ? '' : 'none';
        } catch (e) {
            console.error('Invalid data-show-if', e);
        }
    });
}

/**
 * Initialize tabbed navigation within the case file.
 * @param {HTMLElement} scene - The case file overlay element.
 * @returns {void}
 */
function setupTabs(scene) {
    const buttons = scene.querySelectorAll('.case-tab-button');
    const contents = scene.querySelectorAll('.case-tab-content');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');
            btn.classList.add('active');
            const target = scene.querySelector(btn.dataset.target);
            if (target) target.style.display = 'block';
        });
    });
    if (buttons[0]) buttons[0].click();
}

/**
 * Wire up playback buttons inside the case file.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function setupAudio(scene) {
    const buttons = scene.querySelectorAll('.case-play-audio');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            AudioModule.playTapeFx();
            const transcript = btn.nextElementSibling;
            if (transcript && transcript.classList.contains('case-audio-transcript')) {
                transcript.style.display = 'block';
            }
        });
    });
}

/**
 * Display hover effects for the mysterious VHS tape.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function setupVhs(scene) {
    const tape = scene.querySelector('.case-vhs');
    const status = scene.querySelector('.case-vhs-status');
    if (!tape || !status) return;
    tape.addEventListener('mouseenter', () => {
        status.textContent = '>> ENERGY SIGNATURE DETECTED...';
        status.classList.add('alert');
    });
    tape.addEventListener('mouseleave', () => {
        status.textContent = '>> Artifact is dormant. Hover to detect energy signature.';
        status.classList.remove('alert');
    });
}

/**
 * Begin text glitch effect for the case file header.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function startGlitch(scene) {
    const header = scene.querySelector('.case-header');
    if (!header) return;
    const original = header.textContent;
    const chars = '!<>-_/[]{}—=+*^?#________';
    glitchInterval = setInterval(() => {
        let out = '';
        for (let i = 0; i < original.length; i++) {
            out += Math.random() > 0.85 ? chars[Math.floor(Math.random() * chars.length)] : original[i];
        }
        header.textContent = out;
    }, 100);
}

/**
 * Stop the glitch interval if running.
 * @returns {void}
 */
function stopGlitch() {
    if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
    }
}

/**
 * Initialize all case file behaviours for the given element.
 * @param {HTMLElement} scene
 * @returns {void}
 */
function init(scene) {
    if (!scene || scene.dataset.caseFileInit) return;
    scene.dataset.caseFileInit = 'true';
    applyShowIf(scene);
    setupTabs(scene);
    setupAudio(scene);
    setupVhs(scene);
    startGlitch(scene);
}

export { init, stopGlitch };
