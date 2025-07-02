'use strict';

/**
 * Handles playback of music and sound effects for the game.
 * @module audio
 */

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
let voiceVolume = 1;
let currentMusic = null;

/**
 * Ensure an AudioContext exists and resume it if suspended.
 * @returns {void}
 */
function initAudio() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(err => {
                console.error('Failed to resume audio context:', err);
            });
        }
    } catch (err) {
        console.error('Error initializing audio context:', err);
    }
}

/**
 * Play an HTMLAudioElement with volume and mute handling.
 * @param {HTMLMediaElement|null} el - Element to play.
 * @param {number} volume - Target volume 0-1.
 * @param {boolean} muted - Whether playback is muted.
 * @param {boolean} [onlyIfPaused=false] - Only play if the element is paused.
 * @returns {void}
 */
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

/**
 * Play the looping static sound used for scene transitions.
 * @returns {void}
 */
function playVhsSound() {
    playAudioElement(sfxStatic, sfxVolume, sfxMuted, true);
}

/**
 * Play static when entering a scene.
 * @returns {void}
 */
function playSceneSound() {
    playAudioElement(sfxStatic, sfxVolume, sfxMuted, true);
}

/**
 * Play the UI button click sound effect.
 * @returns {void}
 */
function playClickSound() {
    if (sfxClick && !sfxMuted) {
        sfxClick.volume = sfxVolume;
        sfxClick.currentTime = 0;
        sfxClick.play();
    }
}

/**
 * Play the short tape insert/remove effect.
 * @returns {void}
 */
function playTapeFx() {
    if (tapeFx && !sfxMuted) {
        tapeFx.volume = sfxVolume;
        tapeFx.currentTime = 0;
        tapeFx.play();
    }
}

/**
 * Play a voiceover clip with the current voice volume.
 * @param {string|HTMLMediaElement} clip
 * @returns {void}
 */
function playVoiceClip(clip) {
    const el = typeof clip === 'string' ? document.getElementById(clip) : clip;
    playAudioElement(el, voiceVolume, false);
}

/**
 * Stop the static loop.
 * @returns {void}
 */
function stopVhsSound() {
    if (sfxStatic && !sfxStatic.paused) {
        sfxStatic.pause();
        sfxStatic.currentTime = 0;
    }
}

/**
 * Gradually increase volume of an element over a duration.
 * @param {HTMLMediaElement} el
 * @param {number} duration - Fade time in ms.
 * @param {number} [targetVol=1] - Final volume multiplier.
 * @returns {void}
 */
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

function fadeOutAudio(el, duration, onDone) {
    if (!el) { if (onDone) onDone(); return; }
    const startVol = el.volume;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.volume = startVol * (1 - progress);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.pause();
            el.currentTime = 0;
            if (onDone) onDone();
        }
    }
    requestAnimationFrame(step);
}

function crossFadeTo(newEl, duration, targetVol = musicVolume) {
    if (musicMuted) {
        if (currentMusic && currentMusic !== newEl && !currentMusic.paused) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }
        currentMusic = newEl;
        return;
    }
    if (currentMusic && currentMusic !== newEl && !currentMusic.paused) {
        fadeOutAudio(currentMusic, duration);
    }
    playAudioElement(newEl, targetVol, false);
    if (newEl) {
        newEl.volume = 0;
        fadeInAudio(newEl, duration, targetVol);
    }
    currentMusic = newEl;
}

function preloadAllAudio() {
    document.querySelectorAll("audio").forEach(el => {
        if (el.preload !== "auto") el.preload = "auto";
        if (el.readyState === 0) el.load();
    });
}

/**
 * Play the main title music with a fade in.
 * @returns {void}
 */
function playTitleMusic() {
    crossFadeTo(titleMusic, 3000, musicVolume);
}

/**
 * Stop the title music if playing.
 * @returns {void}
 */
function stopTitleMusic() {
    if (titleMusic && !titleMusic.paused) {
        fadeOutAudio(titleMusic, 1000);
        if (currentMusic === titleMusic) currentMusic = null;
    }
}

/**
 * Play the second title track used on the episode screen.
 * @returns {void}
 */
function playTitleMusic2() {
    crossFadeTo(titleMusic2, 3000, musicVolume);
}

/**
 * Stop the second title track.
 * @returns {void}
 */
function stopTitleMusic2() {
    if (titleMusic2 && !titleMusic2.paused) {
        fadeOutAudio(titleMusic2, 1000);
        if (currentMusic === titleMusic2) currentMusic = null;
    }
}

/**
 * Play the introduction crawl music.
 * @returns {void}
 */
function playIntroMusic() {
    crossFadeTo(introMusic, 1000, musicVolume);
}

/**
 * Stop the intro music.
 * @returns {void}
 */
function stopIntroMusic() {
    if (introMusic && !introMusic.paused) {
        fadeOutAudio(introMusic, 1000);
        if (currentMusic === introMusic) currentMusic = null;
    }
}

/**
 * Update DOM elements to match current audio settings.
 * @returns {void}
 */
function applyAudioPrefs() {
    const muteMusicBtn = document.getElementById('mute-music-btn');
    const muteSfxBtn = document.getElementById('mute-sfx-btn');
    const musicVolSlider = document.getElementById('music-volume');
    const sfxVolSlider = document.getElementById('sfx-volume');
    const voiceVolSlider = document.getElementById('voice-volume');
    if (muteMusicBtn) muteMusicBtn.textContent = musicMuted ? 'Unmute Music' : 'Mute Music';
    if (muteSfxBtn) muteSfxBtn.textContent = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
    if (musicVolSlider) musicVolSlider.value = musicVolume;
    if (sfxVolSlider) sfxVolSlider.value = sfxVolume;
    if (voiceVolSlider) voiceVolSlider.value = voiceVolume;
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
        sfxStatic.muted = sfxMuted;
        sfxStatic.volume = sfxVolume;
    }
    if (sfxClick) {
        sfxClick.muted = sfxMuted;
        sfxClick.volume = sfxVolume;
    }
    if (tapeFx) {
        tapeFx.volume = sfxVolume;
    }
    document.querySelectorAll('.voice-audio').forEach(el => {
        el.volume = voiceVolume;
    });
}

/**
 * Toggle whether background music is muted.
 * @param {boolean} val
 * @returns {void}
 */
function setMusicMuted(val) {
    musicMuted = val;
    applyAudioPrefs();
}

/**
 * Toggle whether sound effects are muted.
 * @param {boolean} val
 * @returns {void}
 */
function setSfxMuted(val) {
    sfxMuted = val;
    applyAudioPrefs();
}

/**
 * Set the background music volume.
 * @param {number} val - Volume from 0 to 1.
 * @returns {void}
 */
function setMusicVolume(val) {
    musicVolume = val;
    applyAudioPrefs();
}

/**
 * Set the sound effects volume.
 * @param {number} val - Volume from 0 to 1.
 * @returns {void}
 */
function setSfxVolume(val) {
    sfxVolume = val;
    applyAudioPrefs();
}

/**
 * Set the voiceover volume.
 * @param {number} val - Volume from 0 to 1.
 * @returns {void}
 */
function setVoiceVolume(val) {
    voiceVolume = val;
    applyAudioPrefs();
}

/** @returns {boolean} */
function getMusicMuted() { return musicMuted; }
/** @returns {boolean} */
function getSfxMuted() { return sfxMuted; }
/** @returns {number} */
function getMusicVolume() { return musicVolume; }
/** @returns {number} */
function getSfxVolume() { return sfxVolume; }
/** @returns {number} */
function getVoiceVolume() { return voiceVolume; }

export {
    initAudio,
    playVhsSound,
    playSceneSound,
    playClickSound,
    playTapeFx,
    playVoiceClip,
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
    setVoiceVolume,
    getMusicMuted,
    getSfxMuted,
    getMusicVolume,
    getSfxVolume,
    getVoiceVolume,
    preloadAllAudio
};
