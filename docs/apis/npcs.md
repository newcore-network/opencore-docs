---
title: Npcs API
---

## Description

`Npcs` is the server-side API responsible for full NPC lifecycle management:

- Spawn and registration
- Lookup by `id`, `handle`, and `netId`
- Spatial queries
- Deletion and orphan cleanup
- Serialization for transfer/debug flows

Use this API instead of raw natives when creating and managing peds in gameplay systems.

## Injection

```ts
import { Service, Npcs } from '@open-core/framework/server'

@Service()
export class AiService {
  constructor(private readonly npcs: Npcs) {}
}
```

## Main Methods

### `create(options)`

Creates and registers one NPC.

```ts
create(options: NpcSpawnOptions): Promise<{ result: NpcSpawnResult; npc?: NPC }>
```

Behavior highlights:

- Generates UUID when `options.id` is omitted.
- Rejects duplicated `npcId`.
- Resolves model hash from model string/number.
- Waits for entity existence before success.
- Applies routing bucket, persistence/orphan mode, and metadata.
- Indexes by `id`, `handle`, and optional `netId`.

### `createMany(options[])`

Creates multiple NPCs sequentially (predictable load/side effects).

### Lookups

- `getById(id: string)`
- `getByHandle(handle: number)`
- `getByNetId(netId: number)`
- `getAll()`
- `count()`
- `exists(id: string)`

### Queries

- `getInRoutingBucket(bucket: number)`
- `findNear(position: Vector3, radius: number, bucket?: number)`

`findNear` skips entities that no longer exist and uses squared distance for efficiency.

### Deletion & Cleanup

- `deleteById(id: string)`
- `deleteByHandle(handle: number)`
- `deleteByNetId(netId: number)`
- `deleteAll()`
- `cleanupOrphans()`

### Serialization

- `serializeAll(): SerializedNpcData[]`

## Example

```ts
import { Npcs, Controller, Command, Player } from '@open-core/framework/server'

@Controller()
export class NpcAdminController {
  constructor(private readonly npcs: Npcs) {}

  @Command('npc_cleanup')
  cleanup(player: Player) {
    const cleaned = this.npcs.cleanupOrphans()
    player.send(`Cleaned ${cleaned} orphan NPC registry entries`, 'success')
  }

  @Command('npc_near')
  nearby(player: Player) {
    const found = this.npcs.findNear(player.getPosition(), 25, player.dimension)
    player.send(`NPCs near you: ${found.length}`, 'chat')
  }
}
```
