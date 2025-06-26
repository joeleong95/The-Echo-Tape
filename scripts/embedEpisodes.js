const fs = require('fs');
const path = require('path');

const episodesDir = path.join(__dirname, '..', 'episodes');

const files = fs.readdirSync(episodesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const jsonPath = path.join(episodesDir, file);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
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
