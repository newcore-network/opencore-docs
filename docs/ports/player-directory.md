---
title: Player Directory
---

## Description
The `PlayerDirectoryPort` is the authoritative way to query information about players currently connected to the server. It provides a consistent interface to find players by their FiveM Client ID (source), Account ID, or to retrieve all active sessions.

This port is **highly recommended for gameplay logic** when you need to interact with other players (e.g., finding nearby players, getting a player's job, etc.).

## API Methods

### `getByClient()`
Returns the `Player` entity associated with a FiveM source ID.

```ts
abstract getByClient(clientID: number): Player | undefined
```

---

### `getAll()`
Returns an array of all `Player` entities currently on the server.

---

### `getMeta()` / `setMeta()`
Accesses **transient session metadata**. This is data that exists only while the player is connected and is not saved to the database (e.g., "is_carrying_object", "current_blip_id").

```ts
abstract getMeta<T>(clientID: number, key: string): Promise<T | undefined>
abstract setMeta(clientID: number, key: string, value: unknown): void
```

## Internal vs. Public Use

- **Public (Gameplay)**: Use `getByClient`, `getAll`, and `getMeta` to drive your resource's logic. It is the safest way to access player data across resources.
- **Internal (Framework)**: Metadata management (`setMeta`) is often used by other services to track state without polluting the database.

## Mode Behavior
- **CORE Mode**: Accesses the local session map directly (O(1) performance).
- **RESOURCE Mode**: Requests the data from the Core resource via exports.

## Example

```ts
@injectable()
class SecurityService {
  constructor(private directory: PlayerDirectoryPort) {}

  isPlayerOnline(source: number): boolean {
    // Useful for gameplay checks
    return this.directory.getByClient(source) !== undefined;
  }
}
```
