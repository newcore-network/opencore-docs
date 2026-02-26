---
title: NPC Entity
---

## Description

The `NPC` entity is the server-side runtime wrapper for a spawned ped.

It extends `BaseEntity` and implements `Spatial` and `NativeHandle`, giving you:

- Stable logical identity (`npcId`) plus native identity (`handle`, optional `netId`).
- Spatial control (`getPosition`, `setPosition`, `getHeading`, `setHeading`).
- Runtime state/metadata via `BaseEntity`.
- Health, armor, routing bucket, synchronized state bag, and serialization helpers.

`NPC` lifecycle orchestration (create, registry, deletion, cleanup) is handled by the `Npcs` API.

## Key Properties

- `npcId: string` - stable logical ID within OpenCore runtime.
- `netId?: number` - present when spawned as networked.
- `model: string` / `modelHash: number` - resolved model identity.
- `createdAt: number` - Unix timestamp in milliseconds.
- `persistent: boolean` - whether orphan mode was configured.
- `exists: boolean` - runtime existence check for the underlying entity.
- `dimension` - alias to routing bucket.

## Core Methods

### Spatial & Routing

- `getPosition()` / `setPosition(position)`
- `getHeading()` / `setHeading(heading)`
- `getRoutingBucket()` / `setRoutingBucket(bucket)`

### Native and Runtime State

- `getHandle()`
- `setSyncedState(key, value, replicated?)`
- `getSyncedState<T>(key)`

### Health & Combat

- `getHealth()` / `setHealth(health)`
- `getArmor()` / `setArmor(armor)`
- `kill()`
- `isAlive()`

### Lifecycle & Transport

- `delete()` - deletes the underlying ped entity.
- `serialize()` - returns `SerializedNpcData`.

## Notes

- Most mutating methods are safe no-ops when `exists === false`.
- Calling `npc.delete()` only removes the native entity; for full registry cleanup, use `Npcs.deleteById()` or related API methods.

## Example

```ts
import { Server, Npcs } from '@open-core/framework/server'

@Controller()
export class PatrolController {
  constructor(private readonly npcs: Npcs) {}

  @Command('npc_guard')
  async spawnGuard(player: Player) {
    const { result, npc } = await this.npcs.create({
      model: 's_m_m_security_01',
      position: player.getPosition(),
      heading: player.getHeading(),
      persistent: true,
      metadata: { role: 'guard' },
    })

    if (!result.success || !npc) {
      player.send(`NPC spawn failed: ${result.error ?? 'unknown error'}`, 'error')
      return
    }

    npc.setSyncedState('ai:state', 'idle')
  }
}
```
