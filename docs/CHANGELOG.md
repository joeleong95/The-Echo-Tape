# Changelog

All notable changes to this project will be documented in this file.

## [0.0.0.38] - 2025-06-27
### Fixed
- Updated `sceneNavigation` to import the bundled DOMPurify directly so Node tests run without build tooling.
- Converted ESLint configuration to `.cjs` format and updated the lint script for compatibility with Node 22.

## [0.0.0.37] - 2025-06-27
### Added
- Tests for keyboard navigation and case file behaviour.
- Initial Episode 2 file with a few scenes.

## [0.0.0.36] - 2025-06-27
### Changed
- Updated `package.json` `main` field to reference `src/script.mjs`.


## [0.0.0.35] - 2025-06-27
### Changed
- Removed leftover hardcoded episode `<script>` tags from `index.html`. Episode scripts now load exclusively via `manifest.json`.


## [0.0.0.34] - 2025-06-27
### Changed
- Service worker cache name now includes a fingerprint of all assets for automatic invalidation.

## [0.0.0.33] - 2025-06-27
### Added
- Focus styles for interactive buttons.
- ARIA roles and keyboard navigation for overlays.

## [0.0.0.32] - 2025-06-27
### Added
- Optional save export/import for cross-device progress.

## [0.0.0.31] - 2025-06-27
### Changed
- UI logic split into a new `sceneNavigation` module for easier maintenance.

## [0.0.0.30] - 2025-06-27
### Added
- Command-line script `preview-episode` for visualizing scene flow.

## [0.0.0.29] - 2025-06-27
### Changed
- CI workflow now runs on pushes in addition to pull requests.

## 0.0.0.28] - 2025-06-37
### Added
- JSDoc comments across core modules for improved type hints.

## [0.0.0.27] - 2025-06-27
### Fixed
- Static background sound now respects the SFX volume and mute settings.

## [0.0.0.26] - 2025-06-27
### Added
- Linting step documented in `AGENTS.md`.
- CI workflow now explicitly runs tests and lint on pull requests.

## [0.0.0.25] - 2025-06-27
### Changed
- Development server now compresses responses and sets cache headers.

## [0.0.0.24] - 2025-06-27
### Added
- Top-level README linking to docs.

## [0.0.0.23] - 2025-06-27
### Added
- Continuous integration workflow to automatically run tests and lint on pull requests.

## [0.0.0.22] - 2025-06-27
### Added
- Initial party scenes extending Episode 1.

## [0.0.0.21] - 2025-06-27
### Added
- Game state now tracks `reviewedCaseFile`, `trustBroken`, and `visitedLarkhill` for future branching.


## [0.0.0.20] - 2025-06-27
### Changed
- Intro music loops during Episode 1 crawl.
- Wider text area for the Episode 1 intro crawl.

## [0.0.0.19] - 2025-06-27
### Added
- Intro music for Episode 1 crawl using `introEP1.ogg`.
- Support for images within Episode 1 scenes.
### Changed
- Star Wars style crawl text now larger with fade effects.

## [0.0.0.18] - 2025-06-26
### Added
- Added case file module scene with tabbed interface and audio cues in Episode 1.

## [0.0.0.17] - 2025-06-26
### Added
- Star Wars style crawl intro for Episode 1 that fades into the logo.

## [0.0.0.16] - 2025-06-26
### Added
- Import map for DOMPurify so the game works on static hosts.
- Warning when running over `file:` protocol.
### Fixed
- Service worker caching now uses absolute URLs to avoid install failures.

## [0.0.0.15] - 2025-06-26
### Added
- `npm start` script that launches a simple static server.
- README updated to recommend serving the game over HTTP.

## [0.0.0.14] - 2025-06-26
### Added
- In-game message with retry option when an episode fails to load.

## [0.0.0.13] - 2025-06-26
### Added
- Build script now outputs `dist/episodes/manifest.json` listing episodes.
- UI loads episode scripts dynamically based on this manifest.
- Removed hardcoded episode `<script>` tags from `index.html`.

## [0.0.0.12] - 2025-06-26
### Changed
- Converted core JavaScript files to ES modules and updated tests accordingly.

## [0.0.0.11] - 2025-06-26
### Changed
- Service worker now embeds the build number during `npm run build-episodes`.
- `embedEpisodes.js` now reports parse errors with the file name and exits with a non-zero status.

## [0.0.0.10] - 2025-06-26
### Added
- Service worker cache is now generated automatically when running `npm run build-episodes`.
- Test now validates JSON in `data-set-state` and `data-show-if` attributes.

## [0.0.0.9] - 2025-06-26
### Changed
- `initAudio` now resumes the audio context when suspended.

## [0.0.0.8] - 2025-06-26
### Added
- Utility function `playAudioElement` to handle volume-aware playback.
- `playVhsSound`, `playSceneSound`, `playTitleMusic`, and `playTitleMusic2` now use the new helper.

## [0.0.0.7] - 2025-06-26
### Added
- `ACT1_DRAFT.md` containing the full first act script.
- README link to the new draft.

## [0.0.0.6] - 2025-06-26
### Added
- Continued Episode 1 with new party setup scenes.
- Local ESLint setup with a `lint` script for checking code style.
- Added `SCRIPT_GUIDELINES.md` with a narrative script reference.

## [0.0.0.5] - 2025-06-26
### Added
- Branch point in Episode 1 allowing players to play, investigate, or destroy the tape.
### Changed
- Updated README and writing guide with instructions on building episodes and running tests.

## [0.0.0.4] - 2025-06-25
### Added
- Centralized image assets in new `images/` folder.
- "Home" button on the first scene of each episode now returns to the title screen.
- Runtime tests for state persistence and audio controls.

## [0.0.0.3] - 2025-06-25
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
- Switched to the 0.0.x versioning scheme and renumbered earlier drafts.
- Contributor guide now notes running `npm run embed` after editing episodes.

## [0.0.0.2] - 2025-06-25
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

## [0.0.0.1] - 2025-06-24
### Added
- Initial code imported from offline development on June 26.
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
- Expanded case file with additional evidence and audio.

