---
title: Vehicle Modifications
---

## Description

The `VehicleModificationService` handles all visual and performance upgrades for vehicles. It is designed with **Security First** principles, ensuring that every modification is validated on the server before being broadcast to clients.

## Security Features

### Ownership Validation
Before applying any mod, the service verifies that the requesting player actually owns the vehicle or has "shared" access.

### Proximity Checks
The service ensures the player is within range (default 15.0 units) of the vehicle. This prevents "remote tuning" exploits.

### Value Constraints
All modification IDs (spoilers, engines, etc.) are clamped to valid ranges (-1 to 50) to prevent engine crashes or invalid state synchronization.

## API Methods

### `applyModifications()`

The primary method for batch-applying changes.

```ts
applyModifications(options: VehicleModificationOptions): boolean
```

### `setColors()`

Updates primary and secondary colors using standard GTA color IDs.

### `setNeon()`

Configures neon light states (Left, Right, Front, Back) and their RGB color.

### `resetModifications()`

Reverts a vehicle to its factory default state (removes all mods, resets colors to white/black).

---

## Example

```ts
@Server.Controller()
export class MechanicController {
  constructor(private readonly modService: VehicleModificationService) {}

  @Server.OnNet('mechanic:applyEngine')
  handleEngineUpgrade(player: Server.Player, networkId: number, level: number) {
    const success = this.modService.applyModifications({
      networkId,
      requestedBy: player.clientID,
      mods: {
        engine: level,
        turbo: true
      }
    })

    if (success) {
      // Logic for charging money...
    }
  }
}
```

## Notes

- Modifications are synchronized using the `opencore:vehicle:modified` network event.
- The service uses **State Bags** internally via the `Vehicle` entity to ensure persistence across sessions if the vehicle is saved.
- `windowTint`, `livery`, and `plateStyle` are also managed here.
