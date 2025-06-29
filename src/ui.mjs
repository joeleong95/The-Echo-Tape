'use strict';

/**
 * UI layer controlling screen transitions and user interaction.
 * @module ui
 */

import * as StateModule from './state.mjs';
import * as AudioModule from './audio.mjs';
import * as Navigation from './sceneNavigation.mjs';

const titleScreen = document.getElementById('title-screen');
const episodeScreen = document.getElementById('episode-screen');
const introScreen = document.getElementById('intro-screen');
const introText = document.querySelector('.intro-text');
const introTitle = document.getElementById('intro-title');
const skipIntroBtn = document.getElementById('skip-intro-btn');
const gameContainer = document.querySelector('.container');
const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const devBtn = document.getElementById('dev-btn');
const devScreen = document.getElementById('dev-screen');
const clearSaveBtn = document.getElementById('clear-save-btn');
const exportSaveBtn = document.getElementById('export-save-btn');
const importSaveBtn = document.getElementById('import-save-btn');
const importSaveInput = document.getElementById('import-save-input');
const closeDevBtn = document.getElementById('close-dev-btn');
const recordLight = document.querySelector('.record-light');
const episodeButtons = document.querySelectorAll('.episode-btn');
const returnTitleBtn = document.getElementById('return-title-btn');
const muteMusicBtn = document.getElementById('mute-music-btn');
const muteSfxBtn = document.getElementById('mute-sfx-btn');
const musicVolSlider = document.getElementById('music-volume');
const sfxVolSlider = document.getElementById('sfx-volume');
const voiceVolSlider = document.getElementById('voice-volume');

let selectedEpisode = null;
let introTimers = [];
let currentEpisode = null;
let resumeScene = null;

/**
 * Dynamically load all episode JavaScript bundles.
 * @returns {Promise<void>}
 */
async function loadEpisodeScripts() {
    try {
        const resp = await fetch('dist/episodes/manifest.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const names = await resp.json();
        names.forEach(name => {
            const script = document.createElement('script');
            script.src = `dist/episodes/${name}.js`;
            document.body.appendChild(script);
        });
    } catch (err) {
        console.error('Failed to load episode scripts', err);
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

async function startEpisode(ep) {
    AudioModule.stopTitleMusic();
    AudioModule.stopTitleMusic2();
    AudioModule.stopIntroMusic();
    hideScreen(introScreen);
    gameContainer.style.display = 'block';
    currentEpisode = ep;
    Navigation.setCurrentEpisode(ep);
    recordLight.style.display = 'block';
    AudioModule.playVhsSound();
    await Navigation.loadEpisode(ep, resumeScene);
    resumeScene = null;
}

function playIntro(ep) {
    selectedEpisode = ep;
    AudioModule.stopTitleMusic2();
    AudioModule.playIntroMusic();
    hideScreen(episodeScreen);
    showScreen(introScreen);
    introText.classList.remove('fade-out');
    introText.style.animation = 'none';
    void introText.offsetHeight;
    introText.style.animation = '';
    introTitle.classList.remove('visible');
    introTimers.forEach(clearTimeout);
    introTimers = [];
    introTimers.push(setTimeout(() => {
        introTitle.classList.add('visible');
    }, 25000));
    introTimers.push(setTimeout(async () => {
        await startEpisode(selectedEpisode);
    }, 30000));
}

function restartGame() {
    gameContainer.style.display = 'none';
    recordLight.style.display = 'none';
    currentEpisode = null;
    selectedEpisode = null;
    introTimers.forEach(clearTimeout);
    hideScreen(introScreen);
    AudioModule.stopVhsSound();
    StateModule.clearProgress();
    StateModule.resetState();
    Navigation.clearHistory();
    const screen = document.getElementById('vhs-screen');
    if (screen) screen.innerHTML = '';
    Navigation.updateBackButton();
    Navigation.updateContinueButton();
    showScreen(episodeScreen);
    AudioModule.playTitleMusic2();
}

function returnToTitle() {
    gameContainer.style.display = 'none';
    recordLight.style.display = 'none';
    currentEpisode = null;
    introTimers.forEach(clearTimeout);
    hideScreen(introScreen);
    AudioModule.stopVhsSound();
    const screen = document.getElementById('vhs-screen');
    if (screen) screen.innerHTML = '';
    Navigation.clearHistory();
    Navigation.updateBackButton();
    Navigation.updateContinueButton();
    AudioModule.stopTitleMusic2();
    showScreen(titleScreen);
    AudioModule.playTitleMusic();
}

function init() {
    document.addEventListener('keydown', Navigation.handleKeydown);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const hist = document.getElementById('history-overlay');
            const caseFile = document.getElementById('case-file-overlay');
            if (hist && hist.classList.contains('visible')) {
                Navigation.closeHistory();
            } else if (caseFile && caseFile.classList.contains('visible')) {
                Navigation.closeCaseFile();
            }
        }
    });
    loadEpisodeScripts();

    startBtn.addEventListener('click', () => {
        AudioModule.initAudio();
        AudioModule.stopTitleMusic();
        hideScreen(titleScreen);
        AudioModule.playTapeFx();
        AudioModule.playTitleMusic2();
        showScreen(episodeScreen);
    });

    if (returnTitleBtn) {
        returnTitleBtn.addEventListener('click', () => {
            hideScreen(episodeScreen);
            AudioModule.stopVhsSound();
            AudioModule.stopTitleMusic2();
            AudioModule.playTitleMusic();
            showScreen(titleScreen);
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', async () => {
            AudioModule.initAudio();
            AudioModule.stopTitleMusic();
            hideScreen(titleScreen);
            resumeScene = StateModule.getProgress().scene;
            await startEpisode(StateModule.getProgress().episode || '1');
        });
    }

    if (devBtn) {
        devBtn.addEventListener('click', () => {
            hideScreen(titleScreen);
            AudioModule.stopTitleMusic();
            showScreen(devScreen);
        });
    }

    if (closeDevBtn) {
        closeDevBtn.addEventListener('click', () => {
            hideScreen(devScreen);
            AudioModule.playTitleMusic();
            showScreen(titleScreen);
        });
    }

    if (clearSaveBtn) {
        clearSaveBtn.addEventListener('click', () => {
            StateModule.clearProgress();
            StateModule.resetState();
            Navigation.updateContinueButton();
            alert('Save data cleared');
        });
    }

    if (exportSaveBtn) {
        exportSaveBtn.addEventListener('click', () => {
            const data = StateModule.exportSaveData();
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'echo-tape-save.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (importSaveBtn && importSaveInput) {
        importSaveBtn.addEventListener('click', () => importSaveInput.click());
        importSaveInput.addEventListener('change', () => {
            const file = importSaveInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    StateModule.importSaveData(data);
                    Navigation.updateContinueButton();
                    alert('Save data imported');
                } catch (err) {
                    alert('Invalid save file');
                }
            };
            reader.readAsText(file);
            importSaveInput.value = '';
        });
    }

    episodeButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const ep = btn.dataset.episode;
            if (ep === '1') {
                playIntro(ep);
            } else {
                hideScreen(episodeScreen);
                await startEpisode(ep);
            }
        });
    });

    const backBtn = document.getElementById('back-btn');
    const historyBtn = document.getElementById('history-btn');
    const closeHistoryBtn = document.getElementById('close-history-btn');
    const caseFileBtn = document.getElementById('case-file-btn');
    const closeCaseFileBtn = document.getElementById('close-case-file-btn');

    if (backBtn) backBtn.addEventListener('click', () => Navigation.handleBackBtn(returnToTitle));
    if (historyBtn) historyBtn.addEventListener('click', Navigation.showHistory);
    if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', Navigation.closeHistory);
    if (caseFileBtn) caseFileBtn.addEventListener('click', Navigation.showCaseFile);
    if (closeCaseFileBtn) closeCaseFileBtn.addEventListener('click', Navigation.closeCaseFile);

    if (muteMusicBtn) {
        muteMusicBtn.addEventListener('click', () => {
            const val = !AudioModule.getMusicMuted();
            AudioModule.setMusicMuted(val);
            StateModule.setState('musicMuted', val);
        });
    }

    if (muteSfxBtn) {
        muteSfxBtn.addEventListener('click', () => {
            const val = !AudioModule.getSfxMuted();
            AudioModule.setSfxMuted(val);
            StateModule.setState('sfxMuted', val);
        });
    }

    if (musicVolSlider) {
        musicVolSlider.addEventListener('input', () => {
            const val = parseFloat(musicVolSlider.value);
            AudioModule.setMusicVolume(val);
            StateModule.setState('musicVolume', val);
        });
    }

    if (sfxVolSlider) {
        sfxVolSlider.addEventListener('input', () => {
            const val = parseFloat(sfxVolSlider.value);
            AudioModule.setSfxVolume(val);
            StateModule.setState('sfxVolume', val);
        });
    }

    if (voiceVolSlider) {
        voiceVolSlider.addEventListener('input', () => {
            const val = parseFloat(voiceVolSlider.value);
            AudioModule.setVoiceVolume(val);
            StateModule.setState('voiceVolume', val);
        });
    }

    document.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        AudioModule.playClickSound();
        if (btn.dataset.setState) {
            try {
                const obj = JSON.parse(btn.dataset.setState);
                for (const key in obj) {
                    StateModule.setState(key, obj[key]);
                }
            } catch (err) {
                console.error('Invalid data-set-state', err);
            }
        }
        if (btn.dataset.scene) {
            Navigation.goToScene(btn.dataset.scene);
        } else if (btn.dataset.restart !== undefined) {
            restartGame();
        }
    });

    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', async () => {
            introTimers.forEach(clearTimeout);
            AudioModule.stopIntroMusic();
            await startEpisode(selectedEpisode || '1');
        });
    }
    Navigation.updateBackButton();
}

const { loadEpisode, goToScene, updateContinueButton } = Navigation;

export {
    init,
    startEpisode,
    restartGame,
    Navigation as navigation,
    loadEpisode,
    goToScene,
    updateContinueButton
};
