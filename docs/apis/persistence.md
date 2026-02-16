---
title: Persistence
---

## Description

The `PlayerPersistenceService` manages the lifecycle of player data. It acts as a bridge between the framework's player entities and the data storage providers (SQL, NoSQL, or local files).

This service ensures that player progress is never lost by handling session loading, periodic auto-saves, and final saves upon disconnection.

## How it Works

### The Provider Pattern
The service itself doesn't know *how* to save to a database. Instead, it looks for a registered `PlayerPersistenceContract`. You can swap the storage engine by simply binding a different implementation to this contract.

### Session Lifecycle
- **On Join** — The service triggers `handleSessionLoad`, which fetches data from the provider and populates the `Server.Player` object.
- **During Gameplay** — If enabled, the service runs an **Auto-Save** timer for each player.
- **On Leave** — The service triggers `handleSessionSave`, ensuring the final state is persisted before the player's session is destroyed.

## Key Features

### Auto-Save Intervals
To prevent data loss during server crashes, the service can be configured to save player data at regular intervals (e.g., every 5 minutes). This is managed per-player to spread the database load.

### Bulk Saves
Provides a `saveAllPlayers()` method, typically called during server shutdown or manual administrative saves.

## Configuration

The service automatically detects the provider's configuration:
- `autoSaveEnabled`: boolean
- `autoSaveIntervalMs`: number (usually 300,000ms for 5 minutes)

## Notes

- **Automatic**: Most of the time, you won't call this service directly. The framework handles it during the `playerJoining` and `playerDropped` events.
- **Contracts**: To enable persistence, you must implement a class that fulfills the `PlayerPersistenceContract` and register it. See [Contracts](../core-concepts/contracts.md).
- **Logging**: Every save/load operation is logged under the `session` and `bootstrap` loggers for easy debugging.
