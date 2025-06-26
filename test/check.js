const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const requiredFiles = ['index.html', 'src/script.mjs', 'style.css'];
let missing = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    missing = true;
  }
}
try {
  execSync('node --check src/script.mjs', { stdio: 'inherit' });
} catch (err) {
  console.error('Syntax error in src/script.mjs');
  missing = true;
}

// Verify each episode JSON and its generated JS file
const episodesDir = path.join(__dirname, '..', 'episodes');
const episodeJsons = fs.readdirSync(episodesDir).filter(f => f.endsWith('.json'));
for (const jsonFile of episodeJsons) {
  const jsonPath = path.join(episodesDir, jsonFile);
  let jsonData;
  try {
    jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    console.error(`Invalid JSON in ${jsonFile}: ${err.message}`);
    missing = true;
    continue;
  }

  if (!Array.isArray(jsonData.scenes)) {
    console.error(`No scenes array in ${jsonFile}`);
    missing = true;
    continue;
  }

  // Validate unique scene IDs and collect them
  const sceneIds = new Set();
  for (const scene of jsonData.scenes) {
    if (!scene.id) {
      console.error(`Scene missing id in ${jsonFile}`);
      missing = true;
      continue;
    }
    if (sceneIds.has(scene.id)) {
      console.error(`Duplicate scene id ${scene.id} in ${jsonFile}`);
      missing = true;
    }
    sceneIds.add(scene.id);
  }

  if (!sceneIds.has(jsonData.start)) {
    console.error(`Start scene '${jsonData.start}' not found in ${jsonFile}`);
    missing = true;
  }

  const sceneRegex = /data-scene=["']([^"']+)["']/g;
  for (const scene of jsonData.scenes) {
    const html = scene.html || '';
    let m;
    while ((m = sceneRegex.exec(html))) {
      const target = m[1];
      if (!sceneIds.has(target)) {
        console.error(`${jsonFile} scene '${scene.id}' links to missing scene '${target}'`);
        missing = true;
      }
    }

    const setStateRegex = /data-set-state=(['"])(.*?)\1/g;
    const showIfRegex = /data-show-if=(['"])(.*?)\1/g;

    while ((m = setStateRegex.exec(html))) {
      try {
        JSON.parse(m[2]);
      } catch (err) {
        console.error(`${jsonFile} scene '${scene.id}' has invalid data-set-state: ${err.message}`);
        missing = true;
      }
    }

    while ((m = showIfRegex.exec(html))) {
      try {
        JSON.parse(m[2]);
      } catch (err) {
        console.error(`${jsonFile} scene '${scene.id}' has invalid data-show-if: ${err.message}`);
        missing = true;
      }
    }
  }

  const jsPath = path.join(__dirname, "..", "dist", "episodes", jsonFile.replace(/.json$/, ".js"));
  const name = path.basename(jsonFile, '.json');
  if (!fs.existsSync(jsPath)) {
    console.error(`Missing generated JS for ${jsonFile}`);
    missing = true;
  } else {
    let jsContent;
    try {
      execSync(`node -c "${jsPath}"`, { stdio: 'inherit' });
      jsContent = fs.readFileSync(jsPath, 'utf8');
    } catch (err) {
      console.error(`Syntax error in ${jsPath}`);
      missing = true;
      continue;
    }

    const match = jsContent.trim().match(
      /window\.localEpisodes\s*=\s*window\.localEpisodes\s*\|\|\s*\{};\s*window\.localEpisodes\["([^"]+)"\]\s*=\s*(\{[\s\S]*?\});?\s*$/
    );
    if (!match) {
      console.error(`Unexpected format in ${jsPath}`);
      missing = true;
      continue;
    }
    const jsName = match[1];
    let jsObj;
    try {
      jsObj = JSON.parse(match[2]);
    } catch (err) {
      console.error(`Invalid JSON object in ${jsPath}: ${err.message}`);
      missing = true;
      continue;
    }

    if (jsName !== name || JSON.stringify(jsObj) !== JSON.stringify(jsonData)) {
      console.error(`${jsPath} does not match ${jsonFile}`);
      missing = true;
    }
  }
}

// Ensure service worker caches all assets
const { spawnSync } = require('child_process');
const swPath = path.join(__dirname, '..', 'dist', 'sw.js');
try {
  const result = spawnSync('node', [path.join(__dirname, '..', 'scripts', 'embedEpisodes.js')], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error('embedEpisodes.js failed');
    missing = true;
  }

  const swContent = fs.readFileSync(swPath, 'utf8');
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const expectedCacheLine = `const CACHE_NAME = 'echo-tape-${pkg.version}'`;
  if (!swContent.includes(expectedCacheLine)) {
    console.error(`CACHE_NAME not updated to ${pkg.version}`);
    missing = true;
  }
  const audioDir = path.join(__dirname, '..', 'audio');
  const imagesDir = path.join(__dirname, '..', 'images');
  const assets = [
    '/',
    'index.html',
    'style.css',
    'src/script.mjs',
    'src/state.mjs',
    'src/audio.mjs',
    'src/ui.mjs',
    'src/dompurify.mjs',
    ...fs.readdirSync(episodesDir).filter(f => f.endsWith(".json")).map(f => `episodes/${f}`),
    ...fs.readdirSync(path.join(__dirname, "..", "dist", "episodes")).filter(f => f.endsWith(".js")).map(f => `dist/episodes/${f}`),
    'dist/episodes/manifest.json',
    ...fs.readdirSync(audioDir).map(f => `audio/${f}`),
    ...fs.readdirSync(imagesDir).map(f => `images/${f}`)
  ];
  for (const file of assets) {
    if (!swContent.includes(`'${file}'`)) {
      console.error(`sw.js missing ${file} in cache list`);
      missing = true;
    }
  }
} catch (err) {
  console.error('Unable to verify sw.js:', err.message);
  missing = true;
}

// Ensure embedEpisodes.js handles invalid JSON
try {
  require('./embedScript.test.js');
} catch (err) {
  console.error(err);
  missing = true;
}

// Run additional runtime tests
try {
  require('./runtime.test.js');
} catch (err) {
  console.error(err);
  missing = true;
}
if (missing) {
  console.error('Test failed');
  process.exit(1);
}
console.log('All checks passed');
