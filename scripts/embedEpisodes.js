const fs = require('fs');
const path = require('path');

const episodesDir = path.join(__dirname, '..', 'episodes');

const files = fs.readdirSync(episodesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const jsonPath = path.join(episodesDir, file);
  let jsonData;
  try {
    jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    console.error(`Failed to parse ${file}:`, err.message);
    process.exit(1);
  }

  const name = path.basename(file, '.json');
  const jsPath = path.join(episodesDir, `${name}.js`);
  const jsContent =
    'window.localEpisodes = window.localEpisodes || {};' +
    `\nwindow.localEpisodes[${JSON.stringify(name)}] = ` +
    JSON.stringify(jsonData, null, 2) + ';\n';
  fs.writeFileSync(jsPath, jsContent);
});

console.log('Embedded', files.length, 'episodes');

// Update sw.js cache list with all episode files
try {
  const swPath = path.join(__dirname, '..', 'sw.js');
  const swLines = fs.readFileSync(swPath, 'utf8').split(/\r?\n/);
  // Update CACHE_NAME with current build number
  try {
    const changelog = fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
    const m = changelog.match(/\[(\d+\.\d+\.\d+\.\d+)\]/);
    if (m) {
      const idx = swLines.findIndex(l => l.includes('const CACHE_NAME'));
      if (idx !== -1) {
        swLines[idx] = `const CACHE_NAME = 'echo-tape-${m[1]}';`;
      }
    }
  } catch (err) {
    console.error('Failed to read build number:', err.message);
  }
  const start = swLines.findIndex(l => l.includes("'episodes/"));
  if (start !== -1) {
    let end = start;
    while (end < swLines.length && /'episodes\//.test(swLines[end])) end++;
    const episodeFiles = fs.readdirSync(episodesDir)
      .filter(f => f.endsWith('.json') || f.endsWith('.js'))
      .sort();
    const newLines = episodeFiles.map(f => `      'episodes/${f}',`);
    swLines.splice(start, end - start, ...newLines);
    fs.writeFileSync(swPath, swLines.join('\n'));
    console.log('Updated sw.js with', episodeFiles.length, 'episode files');
  } else {
    console.error('Could not find episode block in sw.js');
  }
} catch (err) {
  console.error('Failed to update sw.js:', err);
}
