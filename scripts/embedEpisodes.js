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
