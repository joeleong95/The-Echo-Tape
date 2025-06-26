'use strict';

import * as AudioModule from './audio.mjs';

let glitchInterval = null;

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

function setupAudio(scene) {
    const playBtn = scene.querySelector('.case-play-audio');
    const transcript = scene.querySelector('.case-audio-transcript');
    if (!playBtn) return;
    playBtn.addEventListener('click', () => {
        AudioModule.playTapeFx();
        if (transcript) transcript.style.display = 'block';
    });
}

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

function stopGlitch() {
    if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
    }
}

function init(scene) {
    if (!scene || scene.dataset.caseFileInit) return;
    scene.dataset.caseFileInit = 'true';
    setupTabs(scene);
    setupAudio(scene);
    setupVhs(scene);
    startGlitch(scene);
}

export { init, stopGlitch };
