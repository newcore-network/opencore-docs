---
title: Server Decorators
---

## Class Decorators

| Decorator | Description | Details |
| --- | --- | --- |
| `@Server.Controller()` | Marks a class as a server-side controller. Entry point for commands, events, and handlers. | [Details](../decorators/server/controller.md) |
| `@Server.Service()` | Marks a class as a reusable service (business logic). Singleton by default. | [Details](../decorators/server/service.md) |
| `@Server.Bind()` | Registers a class in the DI container. For utilities, adapters, or low-level classes. Accepts `'singleton'` (default) or `'transient'`. | [Details](../decorators/server/bind.md) |
| `@Server.Repo()` | Semantic alias for `@Server.Bind()`. Intended for data access and persistence layers. | [Details](../decorators/server/repo.md) |

## Method Decorators

| Decorator | Arguments | Description | Details |
| --- | --- | --- | --- |
| `@Server.Command()` | `{ command, usage?, schema? }` | Registers a chat/console command handler with optional Zod validation. First param is always `Server.Player`. | [Details](../decorators/server/command.md) |
| `@Server.OnNet()` | `eventName: string` | Subscribes to a network event (client → server). First param is always `Server.Player`. | [Details](../decorators/server/on-net.md) |
| `@Server.OnRPC()` | `eventName: string` | Subscribes to an RPC call. Returns a value to the caller. | [Details](../decorators/server/on-rpc.md) |
| `@Server.OnTick()` | — | Executes on every server tick. Use for lightweight, high-frequency logic. | [Details](../decorators/server/on-tick.md) |
| `@Server.OnFrameworkEvent()` | `eventName: string` | Listens to internal framework lifecycle events. | [Details](../decorators/server/on-framework-event.md) |
| `@Server.OnRuntimeEvent()` | `eventName: string` | Subscribes to native FiveM events (`playerJoining`, `playerDropped`, etc.). | [Details](../decorators/server/on-runtime-event.md) |
| `@Server.RequiresState()` | `state: string` | Ensures the player has a specific state flag before execution. | [Details](../decorators/server/requires-state.md) |
| `@Server.Throttle()` | `limit, windowMs` | Rate-limits the method per player or context. | [Details](../decorators/server/throttle.md) |
| `@Server.Export()` | `exportName?: string` | Exposes the method as a FiveM export for inter-resource APIs. | [Details](../decorators/server/export.md) |
| `@Server.Guard()` | `{ permission?, rank? }` | Applies access control before execution. | [Details](../decorators/server/guard.md) |
| `@Server.Public()` | — | Marks the method as explicitly public, bypassing guards. | [Details](../decorators/server/public.md) |
| `@Server.BinaryService()` | `serviceId: number` | Registers a binary protocol service handler. | [Details](../decorators/server/binary-service.mdx) |
| `@Server.BinaryCall()` | `callId: number` | Registers a binary protocol call handler. | [Details](../decorators/server/binary-call.md) |
| `@Server.BinaryEvent()` | `eventId: number` | Registers a binary protocol event handler. | [Details](../decorators/server/binary-event.md) |

## Execution Order

When multiple decorators are stacked on a method, they execute in this order:

1. **`@Server.RequiresState()`** — State check
2. **`@Server.Guard()`** — Permission/rank check
3. **`@Server.Throttle()`** — Rate limit check
4. **Schema validation** — Zod schema (if defined in `@Server.Command()`)
5. **Handler execution** — Your method runs
