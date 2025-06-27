// Simple CLI to preview episode scene flow and validate structure
const fs = require('fs');

function usage() {
  console.log('Usage: node scripts/previewEpisode.js <episode.json> [--dot]');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  usage();
}
const filePath = args[0];
const outputDot = args.includes('--dot');
let data;
try {
  data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error('Failed to read or parse', filePath + ':', err.message);
  process.exit(1);
}

if (!data || typeof data !== 'object' || !Array.isArray(data.scenes)) {
  console.error('Invalid episode format');
  process.exit(1);
}

const idSet = new Set();
for (const scene of data.scenes) {
  if (!scene.id) {
    console.error('Scene missing id');
    process.exit(1);
  }
  if (idSet.has(scene.id)) {
    console.error('Duplicate scene id', scene.id);
    process.exit(1);
  }
  idSet.add(scene.id);
}

if (!idSet.has(data.start)) {
  console.error('Start scene', data.start, 'not found');
  process.exit(1);
}

function extractLinks(html) {
  const links = [];
  const regex = /data-scene=['"]([^'"#]+)['"]/g;
  let m;
  while ((m = regex.exec(html))) {
    links.push(m[1]);
  }
  return links;
}

if (outputDot) {
  console.log('digraph episode {');
  for (const scene of data.scenes) {
    const links = extractLinks(scene.html || '');
    for (const target of links) {
      if (!idSet.has(target)) {
        console.warn(`// ${scene.id} -> missing ${target}`);
      }
      console.log(`  "${scene.id}" -> "${target}";`);
    }
    if (links.length === 0) {
      console.log(`  "${scene.id}";`);
    }
  }
  console.log('}');
  process.exit(0);
}

for (const scene of data.scenes) {
  const links = extractLinks(scene.html || '');
  const linkStr = links.length ? links.join(', ') : '(end)';
  console.log(`${scene.id} -> ${linkStr}`);
}
