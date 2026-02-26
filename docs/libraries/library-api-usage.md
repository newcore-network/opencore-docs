---
title: Library API Usage
description: How to use OpenCore library runtime APIs and library events.
---

## Overview

The Library API provides a consistent runtime contract for domain libraries such as `characters`, `inventory`, and `factions`.

It gives each library:

- A local event bus (`on`, `once`, `off`, `emit`)
- A stable event naming model (`buildEventName`, `buildLibraryEventId`)
- Runtime-side helpers (`getLogger`, `getConfig`)
- Directional transport bridge methods (server/client)

This page focuses on **usage** of the API once a library instance already exists in your module.

For install-time extension and bootstrap registration, see [Plugin API Usage](./plugin-api-usage.md).

## Core Concepts

### 1) Local Domain Events

Every library exposes an in-memory event bus:

- `on(eventName, handler)`
- `once(eventName, handler)`
- `off(eventName, handler)`
- `emit(eventName, payload?)`

These are the events observed by `@OnLibraryEvent(...)`.

```ts
// Assume `charactersLib` is an existing library instance
const onCreated = (payload: { sessionId: string }) => {
  // react inside the same runtime context
}

charactersLib.on('session:created', onCreated)

charactersLib.emit('session:created', { sessionId: 's-1' })
charactersLib.off('session:created', onCreated)
```

### 2) Event Naming

Libraries expose two naming helpers:

- `buildEventName(eventName)`
  - External namespaced format: `opencore:<library>:<event>`
- `buildLibraryEventId(libraryName, eventName)`
  - Canonical domain id: `<library>:<event>`

```ts
const namespaced = charactersLib.buildEventName('session:created')
// opencore:characters:session:created

const id = buildLibraryEventId('characters', 'session:created')
// characters:session:created
```

### 3) Runtime Metadata for Observers

When listening with `@OnLibraryEvent(...)`, handlers receive metadata describing the origin:

- `libraryName`
- `eventName`
- `eventId`
- `namespace`
- `side`

```ts
@OnLibraryEvent('characters', 'session:created')
onSessionCreated(payload: { sessionId: string }, meta: LibraryEventMetadata) {
  // meta.side === 'server'
}
```

## Server Library Runtime Methods

In addition to the base API, server libraries include:

- `emitExternal(eventName, payload?)`
  - Emits a server-side cross-resource event.
- `emitNetExternal(eventName, target, payload?)`
  - Emits a net event to a specific target.
- `getLogger()`
  - Namespaced logger for the library.
- `getConfig<T>()`
  - Namespaced config accessor.

```ts
charactersLib.emitExternal('session:created', { sessionId: 's-1' })
charactersLib.emitNetExternal('session:created', 34, { sessionId: 's-1' })

const logger = charactersLib.getLogger()
logger.info('Character session created')

const config = charactersLib.getConfig<{ maxCharactersPerUser: number }>()
const limit = config.get('maxCharactersPerUser')
```

## Client Library Runtime Methods

Client libraries include:

- `emitServer(eventName, payload?)`
  - Sends namespaced event to server.
- `getLogger()`
  - Client logger for the library.
- `getConfig<T>()`
  - Namespaced config accessor.

```ts
inventoryLib.emitServer('items:select', { itemId: 'itm_01' })

const logger = inventoryLib.getLogger()
logger.debug('Selection changed')

const config = inventoryLib.getConfig<{ uiCompactMode: boolean }>()
const compact = config.get('uiCompactMode')
```

## `OnLibraryEvent` Scope

`@OnLibraryEvent(...)` and `@OnLibraryEvent(...)` observe **only** domain emissions from `library.emit(...)`.

They do **not** observe transport bridge methods:

- `emitExternal(...)`
- `emitNetExternal(...)`
- `emitServer(...)`

This keeps domain events and transport concerns clearly separated.

## Practical Recommendations

- Use `emit(...)` for domain-level signals (`session:created`, `items:updated`, `faction:member-added`).
- Use `OnLibraryEvent` for optional listeners (projections, analytics, notifications).
- Use bridge methods only when crossing runtime/resource boundaries is required.
- Keep event names stable and explicit; treat them as part of your library contract.

## When to Combine With Plugin API

A common pattern for official libraries is:

1. Install and wire dependencies via Plugin API (`init({ plugins: [...] })`).
2. Use Library API at runtime for domain events and transport wrappers.

This separation keeps boot lifecycle concerns out of your domain event model.
