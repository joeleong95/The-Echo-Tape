window.localEpisodes = window.localEpisodes || {};
window.localEpisodes["episode2"] = {
  "title": "Episode 2 - Coming Soon",
  "start": "scene-doorway",
  "scenes": [
    {
      "id": "scene-doorway",
      "html": "<h2 style='color:#ff00ff;'>EPISODE 2: THROUGH THE DOOR</h2>\n<div class='dialogue'><span class='character joe'>JOE:</span> Here goes nothing...</div>\n<div class='choice-container'>\n  <button class='choice-btn' data-show-if='{\"finalChoice\":\"play\"}' data-scene='scene-play'>Recall pressing play</button>\n  <button class='choice-btn' data-show-if='{\"finalChoice\":\"question\"}' data-scene='scene-question'>Keep questioning</button>\n  <button class='choice-btn' data-show-if='{\"finalChoice\":\"communicate\"}' data-scene='scene-communicate'>Listen for a reply</button>\n  <button class='choice-btn' data-show-if='{\"finalChoice\":\"destroy\"}' data-scene='scene-destroy'>Move on without the tape</button>\n</div>\n"
    },
    {
      "id": "scene-lane",
      "html": "<div class='dialogue'><span class='character newt'>NEWT:</span> It's quieter than I expected.</div>\n<div class='choice-container'><button class='choice-btn' data-scene='scene-mystery'>Follow the faint music</button><button class='choice-btn' data-restart>Run back</button></div>"
    },
    {
      "id": "scene-mystery",
      "html": "<div class='dialogue'><span class='character system'>SYSTEM:</span> The lane twists impossibly, looping back on itself. A sign on a lamp post points in all directions at once.</div>\n<div class='choice-container'><p>TO BE CONTINUED...</p><button class='choice-btn' data-restart>Return to title</button></div>"
    },
    {
      "id": "scene-play",
      "html": "<div class='dialogue'>The memory of pressing play still rings in your ears.</div><div class='choice-container'><button class='choice-btn' data-scene='scene-lane'>Step into Larkhill Lane</button></div>"
    },
    {
      "id": "scene-question",
      "html": "<div class='dialogue'>Every question echoes as you approach the lane.</div><div class='choice-container'><button class='choice-btn' data-scene='scene-lane'>Step into Larkhill Lane</button></div>"
    },
    {
      "id": "scene-communicate",
      "html": "<div class='dialogue'>The tape remains silent, but you feel it listening.</div><div class='choice-container'><button class='choice-btn' data-scene='scene-lane'>Step into Larkhill Lane</button></div>"
    },
    {
      "id": "scene-destroy",
      "html": "<div class='dialogue'>Broken plastic crunches underfoot as you move on.</div><div class='choice-container'><button class='choice-btn' data-scene='scene-lane'>Step into Larkhill Lane</button></div>"
    }
  ]
};
