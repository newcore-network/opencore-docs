---
title: Spawn Service
---

## Description
The `SpawnService` is one of the most critical services on the client. It manages the complete lifecycle of a player joining the server, from the initial connection to the final fade-in when the character is ready to play.

## Key Features

### 1. Robust Lifecycle Management
Spawning in FiveM is complex. The `SpawnService` handles:
- Waiting for the network session to be ready.
- Loading the player model.
- Ensuring the physical ped exists.
- Loading collisions at the spawn point (to prevent falling through the map).
- Resurrecting the local player cleanly.

### 2. Fade Transitions
The service automatically handles `DoScreenFadeOut` and `DoScreenFadeIn` during the spawn process, ensuring a professional "smooth" transition for the player.

## API Methods

### `spawn()`
Performs the initial spawn. This should typically only be called once when the player first joins or selects a character.

```ts
async spawn(position: Vector3, model: string, heading?: number, options?: SpawnOptions)
```

---

### `respawn()`
Used for resurrecting a dead player or moving them to a new location while maintaining their current model and state.

---

### `teleportTo()`
A safe teleportation method that ensures collisions are loaded at the destination before moving the ped.

---

### `waitUntilSpawned()`
A helper that allows other services or controllers to pause execution until the player has successfully completed their first spawn.

## Example Usage

```ts
@Client.Controller()
export class SessionController {
  constructor(private readonly spawnService: SpawnService) {}

  @Client.OnNet('core:client:spawn')
  async handleInitialSpawn(data: any) {
    await this.spawnService.spawn(data.pos, data.model, data.heading, {
      appearance: data.appearance
    });
    
    console.log('Player is now live in the world!');
  }
}
```

## Notes
- **Timeouts**: The service includes built-in timeouts for network, ped, and collision loading to prevent the client from hanging indefinitely if something goes wrong.
- **Appearance**: If an appearance object is provided, it uses `AppearanceService` to apply clothing and facial features automatically during the spawn.
