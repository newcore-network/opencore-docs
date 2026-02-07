---
title: Players API (Server)
---

## Description

The `Players` API is the authoritative way to query information about players currently connected to the server. It provides a consistent interface to find players by their FiveM Client ID (source), Account ID, or to retrieve all active sessions.

Inject it into any controller or service to interact with player data.

## API Methods

### `getByClient()`

Returns the `Player` entity associated with a FiveM source ID.

```ts
getByClient(clientID: number): Player | undefined
```

### `getAll()`

Returns an array of all `Player` entities currently on the server.

### `getMeta()` / `setMeta()`

Accesses **transient session metadata**. This is data that exists only while the player is connected and is not saved to the database (e.g., `is_carrying_object`, `current_blip_id`).

```ts
getMeta<T>(clientID: number, key: string): Promise<T | undefined>
setMeta(clientID: number, key: string, value: unknown): void
```

---

## Example

```ts
@Server.Controller()
export class OnlineController {
  constructor(private readonly players: Players) {}

  @Server.Command('online')
  checkOnline(player: Server.Player) {
    const total = this.players.getAll().length
    player.send(`Players online: ${total}`, 'chat')
  }

  isPlayerOnline(source: number): boolean {
    return this.players.getByClient(source) !== undefined
  }
}
```

## Notes

- **Cross-resource**: This API works transparently across resources. In CORE mode it accesses the local session map directly (O(1)). In RESOURCE mode it requests data from the Core via exports.
- Use `getByClient`, `getAll`, and `getMeta` for gameplay logic. It is the safest way to access player data across resources.
