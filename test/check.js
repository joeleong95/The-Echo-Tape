const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const requiredFiles = ['index.html', 'script.js', 'style.css'];
let missing = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    missing = true;
  }
}
try {
  execSync('node -c script.js', { stdio: 'inherit' });
} catch (err) {
  console.error('Syntax error in script.js');
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

  const jsPath = path.join(episodesDir, jsonFile.replace(/\.json$/, '.js'));
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
if (missing) {
  console.error('Test failed');
  process.exit(1);
}
console.log('All checks passed');
