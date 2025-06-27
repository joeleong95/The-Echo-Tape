const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const episodesDir = path.join(__dirname, '..', 'episodes');
const audioDir = path.join(__dirname, '..', 'audio');
const imagesDir = path.join(__dirname, '..', 'images');

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
  const jsPath = path.join(__dirname, '..', 'dist', 'episodes', `${name}.js`);
  const jsContent =
    'window.localEpisodes = window.localEpisodes || {};' +
    `\nwindow.localEpisodes[${JSON.stringify(name)}] = ` +
    JSON.stringify(jsonData, null, 2) + ';\n';
  fs.writeFileSync(jsPath, jsContent);
});

// Write episode manifest for dynamic loading
const manifest = files.map(f => path.basename(f, '.json')).sort();
const manifestPath = path.join(__dirname, '..', 'dist', 'episodes', 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Wrote manifest with', manifest.length, 'episodes');

console.log('Embedded', files.length, 'episodes');

// Update sw.js cache list with assets from episodes, audio, and images
try {
  const swPath = path.join(__dirname, '..', 'dist', 'sw.js');
  const swLines = fs.readFileSync(swPath, 'utf8').split(/\r?\n/);

  // Update CACHE_NAME with version and asset hash from package.json
  let version = 'dev';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    version = pkg.version || 'dev';
  } catch (err) {
    console.error('Failed to read package.json version:', err.message);
  }

  const start = swLines.findIndex(l => l.includes('ASSETS_START'));
  const end = swLines.findIndex(l => l.includes('ASSETS_END'));

  if (start !== -1 && end !== -1 && end > start) {
    const rootAssets = [
      '/',
      'index.html',
      'style.css',
      'src/script.mjs',
      'src/state.mjs',
      'src/audio.mjs',
      'src/ui.mjs',
      'src/sceneNavigation.mjs',
      'src/dompurify.mjs'
    ];

    const episodeAssets = fs.readdirSync(episodesDir)
      .filter(f => f.endsWith(".json"))
      .sort()
      .map(f => `episodes/${f}`);
    const distEpisodesDir = path.join(__dirname, '..', 'dist', 'episodes');
    const episodeJsAssets = fs.readdirSync(distEpisodesDir)
      .filter(f => f.endsWith('.js'))
      .sort()
      .map(f => `dist/episodes/${f}`);
    const manifestAsset = ['dist/episodes/manifest.json'];
    const audioAssets = fs.readdirSync(audioDir).sort().map(f => `audio/${f}`);
    const imageAssets = fs.readdirSync(imagesDir).sort().map(f => `images/${f}`);

    const assets = [...rootAssets, ...episodeAssets, ...episodeJsAssets, ...manifestAsset, ...audioAssets, ...imageAssets];
    const newLines = assets.map(a => `      '${a}',`);
    swLines.splice(start + 1, end - start - 1, ...newLines);

    // Compute a fingerprint of asset paths and modification times
    const assetData = assets.map(a => {
      const fp = path.join(__dirname, '..', a);
      try {
        const stat = fs.statSync(fp);
        return `${a}:${stat.mtimeMs}`;
      } catch {
        return a;
      }
    });
    const hash = crypto.createHash('sha256').update(assetData.join('|')).digest('hex').slice(0, 8);

    const cacheIdx = swLines.findIndex(l => l.includes('const CACHE_NAME'));
    if (cacheIdx !== -1) {
      swLines[cacheIdx] = `const CACHE_NAME = 'echo-tape-${version}-${hash}';`;
    }

    fs.writeFileSync(swPath, swLines.join('\n'));
    console.log('Updated sw.js with', assets.length, 'assets');
  } else {
    console.error('Could not find asset block in sw.js');
  }
} catch (err) {
  console.error('Failed to update sw.js:', err);
}
