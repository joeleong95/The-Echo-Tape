// Main entry point orchestrating modules

StateModule.loadState();
StateModule.loadProgress();

AudioModule.setMusicMuted(StateModule.getState('musicMuted'));
AudioModule.setSfxMuted(StateModule.getState('sfxMuted'));
AudioModule.setMusicVolume(StateModule.getState('musicVolume'));
AudioModule.setSfxVolume(StateModule.getState('sfxVolume'));
AudioModule.applyAudioPrefs();

UiModule.init();
UiModule.updateContinueButton();

window.setState = StateModule.setState;
window.getState = StateModule.getState;
window.goToScene = UiModule.goToScene;
window.restartGame = UiModule.restartGame;

AudioModule.playTitleMusic();
