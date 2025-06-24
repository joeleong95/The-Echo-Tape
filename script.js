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
    startBtn.addEventListener('click', () => {
    titleScreen.style.display = 'none';
    episodeScreen.style.display = 'flex';
    });
    
    episodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
    const ep = btn.dataset.episode;
    if (ep === '1') {
        episodeScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        recordLight.style.display = 'block';
        goToScene('scene-start');
    }
    });
    });
    
    function restartGame() {
    // Hide the game container and return to episode selection
    gameContainer.style.display = 'none';
    recordLight.style.display = 'none';
    resetState();
    episodeScreen.style.display = 'flex';
    }
    
    function goToScene(sceneId) {
    const scenes = document.querySelectorAll('.interactive-scene');
    scenes.forEach(scene => scene.style.display = 'none');
    const targetScene = document.getElementById(sceneId);
    if (targetScene) {
    targetScene.style.display = 'block';
    targetScene.scrollIntoView({ behavior: 'smooth' });
        if (sceneId === 'scene-tobecontinued') {
            updateStateSummary();
        }
    }
    }

window.setState = setState;
window.getState = getState;
