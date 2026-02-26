---
title: 'Events API'
description: Core event bus used by OpenCore for all event-based communication.
---

## Overview

The **Events API** is the **central event dispatch system** in OpenCore.

It provides a unified, platform-agnostic way to:

- Emit events
- Subscribe to events
- Dispatch events across different execution contexts

All event-based communication in OpenCore — including network events, framework events,
runtime events, and local events — ultimately flows through the Events API.

---

## EventsAPI as the Core Event Bus

The Events API is not just a user-facing utility.  
It is the **internal backbone** of OpenCore’s event system.

All event decorators, such as:

- `@OnNet`
- `@OnLocalEvent`
- `@OnFrameworkEvent`
- `@OnRuntimeEvent`

register their handlers into the **EventsAPI** during the bootstrap phase.

This means:

- There is **one single event bus**
- Decorators are declarative registration mechanisms
- Dispatch and execution are handled centrally

> **All event handling in OpenCore converges through the EventsAPI.**

---

## Injection and Usage

The Events API is available through **dependency injection**.

It can be injected into services, controllers, or any injectable class.

```ts
import { EventsAPI } from '@open-core/framework'

@Service()
export class ChatService {
  constructor(
    private readonly events: EventsAPI<'server'>,
  ) {}

  broadcast(message: string) {
    this.events.emit('chat:message', message)
  }
}
````

Key properties:

* No platform imports
* No global functions
* Same API on server and client
* Transport resolved automatically
* The side, `server` or `client`, must be defined for correct typing.

---

## Emitting Events

### `events.emit(...)`

Emits an event into the OpenCore event system.

```ts
events.emit(eventName, ...args)
```

Example:

```ts
this.events.emit('player:joined', playerId)
this.events.emit('inventory:update', playerId, items)
```

What happens internally depends on context:

* The active transport determines how the event propagates
* The EventsAPI dispatches the event to all matching handlers
* Registered decorators and runtime listeners receive it

The caller does **not** need to know how the event is delivered.

---

## Subscribing to Events

### `events.on(...)`

Registers a runtime event listener.

```ts
events.on(eventName, handler)
```

Example:

```ts
this.events.on('player:ready', (playerId) => {
  // react to event
})
```

Characteristics:

* Subscriptions are dynamic
* Handlers are executed through the same event bus as decorators
* Errors inside handlers are isolated and logged

---

## Relation to Decorators

Decorators are **not separate systems**.

They are declarative ways to register handlers that are later attached
to the EventsAPI.

### Conceptual Flow

1. Decorator stores metadata
2. Framework bootstraps the resource
3. Metadata is resolved
4. Handlers are registered into the EventsAPI
5. Events are dispatched through the same bus

From the point of view of execution, there is **no difference** between:

* A handler registered via a decorator
* A handler registered via `events.on(...)`

Both are dispatched identically.

---

## Event Scopes

The Events API does not expose transport or scope details directly.

Instead, it operates on **logical events**.

Depending on context and configuration, an event may represent:

* A network-level event
* A framework lifecycle event
* A runtime or resource-level event
* A local in-process event

The distinction is resolved internally.

---

## Error Handling

The Events API follows strict safety rules:

* Emitting an event never throws
* Handler errors are caught and logged
* One failing handler does not affect others
* Events never block execution flow

This ensures stability even under faulty handlers.

---

## When to Use the Events API

Use the Events API when:

* Emitting events from services or domain logic
* Building reusable, platform-agnostic modules
* Needing dynamic subscriptions
* Interacting with the core event bus directly

Use decorators when:

* Declaring static handlers
* Binding to lifecycle or communication entry points
* Structuring controller interfaces

They are complementary, not exclusive.

---

## Design Principles

The Events API is designed around:

* A single source of truth for events
* Clear separation between declaration and execution
* Strong isolation and error containment
* Platform independence

This makes the system predictable, extensible, and easy to reason about.

---

## Summary

The Events API is the **heart of OpenCore’s event system**.

It provides:

* A unified event bus
* Platform-agnostic communication
* A foundation for all event decorators
* Safe and deterministic dispatch

Understanding the Events API means understanding how events work in OpenCore.