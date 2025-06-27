window.localEpisodes = window.localEpisodes || {};
window.localEpisodes["episode2"] = {
  "start": "scene-doorway",
  "scenes": [
    {
      "id": "scene-doorway",
      "html": "<h2 style='color:#ff00ff;'>EPISODE 2: THROUGH THE DOOR</h2>\n<div class='dialogue'><span class='character joe'>JOE:</span> Here goes nothing...</div>\n<div class='choice-container'><button class='choice-btn' data-scene='scene-lane'>Step into Larkhill Lane</button></div>"
    },
    {
      "id": "scene-lane",
      "html": "<div class='dialogue'><span class='character newt'>NEWT:</span> It's quieter than I expected.</div>\n<div class='choice-container'><button class='choice-btn' data-scene='scene-mystery'>Follow the faint music</button><button class='choice-btn' data-restart>Run back</button></div>"
    },
    {
      "id": "scene-mystery",
      "html": "<div class='dialogue'><span class='character system'>SYSTEM:</span> The lane twists impossibly, looping back on itself. A sign on a lamp post points in all directions at once.</div>\n<div class='choice-container'><p>TO BE CONTINUED...</p><button class='choice-btn' data-restart>Return to title</button></div>"
    }
  ]
};
