---
title: Vehicles
---

## Description

`Vehicles` is the server-side API for authoritative vehicle management in OpenCore.

It centralizes server-side spawning, registry/index operations, ownership/proximity checks, cleanup, and serialization.

## Key Concepts

### Server-Authoritative Spawning

Unlike standard FiveM scripts that spawn vehicles on the client, OpenCore uses `CreateVehicleServerSetter`. The server creates the entity directly, ensuring it exists even if the creating player crashes or leaves.

### Vehicle Registry

The API maintains an internal map of managed vehicles indexed by **networkId**.

## Injection

```ts
import { Server, Vehicles } from '@open-core/framework/server'

@Service()
export class FleetService {
  constructor(private readonly vehicles: Vehicles) {}
}
```

## API Methods

### `create()`

Spawns a vehicle on the server with specific options.

```ts
async create(options: VehicleCreateOptions): Promise<VehicleSpawnResult>
```

### `createForPlayer()`

Spawns a vehicle and assigns player ownership automatically. On success, emits a warp event to place the player in driver seat.

```ts
createForPlayer(clientID: number, options: VehicleCreateOptions): Promise<VehicleSpawnResult>
```

### Lookups and Lists

- `getByNetworkId(networkId)`
- `getByHandle(handle)`
- `getPlayerVehicles(clientID)`
- `getVehiclesInBucket(bucket)`
- `getAll()`
- `getCount()`

### Deletion and Cleanup

- `delete(networkId, requestedBy?)`
- `deletePlayerVehicles(clientID)`
- `cleanup()`

### Validation Helpers

- `validateOwnership(networkId, clientID)`
- `validateProximity(networkId, clientID, maxDistance?)`

### Serialization

- `serializeAll()`


---

## Return Shape

`VehicleSpawnResult` includes:

- `success: boolean`
- `networkId: number`
- `handle: number`
- `error?: string`

---

## Example

```ts
@Controller()
export class GarageController {
  constructor(private readonly vehicles: Vehicles) {}

  @OnNet('garage:spawn')
  async spawnVehicle(player: Player, model: string) {
    const pos = player.getPosition()

    const result = await this.vehicles.createForPlayer(player.clientID, {
      model,
      position: pos,
      plate: 'OPENCORE',
      persistent: true
    })

    if (!result.success) {
      player.send(`Failed to spawn: ${result.error ?? 'unknown error'}`, 'error')
      return
    }

    player.send(`Vehicle spawned with networkId ${result.networkId}`, 'success')
  }
}
```

## Notes

- `Vehicles` is the authoritative path for managed vehicle creation.
- Direct client-side spawning bypasses registry/security guarantees.
