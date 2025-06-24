    // Game State Elements
    const titleScreen = document.getElementById('title-screen');
    const episodeScreen = document.getElementById('episode-screen');
    const gameContainer = document.querySelector('.container');
    const startBtn = document.getElementById('start-btn');
    const recordLight = document.querySelector('.record-light');
    const episodeButtons = document.querySelectorAll('.episode-btn');
    

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
            goToScene('scene-start');
        }
    });
});
    
function restartGame() {
    gameContainer.style.display = 'none';
    recordLight.style.display = 'none';
    resetState();
    showScreen(episodeScreen);
}
    
function showScene(scene) {
    scene.style.display = 'block';
    requestAnimationFrame(() => scene.classList.add('visible'));
}

function hideScene(scene) {
    scene.classList.remove('visible');
    scene.addEventListener('transitionend', function handler() {
        scene.style.display = 'none';
        scene.removeEventListener('transitionend', handler);
    }, { once: true });
}

function goToScene(sceneId) {
    const targetScene = document.getElementById(sceneId);
    if (!targetScene) return;

    const currentScene = document.querySelector('.interactive-scene.visible');
    if (currentScene && currentScene !== targetScene) {
        hideScene(currentScene);
    }

    showScene(targetScene);
    targetScene.scrollIntoView({ behavior: 'smooth' });
    if (sceneId === 'scene-tobecontinued') {
        updateStateSummary();
    }
}

window.setState = setState;
window.getState = getState;
