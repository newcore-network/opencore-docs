---
title: Client Decorators
---

## Class Decorators

| Decorator | Description | Details |
| --- | --- | --- |
| `@Client.Controller()` | Marks a class as a client-side controller for UI, input, and client events. | [Details](../decorators/client/controller.md) |

## Method Decorators

| Decorator | Arguments | Description | Details |
| --- | --- | --- | --- |
| `@Client.OnNet()` | `eventName: string` | Subscribes to a network event (server → client). | [Details](../decorators/client/on-net.md) |
| `@Client.OnRPC()` | `eventName: string` | Subscribes to an RPC call from the server. Returns a value. | [Details](../decorators/client/on-rpc.md) |
| `@Client.OnLibraryEvent()` | `libraryName: string, eventName: string` | Listens to client-side library domain events emitted through `library.emit(...)`. | [Details](../decorators/client/on-library-event.md) |
| `@Client.LocalEvent()` | `eventName: string` | Subscribes to a local (client-only) event for internal communication. | [Details](../decorators/client/local-event.md) |
| `@Client.GameEvent()` | `eventName: string` | Listens to GTA V native game events (damage, explosions, entity interactions). | [Details](../decorators/client/game-event.md) |
| `@Client.OnTick()` | — | Executes on every client tick. Avoid heavy computations to prevent FPS drops. | [Details](../decorators/client/on-tick.md) |
| `@Client.Interval()` | `ms: number` | Executes at a fixed time interval. Prefer over `OnTick` when possible. | [Details](../decorators/client/interval.md) |
| `@Client.Key()` | `key: string` | Binds the method to a keyboard key press. | [Details](../decorators/client/key.md) |
| `@Client.OnView()` | `callbackName: string` | Registers a NUI callback handler (bridge between UI and gameplay logic). | [Details](../decorators/client/on-view.md) |
| `@Client.Export()` | `exportName?: string` | Exposes the method as a FiveM client export. | [Details](../decorators/client/export.md) |
| `@Client.OnResourceStart()` | — | Runs when the resource starts. | [Details](../decorators/client/on-resource-start.md) |
| `@Client.OnResourceStop()` | — | Runs when the resource stops. | [Details](../decorators/client/on-resource-stop.md) |

## Design Notes

- Client controllers are **event-driven**, not request-driven.
- Prefer `@Client.Interval()` over `@Client.OnTick()` when possible to reduce CPU usage.
- `@Client.LocalEvent()` is the recommended way to communicate between client systems.
- `@Client.GameEvent()` is powerful but low-level — use it only when FiveM-native events are insufficient.
- NUI communication is explicit and isolated through `@Client.OnView()`.
