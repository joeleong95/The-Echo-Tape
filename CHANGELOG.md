# Changelog

All notable changes to this project will be documented in this file.

## [0.0.0.9] - 2025-07-29
### Changed
- `initAudio` now resumes the audio context when suspended.

## [0.0.0.8] - 2025-07-28
### Added
- Utility function `playAudioElement` to handle volume-aware playback.
- `playVhsSound`, `playSceneSound`, `playTitleMusic`, and `playTitleMusic2` now use the new helper.

## [0.0.0.7] - 2025-07-27
### Added
- `ACT1_DRAFT.md` containing the full first act script.
- README link to the new draft.

## [0.0.0.6] - 2025-06-26
### Added
- Continued Episode 1 with new party setup scenes.

## [0.0.0.5] - 2025-07-25
### Changed
- Updated README and writing guide with instructions on building episodes and running tests.

## [0.0.0.4] - 2025-07-24
### Added
- Centralized image assets in new `images/` folder.
- "Home" button on the first scene of each episode now returns to the title screen.
- Runtime tests for state persistence and audio controls.

## [0.0.0.3] - 2025-07-21
### Added
- Replaced inline `onclick` attributes in episode files with `data` attributes and event delegation.
- Updated writing guide and tests accordingly.
- Split `script.js` into `state.js`, `audio.js`, and `ui.js` modules.
- Audio mute and volume preferences are now saved in persistent game state.
- Test now checks for duplicate scene IDs and broken `goToScene` links.
- Consolidated episode embedding scripts into `scripts/embedEpisodes.js`.
- `npm run embed` now runs the same script as `npm run build-episodes`.
- Gracefully handle missing `localStorage` when loading or saving state.
- Updated HTML title and Open Graph title to remove episode number.
- Contributor guide now instructs running `npm run build-episodes` after editing episodes and committing the generated files.
- Build script `scripts/embedEpisodes.js` for embedding episodes.
- Test now validates episode JSON files and their generated JS counterparts.
- Script `tools/embedEpisodes.js` to embed JSON episodes into JavaScript.
- Contributor guide now notes running `npm run embed` after editing episodes.

## [0.0.0.2] - 2025-07-10
### Added
- Audio files now use .ogg format and .wav files removed.
- Static audio stops when returning to menus.
- Second title music track that plays on the episode selection screen.
- Title music begins immediately on the title screen.
- Volume sliders for music and SFX with adjustable levels.
- Title music continues on the episode selection screen.
- Audio helper functions respect the current volume settings.
- Title music now fades in over three seconds after a short delay.
- `playTitleMusic` logic updated to support volume fade.
- Background title music now plays on the start screen.
- `titleMusic.wav` moved into the `audio` folder.
- Simple dev tools screen with a button to clear saved progress.
- Continue now resumes play immediately instead of showing the episode menu.
- Conditional `showIf` support for scenes and buttons.
- `episodes/episode1` example demonstrates hidden choices.
- Button on the episode selection screen to return to the title.
- Starting Episode 1 after completing the tutorial now works reliably.
- Missing `continueBtn` definition prevented the "Insert Tape" button from working.
- Noted early development status in README and AGENTS.
- CHANGELOG now lists releases in reverse chronological order.

## [0.0.0.1] - 2025-06-30
### Added
- Save progress across sessions with a Continue option.
- Restarting the game now clears saved progress.
- Tutorial episode accessible from the menu.
- Tip on using built-in CSS classes in the writing guide.
- README now explains how to run the test script.
- Mute controls for background static and button click sounds.
- Global click sound plays when any button is pressed.
- Static and click audio now respect the mute settings.
- Embedded episode data so the game works when opened directly from the file system.
- Improved README with clearer instructions.
- Episode selection now loads correctly without a web server.
- Renumbered previous releases under the 0.0.x scheme.
- Basic sound effects when navigating scenes.
- Scene navigation history overlay.
- Package.json with a simple test script.
- Dedicated folder for audio assets.
- Tweaked animation speed and scene transition timing.
- Minor bugs discovered during playtesting.
- Smooth fade transitions when moving between screens and scenes.
- SEO meta description and Open Graph tags.
- ARIA roles for interactive scenes.
- Externalized CSS and JavaScript files (`style.css` and `script.js`).
- Episode selection screen that lets you choose which episode to play.

## [Future]
### Added
- Branch point in Episode 1 allowing players to play, investigate, or destroy the tape.
- Local ESLint setup with a `lint` script for checking code style.
- Added `SCRIPT_GUIDELINES.md` with a narrative script reference.
Planned enhancements and updates will be listed here as they are decided.
