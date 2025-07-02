# Episode JSON Schema

Every file in the `episodes/` directory describes a single episode. The format is intentionally simple so writers can work without JavaScript knowledge. Each episode JSON must include the following fields:

```json
{
  "title": "Episode Name",
  "start": "scene-id",
  "scenes": [
    {
      "id": "scene-id",
      "html": "<p>Scene HTML</p>",
      "showIf": { "flag": true } // optional
    }
  ]
}
```

## Field reference

- **title** – Human readable name shown in the episode menu.
- **start** – The ID of the first scene to display when the episode begins.
- **scenes** – Array of scene objects. Each scene must contain:
  - **id** – Unique identifier for the scene.
  - **html** – Inner HTML that defines the text and choices.
  - **showIf** – Optional object of state keys and expected values. The scene only appears when all conditions match.

Buttons in the HTML use the attribute `data-scene="next-id"` to link to another scene. The build and test scripts verify that every referenced scene exists.
