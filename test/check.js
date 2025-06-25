const { execSync } = require('child_process');
const fs = require('fs');

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
if (missing) {
  console.error('Test failed');
  process.exit(1);
}
console.log('All checks passed');
