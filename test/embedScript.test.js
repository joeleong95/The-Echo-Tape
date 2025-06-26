const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const episodesDir = path.join(__dirname, '..', 'episodes');
const badFile = path.join(episodesDir, 'bad.json');

// Create an invalid JSON file
fs.writeFileSync(badFile, '{ invalid json }');

// Run the embed script expecting failure
const resultFail = spawnSync('node', [path.join(__dirname, '..', 'scripts', 'embedEpisodes.js')], { encoding: 'utf8' });

// Clean up the invalid file
fs.unlinkSync(badFile);

if (resultFail.status === 0) {
  throw new Error('embedEpisodes.js should fail on invalid JSON');
}
if (!(/bad\.json/.test(resultFail.stderr) || /bad\.json/.test(resultFail.stdout))) {
  throw new Error('Error output should mention bad.json');
}

// Verify script succeeds when JSON is valid
const resultSuccess = spawnSync('node', [path.join(__dirname, '..', 'scripts', 'embedEpisodes.js')], { encoding: 'utf8' });
if (resultSuccess.status !== 0) {
  throw new Error('embedEpisodes.js failed on valid episodes');
}

