---
title: Decorators & Metadata
---

## What is a Decorator?

A TypeScript decorator is a function that attaches behavior or metadata to classes, methods, or parameters. In OpenCore, decorators are the primary way to declare **runtime behavior**:

- `@Controller()` → "this class is a controller"
- `@OnNet('event:name')` → "this method handles a net event"
- `@Command({ ... })` → "this method is a command"

Decorators describe **intent**. The framework turns that intent into runtime bindings during bootstrap.

## Import Style

OpenCore supports both styles:

- **Direct imports** (common in framework internals and tests): `@Controller()`, `@OnNet()`, `@Command()`.
- **Namespace style** (still supported): `@Server.Controller()`, `@Client.OnNet()`, etc.

In this documentation, examples mostly use direct imports for brevity.

---

## Why decorators?

Without decorators, most multiplayer server codebases drift into hidden globals, ad-hoc event registration, and duplicated validation. OpenCore decorators solve this by:

- Making entry points **explicit** (controllers)
- Centralizing binding into the **bootstrap phase**
- Making security and validation **declarative**

---

## When do decorators execute?

### 1. Decorator evaluation (module load time)

Decorators execute when the module is imported. If a module is never imported, its decorators never run and the framework cannot discover it.

### 2. Framework binding (bootstrap scan)

After decorators store metadata, the framework becomes "live" only after the bootstrap scan during `init()` / `init()`.

**Key rule**: If a controller is not imported before bootstrap scanning, it does not exist for the framework.

---

## Guarantees

Decorators provide a stable contract:

- **Consistent entry points** — handlers receive a `Player` context where required
- **Centralized validation and security** — schemas and security decorators run before your logic
- **Explicit runtime wiring** — you can reason about behavior by reading the controller class

---

## Server Decorators

### Class Decorators

| Decorator | Description |
| --- | --- |
| `@Controller()` | Marks a class as a server-side controller. Entry point for commands, events, and handlers. |
| `@Service()` | Marks a class as a reusable service (business logic). Singleton by default. |
| `@Bind()` | Registers a class in the DI container. For utilities, adapters, or low-level classes. |
| `@Repo()` | Semantic alias for `@Bind()`. Intended for data access layers. |

### Method Decorators

| Decorator | Description |
| --- | --- |
| `@Command()` | Registers a chat/console command handler with argument parsing and validation. |
| `@OnNet()` | Subscribes to a network event (client → server). |
| `@OnTick()` | Executes on every server tick. Use for lightweight, high-frequency logic. |
| `@OnFrameworkEvent()` | Listens to internal framework lifecycle events. |
| `@OnRuntimeEvent()` | Subscribes to native FiveM events (`playerJoining`, `playerDropped`, etc.). |
| `@RequiresState()` | Ensures the player is in a specific state before execution. |
| `@Throttle()` | Rate-limits the method per player or context. |
| `@Export()` | Exposes the method as a FiveM export for inter-resource APIs. |
| `@Guard()` | Applies access control (permissions, roles, ranks) before execution. |
| `@Public()` | Marks the method as explicitly public, bypassing guards. |

---

## Client Decorators

### Class Decorators

| Decorator | Description |
| --- | --- |
| `@Controller()` | Marks a class as a client-side controller for UI, input, and client events. |

### Method Decorators

| Decorator | Description |
| --- | --- |
| `@OnNet()` | Subscribes to a network event (server → client). |
| `@LocalEvent()` | Subscribes to a local (client-only) event for internal communication. |
| `@OnGameEvent()` | Listens to GTA V native game events (damage, explosions, entity interactions). |
| `@OnTick()` | Executes on every client tick. Avoid heavy computations to prevent FPS drops. |
| `@Interval()` | Executes at a fixed time interval (ms). Prefer over `OnTick` when possible. |
| `@Key()` | Binds the method to a keyboard key press. |
| `@OnView()` | Registers a WebView callback handler (bridge between UI and gameplay logic). |
| `@Export()` | Exposes the method as a FiveM client export. |
| `@OnResourceStart()` | Runs when the resource starts. |
| `@OnResourceStop()` | Runs when the resource stops. |

---

## Design Notes

- **Server**: Controllers are request-driven (commands, events).
- **Client**: Controllers are event-driven (keys, ticks, WebView).
- Prefer `@Interval()` over `@OnTick()` when possible to reduce CPU usage.
- `@LocalEvent()` is the recommended way to communicate between client systems.
- `@OnGameEvent()` is powerful but low-level — use it only when FiveM-native events are insufficient.
