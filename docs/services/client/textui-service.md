---
title: Text UI Service
---

## Description
The `TextUIService` handles rendering text both on the screen (2D) and attached to world coordinates (3D). It is ideal for interaction prompts or floating labels above objects.

## API Methods

### `show()` / `hide()`
Displays/hides a persistent text prompt at the bottom-right of the screen.

```ts
show(text: string, options?: TextUIOptions)
```

---

### `drawText3D()`
Renders text at a world coordinate. The service automatically calculates screen projection and applies distance-based scaling.

```ts
drawText3D(position: Vector3, text: string, options?: Text3DOptions)
```

## Example Usage

```ts
@Client.Controller()
export class InteractionController {
  constructor(private readonly textUI: TextUIService) {}

  @Client.OnTick()
  renderLabels() {
    this.textUI.drawText3D({ x: 1.0, y: 2.0, z: 3.0 }, "[E] Open Trunk", {
      background: true
    });
  }
}
```

## Notes
- `drawText3D` must be called every frame (inside a tick) to remain visible.
- `show()` is persistent and managed by an internal service tick until `hide()` is called.
- Scaling in 3D is automatically adjusted so the text remains readable as the camera moves.
