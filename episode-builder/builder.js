const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

(async () => {
  const id = await ask('Episode ID (e.g. episode3): ');
  const title = await ask('Episode title: ');
  const scenes = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const sceneId = await ask('Scene ID (leave blank to finish): ');
    if (!sceneId) break;
    const html = await ask('Scene HTML: ');
    scenes.push({ id: sceneId, html });
  }
  let start = await ask('ID of the starting scene: ');
  if (!start && scenes[0]) start = scenes[0].id;
  if (!scenes.find(s => s.id === start) && scenes[0]) start = scenes[0].id;

  const episode = { title, start, scenes };
  const outPath = path.join(__dirname, '..', 'episodes', `${id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(episode, null, 2));
  console.log('Episode written to', outPath);
  rl.close();
})();
