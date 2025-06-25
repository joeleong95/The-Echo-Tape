(function(window) {
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

  function loadState() {
      if (!storageAvailable) {
          return;
      }
      try {
          const saved = localStorage.getItem('echoTapeState');
          if (saved) {
              try {
                  gameState = { ...defaultState, ...JSON.parse(saved) };
              } catch (e) {
                  console.error('Failed to parse state', e);
              }
          }
      } catch (e) {
          if (e instanceof DOMException) {
              console.warn('localStorage unavailable; using in-memory state');
              storageAvailable = false;
          } else {
              throw e;
          }
      }
  }

  function saveState() {
      if (!storageAvailable) {
          return;
      }
      try {
          localStorage.setItem('echoTapeState', JSON.stringify(gameState));
      } catch (e) {
          if (e instanceof DOMException) {
              console.warn('Unable to save state to localStorage');
              storageAvailable = false;
          } else {
              throw e;
          }
      }
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
      if (!storageAvailable) {
          return;
      }
      try {
          const saved = localStorage.getItem(progressKey);
          if (saved) {
              try {
                  progress = { episode: null, scene: null, ...JSON.parse(saved) };
              } catch (e) {
                  console.error('Failed to parse progress', e);
              }
          }
      } catch (e) {
          if (e instanceof DOMException) {
              console.warn('localStorage unavailable; using in-memory progress');
              storageAvailable = false;
          } else {
              throw e;
          }
      }
  }

  function saveProgress() {
      if (!storageAvailable) {
          return;
      }
      try {
          localStorage.setItem(progressKey, JSON.stringify(progress));
      } catch (e) {
          if (e instanceof DOMException) {
              console.warn('Unable to save progress to localStorage');
              storageAvailable = false;
          } else {
              throw e;
          }
      }
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

  window.StateModule = {
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
})(window);
