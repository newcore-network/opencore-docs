---
title: Player Entity
---

## Description
The `Player` entity is the core of server-side interaction. It represents a connected client and encapsulates all session information, state, and communication capabilities.

## Key Properties

- `clientID`: The FiveM server ID (source).
- `accountID`: The persistent account identifier (only available after authentication).
- `name`: The player's FiveM display name.

## Methods

### Communication
- `emit(eventName: string, ...args: any[])`: Sends a net event directly to this specific player (client-side).
- `send(message: string, type?: 'chat' | 'error' | 'success' | 'warning')`: Sends a formatted private message to the player's chat.

### State & Metadata
- `setMeta(key: string, value: unknown)`: Stores arbitrary transient metadata for this session (e.g., 'job', 'is_escorted').
- `getMeta<T>(key: string)`: Retrieves metadata previously stored in the session.
- `addState(state: string)` / `removeState(state: string)`: Manages binary flag identifiers (e.g., 'dead', 'cuffed').
- `toggleState(state: string, force?: boolean)`: Toggles a state flag and returns the new status.
- `hasState(state: string)`: Checks if the player currently possesses a specific state flag.

### Physical & Lifecycle
- `getPosition()`: Returns the current `Vector3` coordinates of the player.
- `teleport(vector: Vector3)`: Requests the client to teleport via the spawner system.
- `setPosition(vector: Vector3)`: Sets the player position using the platform-agnostic API. (Force)
- `spawn(vector: Vector3, model?: string)`: Requests the client to spawn at a specific location with a optional model.
- `setRoutingBucket(bucket: number)`: Sets the player's virtual world (dimension).
- `getRoutingBucket`: Gets the current routing bucket (dimension).
- `kick(reason?: string)`: Disconnects the player from the server.

### Health & Combat
- `getHealth()` / `setHealth(value: number)`: Manages player ped health (0-200, 0 is dead).
- `getArmor()` / `setArmor(value: number)`: Manages player ped armor (0-100).
- `kill()`: Instantly kills the player.
- `isAlive()`: Checks if the player is currently alive.

## Example Usage

```ts
@Server.Command('heal')
handleHeal(player: Server.Player) {
  // Accessing entity properties
  console.log(`Healing player: ${player.name}`);
  
  // Setting transient state
  player.setMeta('last_heal', Date.now());
  
  // Communication
  player.emit('opencore:client:heal');
}
```

## Security Integration
The `Player` entity is internally linked with the `PrincipalPort` to resolve permissions and ranks, allowing it to be used directly in decorators like `@Server.Guard()`.
