---
title: Vehicle Client Service
---

## Description
The `VehicleClientService` is the primary interface for players to interact with vehicles on the client. It acts as a bridge to the server's authoritative `VehicleService`, ensuring all critical actions (spawn, delete, mods) are synchronized and secure.

## Key Features

### 1. Server-Client Bridge
Methods like `createVehicle` and `deleteVehicle` don't execute locally; they send requests to the server and wait for a response, ensuring the server remains the source of truth.

### 2. State Synchronization
The service automatically listens for server events (`opencore:vehicle:modified`, `opencore:vehicle:repaired`) and applies the changes to the local entities.

## API Methods

### `createVehicle()`
Requests the server to spawn a vehicle. Returns a `Promise` with the result.

```ts
async createVehicle(options: Omit<VehicleCreateOptions, 'ownership'>): Promise<VehicleSpawnResult>
```

---

### `getClosestVehicle()`
Local helper to find the nearest vehicle handle.

---

### `getVehicleState()`
Reads custom metadata stored in the vehicle's **State Bag**.

---

### `repairVehicle()` / `setDoorsLocked()`
Sends requests to the server to modify the vehicle's condition or security.

## Example Usage

```ts
@Client.Controller()
export class VehicleMenuController {
  constructor(private readonly vehicleClient: VehicleClientService) {}

  async requestSpawn(model: string) {
    const result = await this.vehicleClient.createVehicle({
      model: model,
      position: GetEntityCoords(PlayerPedId(), true)
    });

    if (result.success) {
      console.log("Vehicle spawned with NetID:", result.networkId);
    }
  }
}
```

## Notes
- Use this service for any action that should be **synchronized** across players.
- For purely local/visual changes that don't need server authority, use the low-level `VehicleService` (Client).
