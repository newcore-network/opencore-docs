---
title: Entities
---

## Overview

In OpenCore, **Entities** are runtime representations of game objects (players, vehicles, NPCs, channels). Unlike raw handles, entities are rich objects that provide:

1. **State Management** via `BaseEntity` state flags and metadata.
2. **API Abstraction** through adapter-backed methods instead of direct native calls.
3. **Lifecycle Safety** using framework registries and cleanup flows.

## Core Entities

### [Base Entity Contracts](/docs/entities/base-entity)
Shared contracts used by runtime entities:

- `BaseEntity` for identity, state, metadata, and snapshots.
- `Spatial` for position/heading operations.
- `NativeHandle` for low-level handle interoperability.

### [Player](/docs/entities/player)
Represents a connected client with:

- Session identity (`clientID`, `accountID`, identifiers).
- Player communication (`emit`, `send`).
- Position/routing bucket, state flags, and metadata.

### [Vehicle](/docs/entities/vehicle)
Represents a server-managed spawned vehicle with:

- Stable `networkId` and native `handle`.
- Ownership/mod/metadata synchronization.
- Routing bucket and lifecycle helpers.

### [NPC](/docs/entities/npc)
Represents a server-side ped wrapper with:

- Stable logical ID plus native handle/netId.
- Spatial and combat controls.
- Synced state bag helpers and serialization.

---

## Architecture

Entities follow the **Adapters Pattern**. They avoid direct native calls and delegate to injected contracts (`IEntityServer`, `IPedServer`, `IVehicleServer`, etc.). This improves testability and keeps behavior consistent across runtime modes.
