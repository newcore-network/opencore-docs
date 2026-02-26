---
title: '@OnLibraryEvent'
description: Listens to server-side library domain events emitted with library.emit(...).
---

## Overview

`@OnLibraryEvent()` registers a method as a listener for a **server-side library domain event**.

This decorator listens to events emitted by library wrappers through `library.emit(...)`.

It does not bind immediately. The decorator stores metadata, and OpenCore binds the handler during bootstrap.

## Signature

```ts
@OnLibraryEvent(libraryName, eventName)
```

### Arguments

- `libraryName: string` — Library identifier (for example: `characters`, `inventory`, `factions`).
- `eventName: string` — Domain event name inside that library (for example: `session:created`).

## Handler Parameters

Handlers receive:

1. `payload` — The payload passed by `library.emit(eventName, payload)`.
2. `meta` — Event metadata:
   - `libraryName`
   - `eventName`
   - `eventId` (`<libraryName>:<eventName>`)
   - `namespace`
   - `side` (`'server'`)

## Example

```ts

@Controller()
export class CharacterSessionProjection {
  @OnLibraryEvent('characters', 'session:created')
  onSessionCreated(
    payload: { sessionId: string; playerId: number },
    meta: LibraryEventMetadata,
  ) {
    // payload from library.emit(...)
    // meta.eventId === 'characters:session:created'
  }
}
```

## Important Scope Rule

`@OnLibraryEvent()` listens only to events emitted with `library.emit(...)`.

It does **not** listen to:

- `emitExternal(...)`
- `emitNetExternal(...)`
- `emitServer(...)`

## Notes

- Server-only decorator.
- Designed for optional, decoupled observation of domain events.
- Useful for projections, audit logs, side effects, and cross-module reactions.
