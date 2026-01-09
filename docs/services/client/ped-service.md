---
title: Ped Service
---

## Description
The `PedService` provides tools for spawning and managing non-player characters (NPCs). It handles model loading, relationship groups, and complex tasks like animations or combat attributes.

## API Methods

### `spawn()`
Asynchronously loads a model and creates an NPC.

```ts
async spawn(options: PedSpawnOptions): Promise<{ id: string; handle: number }>
```

---

### `playAnimation()`
Loads an animation dictionary and plays it on a ped. Supports blending and flags.

---

### `getClosest()` / `getNearby()`
Search utilities to find peds in the player's vicinity.

---

### `lookAtEntity()` / `walkTo()`
High-level task wrappers for AI behavior.

## Example Usage

```ts
@Client.Controller()
export class QuestController {
  constructor(private readonly pedService: PedService) {}

  async spawnQuestGiver() {
    const { handle } = await this.pedService.spawn({
      model: 'a_m_m_skater_01',
      position: { x: 50.0, y: -10.0, z: 70.0 },
      blockEvents: true // NPC won't flee from combat
    });

    this.pedService.playAnimation(handle, {
      dict: 'amb@world_human_leaning@male@wall@back@foot_up@idle_a',
      anim: 'idle_a'
    });
  }
}
```

## Notes
- Managed peds are tracked by the service for easy batch deletion via `deleteAll()`.
- Use `blockEvents: true` to prevent NPCs from reacting to ambient game events (like shots or crashes), which is standard for quest or shop NPCs.
