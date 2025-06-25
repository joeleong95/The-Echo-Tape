# Changelog

All notable changes to this project will be documented in this file.
## [0.1.12] - 2025-07-11
### Added
- Script `tools/embedEpisodes.js` to embed JSON episodes into JavaScript.
### Changed
- Contributor guide now notes running `npm run embed` after editing episodes.

## [0.1.11] - 2025-07-10
### Changed
- Audio files now use .ogg format and .wav files removed.
- Static audio stops when returning to menus.

## [0.1.10] - 2025-07-09
### Added
- Second title music track that plays on the episode selection screen.
### Changed
- Title music begins immediately on the title screen.
## [0.1.9] - 2025-07-08
### Added
- Volume sliders for music and SFX with adjustable levels.
- Title music continues on the episode selection screen.
### Changed
- Audio helper functions respect the current volume settings.
## [0.1.8] - 2025-07-07
### Added
- Title music now fades in over three seconds after a short delay.
### Changed
- `playTitleMusic` logic updated to support volume fade.
## [0.1.7] - 2025-07-06
### Added
- Background title music now plays on the start screen.
### Changed
- `titleMusic.wav` moved into the `audio` folder.
## [0.1.6] - 2025-07-05
### Added
- Simple dev tools screen with a button to clear saved progress.
### Fixed
- Continue now resumes play immediately instead of showing the episode menu.
## [0.1.5] - 2025-07-04
### Added
- Conditional `showIf` support for scenes and buttons.
### Changed
- `episodes/episode1` example demonstrates hidden choices.
## [0.1.4] - 2025-07-03
### Added
- Button on the episode selection screen to return to the title.
### Fixed
- Starting Episode 1 after completing the tutorial now works reliably.
## [0.1.3] - 2025-07-02
### Fixed
- Missing `continueBtn` definition prevented the "Insert Tape" button from working.
## [0.1.2] - 2025-07-01
### Added
- Noted early development status in README and AGENTS.
### Changed
- CHANGELOG now lists releases in reverse chronological order.

## [0.1.1] - 2025-06-30
### Added
- Save progress across sessions with a Continue option.
### Changed
- Restarting the game now clears saved progress.

## [0.0.4.4] - 2025-06-29
### Added
- Tutorial episode accessible from the menu.

## [0.0.4.3] - 2025-06-28
### Added
- Tip on using built-in CSS classes in the writing guide.
### Changed
- README now explains how to run the test script.

## [0.0.4.2] - 2025-06-27
### Added
- Mute controls for background static and button click sounds.
- Global click sound plays when any button is pressed.
### Changed
- Static and click audio now respect the mute settings.

## [0.0.4.1] - 2025-06-26
### Added
- Embedded episode data so the game works when opened directly from the file system.
### Changed
- Improved README with clearer instructions.
### Fixed
- Episode selection now loads correctly without a web server.

## [0.1] - 2025-06-25
### Changed
- Renumbered previous releases under the 0.0.x scheme.

## [0.0.4.0] - 2025-06-25
### Added
- Basic sound effects when navigating scenes.
- Scene navigation history overlay.
- Package.json with a simple test script.
- Dedicated folder for audio assets.
### Changed
- Tweaked animation speed and scene transition timing.
### Fixed
- Minor bugs discovered during playtesting.

## [0.0.3.1] - 2025-06-24
### Added
- Smooth fade transitions when moving between screens and scenes.

## [0.0.3.0] - 2025-06-24
### Added
- SEO meta description and Open Graph tags.
- ARIA roles for interactive scenes.
- Externalized CSS and JavaScript files (`style.css` and `script.js`).

## [0.0.2.0] - 2025-06-24
### Added
- Episode selection screen that lets you choose which episode to play.

## [Future]
Planned enhancements and updates will be listed here as they are decided.
