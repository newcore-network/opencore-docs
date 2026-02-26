---
title: Server Decorators
---

## Class Decorators

| Decorator | Description | Details |
| --- | --- | --- |
| `@Controller()` | Marks a class as a server-side controller. Entry point for commands, events, and handlers. | [Details](../decorators/server/controller.md) |
| `@Service()` | Marks a class as a reusable service (business logic). Singleton by default. | [Details](../decorators/server/service.md) |
| `@Bind()` | Registers a class in the DI container. For utilities, adapters, or low-level classes. Accepts `'singleton'` (default) or `'transient'`. | [Details](../decorators/server/bind.md) |
| `@Repo()` | Semantic alias for `@Bind()`. Intended for data access and persistence layers. | [Details](../decorators/server/repo.md) |

## Method Decorators

| Decorator | Arguments | Description | Details |
| --- | --- | --- | --- |
| `@Command()` | `{ command, usage?, schema? }` | Registers a chat/console command handler with optional Zod validation. First param is always `Player`. | [Details](../decorators/server/command.md) |
| `@OnNet()` | `eventName: string` | Subscribes to a network event (client → server). First param is always `Player`. | [Details](../decorators/server/on-net.md) |
| `@OnRPC()` | `eventName: string` | Subscribes to an RPC call. Returns a value to the caller. | [Details](../decorators/server/on-rpc.md) |
| `@OnTick()` | — | Executes on every server tick. Use for lightweight, high-frequency logic. | [Details](../decorators/server/on-tick.md) |
| `@OnFrameworkEvent()` | `eventName: string` | Listens to internal framework lifecycle events. | [Details](../decorators/server/on-framework-event.md) |
| `@OnLibraryEvent()` | `libraryName: string, eventName: string` | Listens to server-side library domain events emitted through `library.emit(...)`. | [Details](../decorators/server/on-library-event.md) |
| `@OnRuntimeEvent()` | `eventName: string` | Subscribes to native FiveM events (`playerJoining`, `playerDropped`, etc.). | [Details](../decorators/server/on-runtime-event.md) |
| `@RequiresState()` | `state: string` | Ensures the player has a specific state flag before execution. | [Details](../decorators/server/requires-state.md) |
| `@Throttle()` | `limit, windowMs` | Rate-limits the method per player or context. | [Details](../decorators/server/throttle.md) |
| `@Export()` | `exportName?: string` | Exposes the method as a FiveM export for inter-resource APIs. | [Details](../decorators/server/export.md) |
| `@Guard()` | `{ permission?, rank? }` | Applies access control before execution. | [Details](../decorators/server/guard.md) |
| `@Public()` | — | Marks the method as explicitly public, bypassing guards. | [Details](../decorators/server/public.md) |
| `@BinaryService()` | `serviceId: number` | Registers a binary protocol service handler. | [Details](../decorators/server/binary-service.md) |
| `@BinaryCall()` | `callId: number` | Registers a binary protocol call handler. | [Details](../decorators/server/binary-call.md) |
| `@BinaryEvent()` | `eventId: number` | Registers a binary protocol event handler. | [Details](../decorators/server/binary-event.md) |

## Execution Order

When multiple decorators are stacked on a method, they execute in this order:

1. **`@RequiresState()`** — State check
2. **`@Guard()`** — Permission/rank check
3. **`@Throttle()`** — Rate limit check
4. **Schema validation** — Zod schema (if defined in `@Command()`)
5. **Handler execution** — Your method runs
