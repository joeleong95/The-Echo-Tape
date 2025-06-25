    // Game State Elements
    const titleScreen = document.getElementById('title-screen');
    const episodeScreen = document.getElementById('episode-screen');
    const gameContainer = document.querySelector('.container');
    const startBtn = document.getElementById('start-btn');
    const recordLight = document.querySelector('.record-light');
    const episodeButtons = document.querySelectorAll('.episode-btn');
    const backBtn = document.getElementById('back-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyOverlay = document.getElementById('history-overlay');
    const historyList = document.getElementById('history-list');
    const closeHistoryBtn = document.getElementById('close-history-btn');

    // Audio context will be created on the first user interaction
let audioCtx;

// Tracks the sequence of visited scenes
let sceneHistory = [];
    

// Persistent state
const defaultState = { awareOfLoop: false, hasTape: false };
let gameState = { ...defaultState };

function loadState() {
    const saved = localStorage.getItem("echoTapeState");
    if (saved) {
        try {
            gameState = { ...defaultState, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Failed to load state", e);
        }
    }
}

function saveState() {
    localStorage.setItem("echoTapeState", JSON.stringify(gameState));
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
    const summary = document.getElementById("state-summary");
    if (summary) {
        const awareText = gameState.awareOfLoop ? "You know the loop is real." : "You remain unaware of the loop.";
        const itemText = gameState.hasTape ? "The tape is in your possession." : "The tape is nowhere to be found.";
        summary.textContent = awareText + " " + itemText;
    }
}

// ------- Audio helpers -------
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playVhsSound() {
    if (!audioCtx) return;
    const duration = 0.5;
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1; // white noise
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    noise.connect(gain).connect(audioCtx.destination);
    noise.start();
    noise.stop(audioCtx.currentTime + duration);
}

function playSceneSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 900;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

loadState();

function showScreen(el) {
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('visible'));
}

function hideScreen(el) {
    el.classList.remove('visible');
    el.addEventListener('transitionend', function handler() {
        el.style.display = 'none';
        el.removeEventListener('transitionend', handler);
    }, { once: true });
}

startBtn.addEventListener('click', () => {
    initAudio();
    hideScreen(titleScreen);
    showScreen(episodeScreen);
});
    
episodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const ep = btn.dataset.episode;
        if (ep === '1') {
            hideScreen(episodeScreen);
            gameContainer.style.display = 'block';
            recordLight.style.display = 'block';
            playVhsSound();
            goToScene('scene-start');
        }
    });
});
    
function restartGame() {
    gameContainer.style.display = 'none';
    recordLight.style.display = 'none';
    resetState();
    sceneHistory = [];
    updateBackButton();
    showScreen(episodeScreen);
}
    
function showScene(scene) {
    scene.style.display = 'block';
    requestAnimationFrame(() => scene.classList.add('visible'));
}

function hideScene(scene) {
    return new Promise(resolve => {
        scene.classList.remove('visible');
        scene.addEventListener('transitionend', function handler() {
            scene.style.display = 'none';
            scene.removeEventListener('transitionend', handler);
            resolve();
        }, { once: true });
    });
}

async function goToScene(sceneId, fromBack = false) {
    const targetScene = document.getElementById(sceneId);
    if (!targetScene) return;

    const currentScene = document.querySelector('.interactive-scene.visible');
    if (currentScene && currentScene !== targetScene) {
        if (!fromBack) {
            sceneHistory.push(currentScene.id);
        }
        await hideScene(currentScene);
    }

    showScene(targetScene);
    playSceneSound();
    updateBackButton();
    targetScene.scrollIntoView({ behavior: 'smooth' });
    if (sceneId === 'scene-tobecontinued') {
        updateStateSummary();
    }
}

window.setState = setState;
window.getState = getState;

function updateBackButton() {
    if (backBtn) {
        backBtn.disabled = sceneHistory.length === 0;
    }
}

function goBack() {
    if (sceneHistory.length === 0) return;
    const prev = sceneHistory.pop();
    goToScene(prev, true);
}

function showHistory() {
    if (!historyOverlay) return;
    historyList.textContent = sceneHistory.join(' \u2192 ');
    historyOverlay.classList.add('visible');
}

function closeHistory() {
    if (!historyOverlay) return;
    historyOverlay.classList.remove('visible');
}

if (backBtn) backBtn.addEventListener('click', goBack);
if (historyBtn) historyBtn.addEventListener('click', showHistory);
if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', closeHistory);

updateBackButton();
