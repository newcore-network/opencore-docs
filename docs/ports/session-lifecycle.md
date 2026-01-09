---
title: Player Session Lifecycle
---

## Description
The `PlayerSessionLifecyclePort` is an **internal framework port** responsible for managing the creation and destruction of player sessions.

**Warning**: This port should **never be used in gameplay resources**. It is exclusively for the Framework Core or specialized authentication resources that manage the low-level connection of players.

## API Methods

### `bind()`
Creates a new `Player` session and adds it to the internal registry. This is typically called during the initial connection handshake.

```ts
abstract bind(clientID: number, identifiers?: Identifiers): Player
```

---

### `unbind()`
Terminates a player session, removing them from the registry and freeing associated memory. This must be called when a player disconnects.

```ts
abstract unbind(clientID: number): void
```

## Internal Implementations

OpenCore provides two distinct implementations of this port depending on where the code is running:

### 1. PlayerService (Core Implementation)
Located in `services/core`, this is the **Authoritative Implementation**.
- **Mode**: `CORE` / `STANDALONE`.
- **Behavior**: Directly manages the `Map<number, Player>` in memory. It is responsible for creating the physical `Player` objects and injecting the necessary adapters (network, entity, etc.).

### 2. RemotePlayerService (Remote Implementation)
Located in `services/remote`, this is the **Proxy Implementation**.
- **Mode**: `RESOURCE`.
- **Behavior**: Delegates all operations to the `CORE` resource via exports. When you call `bind()` or `unbind()` from a gameplay resource, it transparently notifies the Core to perform the actual operation.

## Why this separation?
In FiveM, multiple resources cannot share raw memory objects easily. By using this Port system:
1.  **Uniform API**: You write code against the `PlayerSessionLifecyclePort` without knowing if you are in the Core or a remote resource.
2.  **State Consistency**: The framework ensures that there is only one "Source of Truth" for player sessions (the Core), while allowing other resources to interact with them as if they were local.

## Notes
- **Automatic Handling**: Most developers will never need to call these methods manually. The framework handles the lifecycle automatically via FiveM events (`playerJoining`, `playerDropped`).
- **Memory Safety**: `unbind()` is critical to prevent memory leaks in the Core resource.
