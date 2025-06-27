# Contributing Guide

Thank you for helping improve **The Echo Tape**! This project uses Node.js 18 and simple npm scripts to manage content and run the local server.

## Setup
1. Install Node.js 18 or higher.
2. Clone this repository and install dependencies:
   ```bash
   npm install
   ```

## Running the Local Server
Serve the project through a small HTTP server so that the service worker and episode files load correctly:
```bash
npm start
```
This runs the bundled `server.js`. You can also use your own server, e.g. `npx http-server`.

## Building Episodes
After editing any JSON file in `episodes/`, generate the embedded JavaScript and update the service worker:
```bash
npm run build-episodes
```
Commit the updated `.js` files in `dist/episodes/` along with the changed `.json`.

## Testing and Linting
Run the tests and linter before pushing changes:
```bash
npm test
npm run lint
```
The tests ensure required files exist and validate episode structure.

## Previewing Episode Flow
To quickly inspect a single episode file you can run:
```bash
npm run preview-episode episodes/myEpisode.json
```
Add `--dot` to output Graphviz format.

Happy hacking!
