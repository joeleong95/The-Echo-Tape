'use strict';

const sfxClick = document.getElementById('sfx-click');
const sfxStatic = document.getElementById('sfx-static');
const tapeFx = document.getElementById('tape-fx');
const titleMusic = document.getElementById('title-music');
const titleMusic2 = document.getElementById('title-music2');
const introMusic = document.getElementById('intro-music');

if (sfxStatic) sfxStatic.loop = true;
if (titleMusic) titleMusic.loop = true;
if (titleMusic2) titleMusic2.loop = true;
if (introMusic) introMusic.loop = true;

let audioCtx;
let musicMuted = false;
let sfxMuted = false;
let musicVolume = 1;
let sfxVolume = 1;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
}

function playAudioElement(el, volume, muted, onlyIfPaused = false) {
    if (!el || muted) return;
    if (!onlyIfPaused || el.paused) {
        el.volume = volume;
        el.currentTime = 0;
        const playPromise = el.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                document.addEventListener('click', () => el.play(), { once: true });
            });
        }
    }
}

function playVhsSound() {
    playAudioElement(sfxStatic, musicVolume, musicMuted, true);
}

function playSceneSound() {
    playAudioElement(sfxStatic, musicVolume, musicMuted, true);
}

function playClickSound() {
    if (sfxClick && !sfxMuted) {
        sfxClick.volume = sfxVolume;
        sfxClick.currentTime = 0;
        sfxClick.play();
    }
}

function playTapeFx() {
    if (tapeFx && !sfxMuted) {
        tapeFx.volume = sfxVolume;
        tapeFx.currentTime = 0;
        tapeFx.play();
    }
}

function stopVhsSound() {
    if (sfxStatic && !sfxStatic.paused) {
        sfxStatic.pause();
        sfxStatic.currentTime = 0;
    }
}

function fadeInAudio(el, duration, targetVol = 1) {
    if (!el) return;
    const start = performance.now();
    el.volume = 0;
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        let volume;
        if (progress < 0.5) {
            volume = progress * 1.2;
        } else {
            volume = 0.6 + (progress - 0.5) * 0.8;
        }
        el.volume = Math.min(volume, 1) * targetVol;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function playTitleMusic() {
    playAudioElement(titleMusic, musicVolume, musicMuted);
    if (titleMusic && !musicMuted) {
        fadeInAudio(titleMusic, 3000, musicVolume);
    }
}

function stopTitleMusic() {
    if (titleMusic && !titleMusic.paused) {
        titleMusic.pause();
        titleMusic.currentTime = 0;
    }
}

function playTitleMusic2() {
    playAudioElement(titleMusic2, musicVolume, musicMuted);
    if (titleMusic2 && !musicMuted) {
        fadeInAudio(titleMusic2, 3000, musicVolume);
    }
}

function stopTitleMusic2() {
    if (titleMusic2 && !titleMusic2.paused) {
        titleMusic2.pause();
        titleMusic2.currentTime = 0;
    }
}

function playIntroMusic() {
    playAudioElement(introMusic, musicVolume, musicMuted);
    if (introMusic && !musicMuted) {
        fadeInAudio(introMusic, 1000, musicVolume);
    }
}

function stopIntroMusic() {
    if (introMusic && !introMusic.paused) {
        introMusic.pause();
        introMusic.currentTime = 0;
    }
}

function applyAudioPrefs() {
    const muteMusicBtn = document.getElementById('mute-music-btn');
    const muteSfxBtn = document.getElementById('mute-sfx-btn');
    const musicVolSlider = document.getElementById('music-volume');
    const sfxVolSlider = document.getElementById('sfx-volume');
    if (muteMusicBtn) muteMusicBtn.textContent = musicMuted ? 'Unmute Music' : 'Mute Music';
    if (muteSfxBtn) muteSfxBtn.textContent = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
    if (musicVolSlider) musicVolSlider.value = musicVolume;
    if (sfxVolSlider) sfxVolSlider.value = sfxVolume;
    if (titleMusic) {
        titleMusic.muted = musicMuted;
        titleMusic.volume = musicVolume;
    }
    if (titleMusic2) {
        titleMusic2.muted = musicMuted;
        titleMusic2.volume = musicVolume;
    }
    if (introMusic) {
        introMusic.muted = musicMuted;
        introMusic.volume = musicVolume;
    }
    if (sfxStatic) {
        sfxStatic.muted = musicMuted;
        sfxStatic.volume = musicVolume;
    }
    if (sfxClick) {
        sfxClick.muted = sfxMuted;
        sfxClick.volume = sfxVolume;
    }
    if (tapeFx) {
        tapeFx.volume = sfxVolume;
    }
}

function setMusicMuted(val) {
    musicMuted = val;
    applyAudioPrefs();
}

function setSfxMuted(val) {
    sfxMuted = val;
    applyAudioPrefs();
}

function setMusicVolume(val) {
    musicVolume = val;
    applyAudioPrefs();
}

function setSfxVolume(val) {
    sfxVolume = val;
    applyAudioPrefs();
}

function getMusicMuted() { return musicMuted; }
function getSfxMuted() { return sfxMuted; }
function getMusicVolume() { return musicVolume; }
function getSfxVolume() { return sfxVolume; }

export {
    initAudio,
    playVhsSound,
    playSceneSound,
    playClickSound,
    playTapeFx,
    stopVhsSound,
    playTitleMusic,
    stopTitleMusic,
    playTitleMusic2,
    stopTitleMusic2,
    playIntroMusic,
    stopIntroMusic,
    applyAudioPrefs,
    setMusicMuted,
    setSfxMuted,
    setMusicVolume,
    setSfxVolume,
    getMusicMuted,
    getSfxMuted,
    getMusicVolume,
    getSfxVolume
};
