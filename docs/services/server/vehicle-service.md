---
title: Vehicle Service
---

## Description
The `VehicleService` is the **authoritative manager** for all vehicle entities in OpenCore. It ensures that vehicle spawning is handled server-side to prevent common client-side exploits and maintain a reliable registry of every managed vehicle.

## Key Concepts

### Server-Authoritative Spawning
Unlike standard FiveM scripts that spawn vehicles on the client, OpenCore uses `CreateVehicleServerSetter`. This means the server creates the entity directly, ensuring it exists even if the creating player crashes or leaves.

### Vehicle Registry
The service maintains an internal map of all vehicles indexed by their **Network ID**. This allows any resource to retrieve a vehicle object and interact with its state reliably.

## API Methods

### `create()`
Spawns a vehicle on the server with specific options.

```ts
async create(options: VehicleCreateOptions): Promise<VehicleSpawnResult>
```
**Options include:**
- `model`: String name or hash.
- `position`: Vector3 coordinates.
- `plate`: (Optional) Custom license plate text.
- `owner`: (Optional) Assign ownership to a player or group.
- `locked`: (Optional) Initial door lock state.

---

### `createForPlayer()`
A specialized wrapper for `create()` that automatically assigns ownership to the player and warps them into the driver's seat upon spawning.

---

### `getByNetworkId()` / `getByHandle()`
Retrieves a managed `Vehicle` instance. This object provides methods to manipulate the vehicle (colors, mods, health) which are synchronized across all clients.

---

### `delete()`
Safely removes a vehicle from the world and the registry. It includes optional permission checks to ensure only the owner or an admin can delete it.

---

### `validateProximity()`
A security helper that checks if a player is physically near a vehicle. This should be used before allowing actions like "opening the trunk" or "hotwiring".

## Example Usage

```ts
@Server.Controller()
export class GarageController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Server.OnNet('garage:spawn')
  async spawnVehicle(player: Server.Player, model: string) {
    const pos = player.getPosition()
    
    const result = await this.vehicleService.createForPlayer(player.clientID, {
      model: model,
      position: pos,
      plate: "OPENCORE",
      persistent: true
    })

    if (!result.success) {
      console.error("Failed to spawn:", result.error)
    }
  }
}
```

## Security & Notes
- **Authority**: All vehicle creation **MUST** go through this service. Bypassing it with client-side natives will result in unmanaged entities that the framework cannot track.
- **Cleanup**: The service includes a `cleanup()` method that automatically removes orphaned registry entries if the physical entity is deleted by the engine.
- **Ownership**: The service tracks whether a vehicle is `temporary`, `player-owned`, or `shared`.
