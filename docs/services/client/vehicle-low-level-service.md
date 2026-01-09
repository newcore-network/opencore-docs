---
title: Vehicle Service (Client)
---

## Description
The client-side `VehicleService` (not to be confused with `VehicleClientService`) provides low-level, direct interaction with vehicle handles. It is used for immediate operations like repairing, setting fuel, or applying mods to a local entity.

## API Methods

### `spawn()`
Directly calls `CreateVehicle` (Client). 
*Warning: Vehicles spawned this way are not managed by the server and may not synchronize correctly.*

---

### `repair()`
Instantly fixes all damage, deformations, and engine health.

---

### `setFuel()` / `getFuel()`
Wrappers for managing vehicle fuel levels (0-100).

---

### `setMods()`
Applies a batch of modifications (spoilers, engine, colors) directly to a vehicle handle.

## Example Usage

```ts
@Client.Controller()
export class MechanicController {
  constructor(private readonly vehicle: VehicleService) {}

  quickRepair() {
    const veh = this.vehicle.getCurrentVehicle();
    if (veh) {
      this.vehicle.repair(veh);
    }
  }
}
```

## Notes
- This service operates on **handles**, while the `VehicleClientService` primarily works with **Network IDs**.
- Use this service when you need to perform actions on a vehicle that you already have a local reference to.
