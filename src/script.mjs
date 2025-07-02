/**
 * Main entry point orchestrating modules on page load.
 * @module main
 */
import * as StateModule from './state.mjs';
import * as AudioModule from './audio.mjs';
import * as UiModule from './ui.mjs';

StateModule.loadState();
StateModule.loadProgress();

AudioModule.setMusicMuted(StateModule.getState('musicMuted'));
AudioModule.setSfxMuted(StateModule.getState('sfxMuted'));
AudioModule.setMusicVolume(StateModule.getState('musicVolume'));
AudioModule.setSfxVolume(StateModule.getState('sfxVolume'));
AudioModule.setVoiceVolume(StateModule.getState('voiceVolume'));
AudioModule.applyAudioPrefs();
AudioModule.preloadAllAudio();

UiModule.init();
UiModule.updateContinueButton();

window.setState = StateModule.setState;
window.getState = StateModule.getState;
window.goToScene = UiModule.goToScene;
window.restartGame = UiModule.restartGame;

AudioModule.playTitleMusic();
