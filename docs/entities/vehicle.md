---
title: Vehicle Entity
---

## Description

`Vehicle` is the runtime wrapper for a server-managed vehicle entity.

It extends `BaseEntity` and implements `Spatial` and `NativeHandle`, providing stable identity, ownership/mod metadata, routing bucket support, and helper methods for synchronization through entity state bags.

## Key Properties

- `handle` - native entity handle.
- `networkId` - network identifier for cross-client references.
- `model` / `modelHash` - resolved model identity.
- `ownership` - ownership descriptor (`temporary`, `player`, `shared`, `server`).
- `metadata` - runtime metadata snapshot.
- `mods` - server-tracked vehicle mod snapshot.
- `routingBucket` / `dimension` - virtual world value.
- `exists` - whether the underlying entity still exists.

## Methods

### State & Synchronization

- `setMods(mods)` - merge mod state and replicate.
- `setMetadata(key, value)` / `getMetadata<T>(key)`
- `setOwnership(ownership)` - merge and sync ownership data.
- `setFuel(level)` / `getFuel()`
- `setDoorsLocked(locked)`
- `markForRepair()`
- `serialize()`

### Physical Manipulation

- `getPosition()` / `setPosition(position)`
- `getHeading()` / `setHeading(heading)`
- `teleport(position, heading?)`
- `setRoutingBucket(bucket)` / `getRoutingBucket()`
- `delete()`

### Vehicle Status

- `setPlate(plate)` - truncated to 8 chars.
- `setColors(primary?, secondary?)`

## Notes

- Mutating operations are no-ops when `exists === false`.
- `Vehicle` instances are generally created by the `Vehicles` API (`create` / `createForPlayer`), not manual `new Vehicle(...)` calls.

## Example Usage

```ts
import { Server, Vehicles } from '@open-core/framework/server'

@Service()
export class VehicleManager {
  constructor(private readonly vehicles: Vehicles) {}

  async spawnForPlayer(player: Player, model: string) {
    const result = await this.vehicles.createForPlayer(player.clientID, {
      model,
      position: player.getPosition(),
      plate: 'OPENCORE',
      persistent: true,
    });

    if (!result.success) {
      player.send(`Failed to spawn vehicle: ${result.error ?? 'unknown error'}`, 'error')
      return
    }

    player.send(`Spawned vehicle networkId=${result.networkId}`, 'success')
  }
}
```
