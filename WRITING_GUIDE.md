# Writing Guide

This project stores each episode's content in a JSON file located in the `episodes` directory. The JSON structure is designed to be modular so that each scene can be edited independently.

## JSON Structure

```json
{
  "start": "scene-start",         // ID of the first scene to display
  "scenes": [
    {
      "id": "scene-start",        // unique ID for the scene
      "html": "<p>Your HTML here</p>"   // inner HTML for the scene
    },
    {
      "id": "scene-next",
      "html": "<p>More HTML...</p>"
    }
  ]
}
```

- **start**: ID of the initial scene shown when the episode loads.
- **scenes**: An array of objects. Each object describes one scene.
  - **id**: A unique string used for navigation (`goToScene('scene-id')`).
  - **html**: The HTML markup that makes up the inside of the scene's `<div>` element. You can include dialogue, images, and buttons that call `goToScene()`.

## Tips for Writing

1. Keep each scene focused on a single moment or choice.
2. Use standard HTML elements in the `html` field. Buttons should call `goToScene('target-id')` to navigate.
3. Remember to escape quotes within the HTML string. You can use double quotes for the JSON string and single quotes inside your HTML, or vice versa.
4. Test your episode locally by placing the JSON file in the `episodes` folder and selecting it from the episode menu in the browser.
5. Avoid very long scenes. Breaking them into smaller ones makes the story easier to manage.

See `episodes/episode1.json` for a complete example.
