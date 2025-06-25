(function(window) {
  'use strict';

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
  const closeDevBtn = document.getElementById('close-dev-btn');
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
  const musicVolSlider = document.getElementById('music-volume');
  const sfxVolSlider = document.getElementById('sfx-volume');

  let sceneHistory = [];
  let selectedEpisode = null;
  let introTimers = [];
  let currentEpisode = null;
  let resumeScene = null;

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

      screen.innerHTML = '';

      const builtIds = [];
      data.scenes.forEach(scene => {
          if (scene.showIf) {
              let ok = true;
              for (const key in scene.showIf) {
                  if (StateModule.getState(key) !== scene.showIf[key]) {
                      ok = false;
                      break;
                  }
              }
              if (!ok) return;
          }
          const div = document.createElement('div');
          div.id = scene.id;
          div.className = 'interactive-scene';
          div.setAttribute('role', 'dialog');
          div.setAttribute('aria-label', scene.id);
          div.innerHTML = scene.html;

          div.querySelectorAll('[data-show-if]').forEach(el => {
              const condStr = el.getAttribute('data-show-if');
              if (!condStr) return;
              try {
                  const cond = JSON.parse(condStr);
                  let match = true;
                  for (const key in cond) {
                      if (StateModule.getState(key) !== cond[key]) {
                          match = false;
                          break;
                      }
                  }
                  if (!match) el.remove();
              } catch (e) {
                  console.error('Invalid data-show-if', e);
              }
          });

          screen.appendChild(div);
          builtIds.push(scene.id);
      });

      sceneHistory = [];
      updateBackButton();
      let startId = data.start;
      if (!startId || !builtIds.includes(startId)) {
          startId = builtIds[0];
      }
      if (resumeScene && builtIds.includes(resumeScene)) {
          startId = resumeScene;
          resumeScene = null;
      }
      const progress = StateModule.getProgress();
      if (progress.episode === ep && progress.scene && builtIds.includes(progress.scene)) {
          startId = progress.scene;
      }
      if (startId) {
          goToScene(startId);
      }
  }

  function startEpisode(ep) {
      AudioModule.stopTitleMusic();
      AudioModule.stopTitleMusic2();
      hideScreen(introScreen);
      gameContainer.style.display = 'block';
      currentEpisode = ep;
      recordLight.style.display = 'block';
      AudioModule.playVhsSound();
      loadEpisode(ep);
  }

  function playIntro(ep) {
      selectedEpisode = ep;
      AudioModule.stopTitleMusic2();
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
      sceneHistory = [];
      const screen = document.getElementById('vhs-screen');
      if (screen) screen.innerHTML = '';
      updateBackButton();
      updateContinueButton();
      showScreen(episodeScreen);
      AudioModule.playTitleMusic2();
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
      AudioModule.playSceneSound();
      updateBackButton();
      targetScene.scrollIntoView({ behavior: 'smooth' });
      focusFirstChoice(targetScene);
      StateModule.setProgress(currentEpisode, sceneId);
      if (sceneId === 'scene-tobecontinued') {
          StateModule.updateStateSummary();
      }
  }

  function updateBackButton() {
      if (backBtn) {
          backBtn.disabled = sceneHistory.length === 0;
      }
  }

  function updateContinueButton() {
      if (continueBtn) {
          const prog = StateModule.getProgress();
          continueBtn.style.display = prog.episode ? 'block' : 'none';
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

  function init() {
      document.addEventListener('keydown', handleKeydown);

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
          continueBtn.addEventListener('click', () => {
              AudioModule.initAudio();
              AudioModule.stopTitleMusic();
              hideScreen(titleScreen);
              resumeScene = StateModule.getProgress().scene;
              startEpisode(StateModule.getProgress().episode || '1');
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
              updateContinueButton();
              alert('Save data cleared');
          });
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

      if (backBtn) backBtn.addEventListener('click', goBack);
      if (historyBtn) historyBtn.addEventListener('click', showHistory);
      if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', closeHistory);

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
              goToScene(btn.dataset.scene);
          } else if (btn.dataset.restart !== undefined) {
              restartGame();
          }
      });

      if (skipIntroBtn) {
          skipIntroBtn.addEventListener('click', () => {
              introTimers.forEach(clearTimeout);
              startEpisode(selectedEpisode || '1');
          });
      }
      updateBackButton();
  }

  window.UiModule = {
      init,
      loadEpisode,
      goToScene,
      restartGame,
      updateContinueButton
  };
})(window);
