---
title: Decorators & Metadata
---

## What is a Decorator?

A TypeScript decorator is a function that attaches behavior or metadata to classes, methods, or parameters. In OpenCore, decorators are the primary way to declare **runtime behavior**:

- `@Server.Controller()` → "this class is a controller"
- `@Server.OnNet('event:name')` → "this method handles a net event"
- `@Server.Command({ ... })` → "this method is a command"

Decorators describe **intent**. The framework turns that intent into runtime bindings during bootstrap.

---

## Why decorators?

Without decorators, most FiveM codebases drift into hidden globals, ad-hoc event registration, and duplicated validation. OpenCore decorators solve this by:

- Making entry points **explicit** (controllers)
- Centralizing binding into the **bootstrap phase**
- Making security and validation **declarative**

---

## When do decorators execute?

### 1. Decorator evaluation (module load time)

Decorators execute when the module is imported. If a module is never imported, its decorators never run and the framework cannot discover it.

### 2. Framework binding (bootstrap scan)

After decorators store metadata, the framework becomes "live" only after the bootstrap scan during `Server.init()` / `Client.init()`.

**Key rule**: If a controller is not imported before bootstrap scanning, it does not exist for the framework.

---

## Guarantees

Decorators provide a stable contract:

- **Consistent entry points** — handlers receive a `Server.Player` context where required
- **Centralized validation and security** — schemas and security decorators run before your logic
- **Explicit runtime wiring** — you can reason about behavior by reading the controller class

---

## Server Decorators

### Class Decorators

| Decorator | Description |
| --- | --- |
| `@Server.Controller()` | Marks a class as a server-side controller. Entry point for commands, events, and handlers. |
| `@Server.Service()` | Marks a class as a reusable service (business logic). Singleton by default. |
| `@Server.Bind()` | Registers a class in the DI container. For utilities, adapters, or low-level classes. |
| `@Server.Repo()` | Semantic alias for `@Server.Bind()`. Intended for data access layers. |

### Method Decorators

| Decorator | Description |
| --- | --- |
| `@Server.Command()` | Registers a chat/console command handler with argument parsing and validation. |
| `@Server.OnNet()` | Subscribes to a network event (client → server). |
| `@Server.OnTick()` | Executes on every server tick. Use for lightweight, high-frequency logic. |
| `@Server.OnFrameworkEvent()` | Listens to internal framework lifecycle events. |
| `@Server.OnRuntimeEvent()` | Subscribes to native FiveM events (`playerJoining`, `playerDropped`, etc.). |
| `@Server.RequiresState()` | Ensures the player is in a specific state before execution. |
| `@Server.Throttle()` | Rate-limits the method per player or context. |
| `@Server.Export()` | Exposes the method as a FiveM export for inter-resource APIs. |
| `@Server.Guard()` | Applies access control (permissions, roles, ranks) before execution. |
| `@Server.Public()` | Marks the method as explicitly public, bypassing guards. |

---

## Client Decorators

### Class Decorators

| Decorator | Description |
| --- | --- |
| `@Client.Controller()` | Marks a class as a client-side controller for UI, input, and client events. |

### Method Decorators

| Decorator | Description |
| --- | --- |
| `@Client.OnNet()` | Subscribes to a network event (server → client). |
| `@Client.LocalEvent()` | Subscribes to a local (client-only) event for internal communication. |
| `@Client.GameEvent()` | Listens to GTA V native game events (damage, explosions, entity interactions). |
| `@Client.OnTick()` | Executes on every client tick. Avoid heavy computations to prevent FPS drops. |
| `@Client.Interval()` | Executes at a fixed time interval (ms). Prefer over `OnTick` when possible. |
| `@Client.Key()` | Binds the method to a keyboard key press. |
| `@Client.OnView()` | Registers a NUI callback handler (bridge between UI and gameplay logic). |
| `@Client.Export()` | Exposes the method as a FiveM client export. |
| `@Client.OnResourceStart()` | Runs when the resource starts. |
| `@Client.OnResourceStop()` | Runs when the resource stops. |

---

## Design Notes

- **Server**: Controllers are request-driven (commands, events).
- **Client**: Controllers are event-driven (keys, ticks, NUI).
- Prefer `@Client.Interval()` over `@Client.OnTick()` when possible to reduce CPU usage.
- `@Client.LocalEvent()` is the recommended way to communicate between client systems.
- `@Client.GameEvent()` is powerful but low-level — use it only when FiveM-native events are insufficient.
