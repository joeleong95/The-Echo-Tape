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
  try {
    JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    console.error(`Invalid JSON in ${jsonFile}: ${err.message}`);
    missing = true;
  }

  const jsPath = path.join(episodesDir, jsonFile.replace(/\.json$/, '.js'));
  if (!fs.existsSync(jsPath)) {
    console.error(`Missing generated JS for ${jsonFile}`);
    missing = true;
  } else {
    try {
      execSync(`node -c "${jsPath}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Syntax error in ${jsPath}`);
      missing = true;
    }
  }
}
if (missing) {
  console.error('Test failed');
  process.exit(1);
}
console.log('All checks passed');
