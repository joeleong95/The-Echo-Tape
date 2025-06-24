    // Game State Elements
    const titleScreen = document.getElementById('title-screen');
    const episodeScreen = document.getElementById('episode-screen');
    const gameContainer = document.querySelector('.container');
    const startBtn = document.getElementById('start-btn');
    const recordLight = document.querySelector('.record-light');
    const episodeButtons = document.querySelectorAll('.episode-btn');
    
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
    episodeScreen.style.display = 'flex';
    }
    
    function goToScene(sceneId) {
    const scenes = document.querySelectorAll('.interactive-scene');
    scenes.forEach(scene => scene.style.display = 'none');
    const targetScene = document.getElementById(sceneId);
    if (targetScene) {
    targetScene.style.display = 'block';
    targetScene.scrollIntoView({ behavior: 'smooth' });
    }
    }
