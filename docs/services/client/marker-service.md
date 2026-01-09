---
title: Marker Service
---

## Description
The `MarkerService` handles the rendering of 3D markers (arrows, cylinders, circles) in the game world. It includes a managed system that handles the per-frame `DrawMarker` calls automatically through an internal tick.

## API Methods

### `create()`
Registers a persistent marker that will be rendered every frame.

```ts
create(position: Vector3, options: MarkerOptions): string
```
**Options include:**
- `type`: Marker ID (0-43).
- `scale`: Vector3 size.
- `color`: RGBA object.
- `bobUpAndDown`: Vertical animation.
- `rotate`: Continuous rotation.

---

### `remove()` / `removeAll()`
Stops rendering and deletes markers from the managed registry.

---

### `drawOnce()`
Draws a marker for exactly one frame. Useful for logic already running inside a `@Client.OnTick()`.

## Example Usage

```ts
@Client.Controller()
export class ShopController {
  private markerId?: string;

  constructor(private readonly marker: MarkerService) {}

  @Client.OnResourceStart()
  init() {
    this.markerId = this.marker.create({ x: 100.0, y: 200.0, z: 30.0 }, {
      type: 1,
      color: { r: 0, g: 255, b: 0, a: 100 },
      bobUpAndDown: true
    });
  }
}
```

## Notes
- The service automatically starts/stops its internal tick based on whether there are active markers, optimizing performance.
- Markers created via `create()` are identified by a unique string ID.
