---
title: Blip Service
---

## Description
The `BlipService` manages map icons (blips) in the GTA V world. It provides a managed system that tracks blips by ID, allowing for easy updates and cleanup.

## API Methods

### `create()`
Creates a blip at a specific world coordinate.

```ts
create(position: Vector3, options: BlipOptions): string
```

### `createForEntity()`
Attaches a blip to an entity (Ped, Vehicle, or Object). The blip will follow the entity as it moves.

### `createForRadius()`
Creates a circular area blip on the map.

### `update()`
Updates the options (color, scale, label, etc.) of an existing blip without removing it.

### `setRoute()`
Draws a GPS route from the player's current position to the specified blip.

## Example Usage

```ts
@Client.Controller()
export class JobController {
  private destinationBlipId?: string;

  constructor(private readonly blipService: BlipService) {}

  startJob(pos: Vector3) {
    this.destinationBlipId = this.blipService.create(pos, {
      sprite: 1,
      color: 5,
      label: "Delivery Point",
      route: true
    });
  }

  finishJob() {
    if (this.destinationBlipId) {
      this.blipService.remove(this.destinationBlipId);
    }
  }
}
```

## Notes
- All created blips are stored in an internal registry for mass cleanup via `removeAll()`.
- Common options include `sprite` (icon ID), `color`, `scale`, and `shortRange`.
