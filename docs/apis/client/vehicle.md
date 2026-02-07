---
title: Vehicle API (Client)
---

## Description

The client-side vehicle API consists of two layers:

- **`VehicleClientService`** — High-level, server-synchronized operations (spawn, delete, mods).
- **`VehicleService` (Client)** — Low-level, direct handle manipulation (repair, fuel, local mods).

---

## VehicleClientService (Server-Synchronized)

Methods like `createVehicle` and `deleteVehicle` don't execute locally — they send requests to the server and wait for a response, ensuring the server remains the source of truth.

### API Methods

#### `createVehicle()`

Requests the server to spawn a vehicle. Returns a `Promise` with the result.

```ts
async createVehicle(options: Omit<VehicleCreateOptions, 'ownership'>): Promise<VehicleSpawnResult>
```

#### `getClosestVehicle()`

Local helper to find the nearest vehicle handle.

#### `getVehicleState()`

Reads custom metadata stored in the vehicle's **State Bag**.

#### `repairVehicle()` / `setDoorsLocked()`

Sends requests to the server to modify the vehicle's condition or security.

### Example

```ts
@Client.Controller()
export class VehicleMenuController {
  constructor(private readonly vehicleClient: VehicleClientService) {}

  async requestSpawn(model: string) {
    const result = await this.vehicleClient.createVehicle({
      model: model,
      position: GetEntityCoords(PlayerPedId(), true)
    })

    if (result.success) {
      console.log("Vehicle spawned with NetID:", result.networkId)
    }
  }
}
```

---

## VehicleService — Low-Level (Local)

Provides direct interaction with vehicle handles for immediate operations.

### API Methods

#### `spawn()`

Directly calls `CreateVehicle` (Client).

*Warning: Vehicles spawned this way are not managed by the server and may not synchronize correctly.*

#### `repair()`

Instantly fixes all damage, deformations, and engine health.

#### `setFuel()` / `getFuel()`

Wrappers for managing vehicle fuel levels (0-100).

#### `setMods()`

Applies a batch of modifications directly to a vehicle handle.

### Example

```ts
@Client.Controller()
export class MechanicController {
  constructor(private readonly vehicle: VehicleService) {}

  quickRepair() {
    const veh = this.vehicle.getCurrentVehicle()
    if (veh) {
      this.vehicle.repair(veh)
    }
  }
}
```

---

## When to use which?

| Need | Use |
| --- | --- |
| Spawn a vehicle that all players see | `VehicleClientService.createVehicle()` |
| Repair a vehicle you're sitting in | `VehicleService.repair()` |
| Read vehicle state bags | `VehicleClientService.getVehicleState()` |
| Set fuel locally | `VehicleService.setFuel()` |

- `VehicleClientService` works with **Network IDs** (synchronized).
- `VehicleService` works with **handles** (local).
