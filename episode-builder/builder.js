const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sceneTemplate = `<div class="dialogue">
  <span class="character narrator">NARRATOR:</span> Describe the scene...
</div>
<div class="choice-container">
  <button class="choice-btn" data-scene="next-scene">Continue</button>
</div>`;

function ask(question, defaultValue = '') {
  const prompt = defaultValue ? `${question} (${defaultValue}) ` : question;
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      const trimmed = answer.trim();
      resolve(trimmed || defaultValue);
    });
  });
}

function askHtml(sceneId) {
  console.log('\nHint: wrap dialogue in <div class="dialogue"> and use buttons with data-scene.');
  console.log('Press Enter to insert an example snippet.');
  return ask(`Scene HTML for "${sceneId}":`, sceneTemplate);
}

(async () => {
  console.log('Welcome to The Echo Tape Episode Builder!');
  console.log('For writing tips see ../docs/WRITING_GUIDE.md.');
  console.log('Use the example snippet or write your own HTML.');
  const id = await ask('Episode ID (e.g. episode3): ');
  const title = await ask('Episode title: ');
  const scenes = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const sceneId = await ask('Scene ID (leave blank to finish): ');
    if (!sceneId) break;
    const html = await askHtml(sceneId);
    scenes.push({ id: sceneId, html });
  }
  const options = scenes.map(s => s.id).join(', ');
  let start = await ask(`ID of the starting scene (${options}): `, scenes[0] ? scenes[0].id : '');
  if (!start && scenes[0]) start = scenes[0].id;
  if (!scenes.find(s => s.id === start) && scenes[0]) start = scenes[0].id;

  const episode = { title, start, scenes };
  const outPath = path.join(__dirname, '..', 'episodes', `${id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(episode, null, 2));
  console.log('Episode written to', outPath);
  rl.close();
})();
