---
title: '@OnLibraryEvent'
description: Listens to client-side library domain events emitted with library.emit(...).
---

## Overview

`@OnLibraryEvent()` registers a method as a listener for a **client-side library domain event**.

This decorator listens to events emitted by client library wrappers through `library.emit(...)`.

Like other OpenCore decorators, it stores metadata first; binding happens during bootstrap.

## Signature

```ts
@OnLibraryEvent(libraryName, eventName)
```

### Arguments

- `libraryName: string` — Library identifier.
- `eventName: string` — Domain event name inside the library.

## Handler Parameters

Handlers receive:

1. `payload` — The payload passed in `library.emit(...)`.
2. `meta` — Event metadata:
   - `libraryName`
   - `eventName`
   - `eventId` (`<libraryName>:<eventName>`)
   - `namespace`
   - `side` (`'client'`)

## Example

```ts

@Controller()
export class InventoryUiProjection {
  @OnLibraryEvent('inventory', 'items:updated')
  onItemsUpdated(
    payload: { count: number },
    meta: LibraryEventMetadata,
  ) {
    // react to local client library domain updates
  }
}
```

## Important Scope Rule

`@OnLibraryEvent()` listens only to `library.emit(...)` events.

It does **not** listen to transport bridge methods such as:

- `emitExternal(...)`
- `emitNetExternal(...)`
- `emitServer(...)`

## Notes

- Client-only decorator.
- Useful for UI projections, local reactions, and decoupled feature modules.
