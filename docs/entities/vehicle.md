---
title: Vehicle Entity
---

## Description
The `Vehicle` entity represents a vehicle managed by the framework. Unlike a simple numeric handle, this entity provides a consistent interface for manipulating the vehicle and synchronizing its state.

## Key Properties

- `handle`: The native FiveM entity handle.
- `networkId`: The network ID for cross-client synchronization.
- `model`: The model hash or name.
- `owner`: The `Player` who owns the vehicle (if applicable).

## Methods

### State & Synchronization
- `setMods(mods: Partial<VehicleMods>)`: Stores visual modifications in state bags for client-side application.
- `setMetadata(key: string, value: any)` / `getMetadata<T>(key: string)`: Manages custom transient metadata synced with clients.
- `setOwnership(ownership: Partial<VehicleOwnership>)`: Updates owner information and syncs it via state bags.
- `serialize()`: Converts the entity to a plain object for cross-resource or network transfer.

### Physical Manipulation
- `getCoords()`: Returns a `Vector3` with the current position.
- `setRotation(rot: Vector3)`: Adjusts the vehicle's rotation.
- `teleport(position: Vector3, heading?: number)`: Instantly moves the vehicle to a new location.
- `setHeading(heading: number)`: Sets the vehicle's rotation heading.
- `delete()`: Safely deletes the vehicle from the server.

### Vehicle Status
- `setPlate(plate: string)`: Sets the license plate text (max 8 characters).
- `setColors(primary?: number, secondary?: number)`: Sets physical colors using server natives.
- `setFuel(level: number)` / `getFuel()`: Manages fuel levels (0-100), synced via metadata.
- `setDoorsLocked(locked: boolean)`: Toggles door lock status (native + state bag).
- `markForRepair()`: Sets a flag for clients to apply full repairs locally.
- `setRoutingBucket(bucket: number)`: Moves the vehicle to a different virtual dimension.

## Example Usage

```ts
@Server.Service()
export class VehicleManager {
  constructor(private readonly vehicleService: VehicleService) {}

  async spawnForPlayer(player: Server.Player, model: string) {
    const vehicle = await this.vehicleService.create({
      model: model,
      position: player.getCoords(),
      owner: player
    });

    console.log(`Vehicle ${vehicle.networkId} spawned for ${player.name}`);
  }
}
```

## Notes
Vehicle entities are primarily created and managed through the `VehicleService`. Manual instantiation is not recommended.
