---
title: Entities
---

## Overview

In OpenCore, **Entities** are the runtime representations of the main game objects (Players, Vehicles, etc.). Unlike raw handles, entities are rich objects that provide:

1.  **State Management**: Transient and persistent state bags.
2.  **API Abstraction**: Methods that work regardless of the underlying game engine specifics.
3.  **Lifecycle Hooks**: Automatic cleanup and initialization.

## Core Entities

### [Player](/docs/entities/player)
The most important entity. It represents a connected client and handles:
- Authentication state (`accountID`).
- Client communication (`emit`, `trigger`).
- Metadata and transient states.
- Permission checks (via `Principal`).

### [Vehicle](/docs/entities/vehicle)
Represents a spawned vehicle in the world. It provides:
- Access to network IDs and handles.
- Modification synchronization.
- State management (fuel, engine status, etc.).

---

## Architecture

Entities follow the **Adapters Pattern**. They don't call native FiveM functions directly; instead, they use injected adapters. This makes them highly testable and allows the framework to swap behavior depending on the runtime context.
