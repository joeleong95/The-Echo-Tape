'use strict';

/**
 * Utilities for loading, saving and querying persistent game state.
 * @module state
 */

const defaultState = {
    awareOfLoop: false,
    hasTape: false,
    reviewedCaseFile: false,
    trustBroken: false,
    visitedLarkhill: false,
    foundEvidence1: false,
    interviewedGranny: false,
    musicMuted: false,
    sfxMuted: false,
    musicVolume: 1,
    sfxVolume: 1,
    endingChoice: null,
    loopAwareLevel: 0
};

let gameState = { ...defaultState };
let storageAvailable = true;

/**
 * Attempt to load an object from localStorage.
 * @param {string} key - Storage key.
 * @param {Object} fallbackObj - Default values if not found.
 * @returns {Object} Loaded data merged with the fallback.
 */

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

/**
 * Persist data to localStorage.
 * @param {string} key - Storage key.
 * @param {Object} data - Object to serialize and store.
 * @returns {void}
 */
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

/**
 * Load persistent state from storage.
 * @returns {void}
 */
function loadState() {
    gameState = tryLoad('echoTapeState', defaultState);
}

/**
 * Save current game state to storage.
 * @returns {void}
 */
function saveState() {
    trySave('echoTapeState', gameState);
}

/**
 * Update a key in the game state and persist the change.
 * @param {string} key
 * @param {*} value
 * @returns {void}
 */
function setState(key, value) {
    gameState[key] = value;
    saveState();
}

/**
 * Retrieve a value from the current game state.
 * @param {string} key
 * @returns {*}
 */
function getState(key) {
    return gameState[key];
}

/**
 * Reset the game state back to defaults.
 * @returns {void}
 */
function resetState() {
    gameState = { ...defaultState };
    saveState();
}

/**
 * Update the on-screen summary of key state values.
 * @returns {void}
 */
function updateStateSummary() {
    const summary = document.getElementById('state-summary');
    if (summary) {
        const awareText = gameState.awareOfLoop ? 'You know the loop is real.' : 'You remain unaware of the loop.';
        const itemText = gameState.hasTape ? 'The tape is in your possession.' : 'The tape is nowhere to be found.';
        const caseFileText = gameState.reviewedCaseFile ? 'You studied the case file.' : 'You have yet to read the case file.';
        const trustText = gameState.trustBroken ? 'Distrust festers between you.' : 'Trust remains intact.';
        const laneText = gameState.visitedLarkhill ? 'Larkhill Lane has been explored.' : 'Larkhill Lane is still a mystery.';
        const loopLevelText = `Loop awareness level: ${gameState.loopAwareLevel}`;
        const endingText = gameState.endingChoice ? `Ending chosen: ${gameState.endingChoice}.` : 'No ending reached yet.';
        summary.textContent = [awareText, itemText, caseFileText, trustText, laneText, loopLevelText, endingText].join(' ');
    }
}

const progressKey = 'echoTapeProgress';
let progress = { episode: null, scene: null };

/**
 * Load episode progress from storage.
 * @returns {void}
 */
function loadProgress() {
    progress = tryLoad(progressKey, { episode: null, scene: null });
}

/**
 * Persist current progress state.
 * @returns {void}
 */
function saveProgress() {
    trySave(progressKey, progress);
}

/**
 * Update the saved episode and scene.
 * @param {string|null} ep
 * @param {string|null} scene
 * @returns {void}
 */
function setProgress(ep, scene) {
    progress.episode = ep;
    progress.scene = scene;
    saveProgress();
}

/**
 * Reset stored progress information.
 * @returns {void}
 */
function clearProgress() {
    progress = { episode: null, scene: null };
    saveProgress();
}

/**
 * Get the stored progress value.
 * @returns {{episode: (string|null), scene: (string|null)}}
 */
function getProgress() {
    return progress;
}

/**
 * Export current game state and progress for cross-device saves.
 * @returns {{state: Object, progress: Object}}
 */
function exportSaveData() {
    return {
        state: { ...gameState },
        progress: { ...progress }
    };
}

/**
 * Import previously exported save data.
 * @param {{state:Object, progress:Object}} data
 * @returns {void}
 */
function importSaveData(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    if (data.state && typeof data.state === 'object') {
        gameState = { ...defaultState, ...data.state };
        saveState();
    }
    if (data.progress && typeof data.progress === 'object') {
        progress = { episode: null, scene: null, ...data.progress };
        saveProgress();
    }
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
    getProgress,
    exportSaveData,
    importSaveData
};
