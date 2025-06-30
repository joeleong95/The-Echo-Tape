window.localEpisodes = window.localEpisodes || {};
window.localEpisodes["episode0"] = {
  "title": "Tutorial: Rocket League Warmup",
  "start": "scene-start",
  "scenes": [
    {
      "id": "scene-start",
      "html": "<h2 style='color:#ff00ff;'>TUTORIAL: THE WARMUP</h2>\n<div class='dialogue'><span class='character joe'>JOE:</span> Pass the controller, bro. Time to teach you how we roll in Rocket League.</div>\n<div class='dialogue'><span class='character newt'>NEWT:</span> Hold up, lemme spark this first.</div>\n<div class='choice-container'><p>The match begins. Do you...</p><button class='choice-btn' data-scene='scene-cheat-up'>Cheat up with a boost exploit</button><button class='choice-btn' data-scene='scene-defend'>Stay back and defend</button></div>"
    },
    {
      "id": "scene-cheat-up",
      "html": "<div class='dialogue'><span class='character joe'>JOE:</span> Ha! Classic move.</div>\n<div class='choice-container'><p>You rocket ahead, but a lag spike hits Newt. Do you...</p><button class='choice-btn' data-scene='scene-pass'>Pass him the ball anyway</button><button class='choice-btn' data-scene='scene-slow-down'>Slow down and wait</button></div>"
    },
    {
      "id": "scene-defend",
      "html": "<div class='dialogue'><span class='character newt'>NEWT:</span> Defensive strats, nice.</div>\n<div class='choice-container'><p>A lag spike freezes Joe in place. Do you...</p><button class='choice-btn' data-scene='scene-solo-score'>Go solo for the goal</button><button class='choice-btn' data-scene='scene-wait'>Wait for him to recover</button></div>"
    },
    {
      "id": "scene-pass",
      "html": "<div class='dialogue'><span class='character system'>SYSTEM:</span> The ball teleports through Newt's car. Oops.</div>\n<div class='choice-container'><p>The match devolves into laughter. Tutorial complete.</p><button class='choice-btn' data-scene='scene-end'>Wrap it up</button></div>"
    },
    {
      "id": "scene-slow-down",
      "html": "<div class='dialogue'><span class='character system'>SYSTEM:</span> You ease off and let the connection stabilise.</div>\n<div class='choice-container'><button class='choice-btn' data-scene='scene-end'>Finish the match</button></div>"
    },
    {
      "id": "scene-solo-score",
      "html": "<div class='dialogue'><span class='character system'>SYSTEM:</span> You break away for a solo shot.</div>\n<div class='choice-container'><button class='choice-btn' data-scene='scene-end'>Celebrate</button></div>"
    },
    {
      "id": "scene-wait",
      "html": "<div class='dialogue'><span class='character system'>SYSTEM:</span> You hang back until the lag clears.</div>\n<div class='choice-container'><button class='choice-btn' data-scene='scene-end'>Keep playing</button></div>"
    },
    {
      "id": "scene-end",
      "html": "<div class='dialogue'><span class='character joe'>JOE:</span> Not bad for a tutorial.</div>\n<div class='dialogue'><span class='character newt'>NEWT:</span> Let's fire up the real game.</div>\n<div class='choice-container'><button class='choice-btn' data-restart>Return to Menu</button></div>"
    }
  ]
};
