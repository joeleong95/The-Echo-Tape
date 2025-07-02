# Writing Guide

This project keeps the story for each episode in a single JSON file under the
`episodes` folder. You don't need to know JavaScript to write an episode.
Think of the JSON file as a simple list of scenes. Each scene contains the text
and buttons the player will see.

## JSON Structure

```json
{
  "title": "Episode Name",        // shown in the episode menu
  "start": "scene-start",        // ID of the first scene to display
  "scenes": [
    {
      "id": "scene-start",       // unique ID for the scene
      "html": "<p>Your HTML here</p>"  // inner HTML for the scene
    },
    {
      "id": "scene-next",
      "html": "<p>More HTML...</p>"
    }
  ]
}
```

* **title** – the text displayed in the episode selection screen.
* **start** – the ID of the first scene to show when the episode begins.
* **scenes** – a list of scene objects. Each scene contains:
  * **id** – a unique name for the scene. Use short, descriptive words (e.g. `alley-start`).
  * **html** – the text and choices written in simple HTML. Use paragraphs
    (`<p>`), headings (`<h2>`), and buttons. Buttons use `data-scene="next-id"`
    to link to another scene.
  * **showIf** – optional state conditions. If provided, the scene only appears
    when every key/value pair matches the current game state.

See [EPISODE_SCHEMA.md](EPISODE_SCHEMA.md) for a complete description of the
required fields.

## Tips for Writing

1. **Write one moment per scene.** Short scenes keep the pacing quick and make
   it easier to add branches later.
2. **Use plain HTML for formatting.** Stick with paragraphs and headings. For a
   choice, add a button like:

    ```html
    <button class="choice-btn" data-scene="next-id">Go forward</button>
    ```

3. **Keep quotes simple.** The JSON file itself uses double quotes, so prefer
   single quotes inside the HTML when needed.
4. **Test locally.** Drop your JSON file in the `episodes` folder and open
   `index.html` in a browser. Choose your episode from the menu to try it out.
5. **Break up long passages.** It's easier for readers to digest short chunks
   with clear choices.
6. **Use the built‑in styles.** Wrap dialogue in `<div class="dialogue">` and
   apply the `choice-btn` class to your buttons so they match the game’s look.
7. **Hide options based on state.** Inside your HTML you can add
   `data-show-if='{ "stateKey": true }'` to a button. The button will only
   appear when the specified state values match.
8. **Unlock case file tabs.** `.case-tab-button` elements also respect
   `data-show-if`, letting you reveal new tabs when players uncover clues.

See `episodes/episode1.json` for a complete example.

## Building and Testing

After saving changes to a JSON file, run:

```
npm run build-episodes
```

This converts every `.json` file in the `episodes` folder into a matching `.js` file that the game loads. Commit the generated `.js` alongside your JSON.

Finally, run the tests to catch syntax errors or missing scenes:

```
npm test
```

## Previewing Episode Flow

To visualize how scenes connect, run:

```
npm run preview-episode -- episodes/episode1.json
```

Replace the path with your episode file. The command prints each scene and the IDs it links to. Add `--dot` to output Graphviz format for drawing a flow chart.
