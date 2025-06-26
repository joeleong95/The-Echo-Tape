'use strict';

const defaultState = {
    awareOfLoop: false,
    hasTape: false,
    musicMuted: false,
    sfxMuted: false,
    musicVolume: 1,
    sfxVolume: 1
};

let gameState = { ...defaultState };
let storageAvailable = true;

function tryLoad(key, fallbackObj) {
    if (!storageAvailable) {
        return { ...fallbackObj };
    }
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return { ...fallbackObj, ...JSON.parse(saved) };
            } catch (e) {
                console.error(`Failed to parse ${key}`, e);
            }
        }
    } catch (e) {
        if (e instanceof DOMException) {
            console.warn('localStorage unavailable; using in-memory data');
            storageAvailable = false;
        } else {
            throw e;
        }
    }
    return { ...fallbackObj };
}

function trySave(key, data) {
    if (!storageAvailable) {
        return;
    }
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        if (e instanceof DOMException) {
            console.warn(`Unable to save ${key} to localStorage`);
            storageAvailable = false;
        } else {
            throw e;
        }
    }
}

function loadState() {
    gameState = tryLoad('echoTapeState', defaultState);
}

function saveState() {
    trySave('echoTapeState', gameState);
}

function setState(key, value) {
    gameState[key] = value;
    saveState();
}

function getState(key) {
    return gameState[key];
}

function resetState() {
    gameState = { ...defaultState };
    saveState();
}

function updateStateSummary() {
    const summary = document.getElementById('state-summary');
    if (summary) {
        const awareText = gameState.awareOfLoop ? 'You know the loop is real.' : 'You remain unaware of the loop.';
        const itemText = gameState.hasTape ? 'The tape is in your possession.' : 'The tape is nowhere to be found.';
        summary.textContent = awareText + ' ' + itemText;
    }
}

const progressKey = 'echoTapeProgress';
let progress = { episode: null, scene: null };

function loadProgress() {
    progress = tryLoad(progressKey, { episode: null, scene: null });
}

function saveProgress() {
    trySave(progressKey, progress);
}

function setProgress(ep, scene) {
    progress.episode = ep;
    progress.scene = scene;
    saveProgress();
}

function clearProgress() {
    progress = { episode: null, scene: null };
    saveProgress();
}

function getProgress() {
    return progress;
}

export {
    loadState,
    saveState,
    setState,
    getState,
    resetState,
    updateStateSummary,
    loadProgress,
    saveProgress,
    setProgress,
    clearProgress,
    getProgress
};
