    // Game State Elements
    const titleScreen = document.getElementById('title-screen');
    const episodeScreen = document.getElementById('episode-screen');
    const introScreen = document.getElementById('intro-screen');
    const introText = document.querySelector('.intro-text');
    const introTitle = document.getElementById('intro-title');
    const skipIntroBtn = document.getElementById('skip-intro-btn');
    const gameContainer = document.querySelector('.container');
    const startBtn = document.getElementById('start-btn');
    const continueBtn = document.getElementById('continue-btn');
    const recordLight = document.querySelector('.record-light');
    const episodeButtons = document.querySelectorAll('.episode-btn');
    const returnTitleBtn = document.getElementById('return-title-btn');
    const backBtn = document.getElementById('back-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyOverlay = document.getElementById('history-overlay');
    const historyList = document.getElementById('history-list');
    const closeHistoryBtn = document.getElementById('close-history-btn');
    const muteMusicBtn = document.getElementById('mute-music-btn');
    const muteSfxBtn = document.getElementById('mute-sfx-btn');
    const sfxClick = document.getElementById('sfx-click');
    const sfxStatic = document.getElementById('sfx-static');
    if (sfxStatic) {
        sfxStatic.loop = true;
    }

    // Audio context will be created on the first user interaction
let audioCtx;

// Audio settings
let musicMuted = false;
let sfxMuted = false;

// Tracks the sequence of visited scenes
let sceneHistory = [];
let selectedEpisode = null;
let introTimers = [];
let currentEpisode = null;
let resumeScene = null;
    

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

// ------- Progress helpers -------
const progressKey = "echoTapeProgress";
let progress = { episode: null, scene: null };

function loadProgress() {
    const saved = localStorage.getItem(progressKey);
    if (saved) {
        try {
            progress = { episode: null, scene: null, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Failed to load progress", e);
        }
    }
    if (continueBtn) {
        continueBtn.style.display = progress.episode ? 'block' : 'none';
    }
}

function saveProgress() {
    localStorage.setItem(progressKey, JSON.stringify(progress));
}

function setProgress(ep, scene) {
    progress.episode = ep;
    progress.scene = scene;
    saveProgress();
}

function clearProgress() {
    progress = { episode: null, scene: null };
    saveProgress();
    if (continueBtn) {
        continueBtn.style.display = 'none';
    }
}
// ------- Audio helpers -------
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playVhsSound() {
    if (sfxStatic && sfxStatic.paused && !musicMuted) {
        sfxStatic.currentTime = 0;
        sfxStatic.play();
    }
}

function playSceneSound() {
    if (sfxStatic && sfxStatic.paused && !musicMuted) {
        sfxStatic.currentTime = 0;
        sfxStatic.play();
    }
}

function playClickSound() {
    if (sfxClick && !sfxMuted) {
        sfxClick.currentTime = 0;
        sfxClick.play();
    }
}

loadState();

loadProgress();
async function loadEpisode(ep) {
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
            return;
        }
    }
    const screen = document.getElementById('vhs-screen');
    if (!screen) return;

        // clear any previous scenes
        screen.innerHTML = '';

        // build scenes from the JSON data
        data.scenes.forEach(scene => {
            const div = document.createElement('div');
            div.id = scene.id;
            div.className = 'interactive-scene';
            div.setAttribute('role', 'dialog');
            div.setAttribute('aria-label', scene.id);
            div.innerHTML = scene.html;
            screen.appendChild(div);
        });

        sceneHistory = [];
        updateBackButton();
        let startId = data.start || (data.scenes[0] && data.scenes[0].id);
        if (resumeScene && data.scenes.some(s => s.id === resumeScene)) {
            startId = resumeScene;
            resumeScene = null;
        }
        if (progress.episode === ep && progress.scene) {
            if (data.scenes.some(s => s.id === progress.scene)) {
                startId = progress.scene;
            }
        }
        if (startId) {
            goToScene(startId);
        }
}

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
if (returnTitleBtn) {
    returnTitleBtn.addEventListener('click', () => {
        hideScreen(episodeScreen);
        showScreen(titleScreen);
    });
}
if (continueBtn) {
    continueBtn.addEventListener("click", () => {
        initAudio();
        hideScreen(titleScreen);
        showScreen(episodeScreen);
        resumeScene = progress.scene;
        startEpisode(progress.episode || "1");
    });
}

function startEpisode(ep) {
    hideScreen(introScreen);
    gameContainer.style.display = 'block';
    currentEpisode = ep;
    recordLight.style.display = 'block';
    playVhsSound();
    loadEpisode(ep);
}

function playIntro(ep) {
    selectedEpisode = ep;
    hideScreen(episodeScreen);
    showScreen(introScreen);
    introText.classList.remove('fade-out');
    introTitle.classList.remove('visible');
    introTimers.forEach(clearTimeout);
    introTimers = [];
    introTimers.push(setTimeout(() => {
        introText.classList.add('fade-out');
        introTitle.classList.add('visible');
    }, 8000));
    introTimers.push(setTimeout(() => {
        startEpisode(selectedEpisode);
    }, 14000));
}

episodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const ep = btn.dataset.episode;
        if (ep === '1') {
            playIntro(ep);
        } else {
            hideScreen(episodeScreen);
            startEpisode(ep);
        }
    });
});
    
function restartGame() {
    gameContainer.style.display = 'none';
    recordLight.style.display = 'none';
    currentEpisode = null;
    selectedEpisode = null;
    introTimers.forEach(clearTimeout);
    hideScreen(introScreen);
    clearProgress();
    resetState();
    sceneHistory = [];
    const screen = document.getElementById('vhs-screen');
    if (screen) screen.innerHTML = '';
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
    focusFirstChoice(targetScene);
    setProgress(currentEpisode, sceneId);
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
if (muteMusicBtn) {
    muteMusicBtn.addEventListener('click', () => {
        musicMuted = !musicMuted;
        if (sfxStatic) sfxStatic.muted = musicMuted;
        muteMusicBtn.textContent = musicMuted ? 'Unmute Music' : 'Mute Music';
    });
}

if (muteSfxBtn) {
    muteSfxBtn.addEventListener('click', () => {
        sfxMuted = !sfxMuted;
        if (sfxClick) sfxClick.muted = sfxMuted;
        muteSfxBtn.textContent = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
    });
}

// play click sound on all button presses
document.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        playClickSound();
    }
});

if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', () => {
        introTimers.forEach(clearTimeout);
        startEpisode(selectedEpisode || '1');
    });
}

updateBackButton();

function focusFirstChoice(scene) {
    const first = scene.querySelector('.choice-btn');
    if (first) {
        first.focus();
    }
}

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

document.addEventListener('keydown', handleKeydown);
