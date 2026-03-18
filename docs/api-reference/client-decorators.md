---
title: Client Decorators
---

## Class Decorators

| Decorator | Description | Details |
| --- | --- | --- |
| `@Controller()` | Marks a class as a client-side controller for UI, input, and client events. | [Details](../decorators/client/controller.md) |

## Method Decorators

| Decorator | Arguments | Description | Details |
| --- | --- | --- | --- |
| `@OnNet()` | `eventName: string` | Subscribes to a network event (server → client). | [Details](../decorators/client/on-net.md) |
| `@OnRPC()` | `eventName: string` | Subscribes to an RPC call from the server. Returns a value. | [Details](../decorators/client/on-rpc.md) |
| `@OnLibraryEvent()` | `libraryName: string, eventName: string` | Listens to client-side library domain events emitted through `library.emit(...)`. | [Details](../decorators/client/on-library-event.md) |
| `@LocalEvent()` | `eventName: string` | Subscribes to a local (client-only) event for internal communication. | [Details](../decorators/client/local-event.md) |
| `@OnGameEvent()` | `eventName: string` | Listens to GTA V native game events (damage, explosions, entity interactions). | [Details](../decorators/client/game-event.md) |
| `@OnTick()` | — | Executes on every client tick. Avoid heavy computations to prevent FPS drops. | [Details](../decorators/client/on-tick.md) |
| `@Interval()` | `ms: number` | Executes at a fixed time interval. Prefer over `OnTick` when possible. | [Details](../decorators/client/interval.md) |
| `@Key()` | `key: string` | Binds the method to a keyboard key press. | [Details](../decorators/client/key.md) |
| `@OnView()` | `callbackName: string` | Registers a WebView callback handler (bridge between UI and gameplay logic). | [Details](../decorators/client/on-view.md) |
| `@Export()` | `exportName?: string` | Exposes the method as a FiveM client export. | [Details](../decorators/client/export.md) |
| `@OnResourceStart()` | — | Runs when the resource starts. | [Details](../decorators/client/on-resource-start.md) |
| `@OnResourceStop()` | — | Runs when the resource stops. | [Details](../decorators/client/on-resource-stop.md) |

## Design Notes

- Client controllers are **event-driven**, not request-driven.
- Prefer `@Interval()` over `@OnTick()` when possible to reduce CPU usage.
- `@LocalEvent()` is the recommended way to communicate between client systems.
- `@OnGameEvent()` is powerful but low-level — use it only when FiveM-native events are insufficient.
- WebView communication is explicit and isolated through `@OnView()`.
