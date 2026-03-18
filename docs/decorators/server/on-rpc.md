---
title: '@OnRPC (Server)'
description: Registers a server-side RPC handler.
---

## Overview

`@OnRPC()` is a method decorator used to register a **server-side RPC handler**.

RPC handlers allow the **client to invoke authoritative server logic** and receive
a deterministic response.

This decorator binds a method to an RPC action name and exposes it through the
OpenCore RPC transport layer.

---

## Execution Model

- RPC requests are **initiated by clients**
- Handlers execute **exclusively on the server**
- Each request expects **exactly one response**
- Handlers run inside the OpenCore security and lifecycle context

If a handler throws or fails, the RPC call is rejected.

---

## Decorator Signature

```ts
@OnRPC(actionName?, options?)
````

### Arguments

* **`actionName`** *(optional)*
  The RPC action name.
  If omitted, the method name is used.

* **`options`** *(optional)*
  Configuration object (e.g. schema, visibility).

---

## Handler Signature

A server RPC handler must follow this rule:

> **The first parameter is always `Player`.**

```ts
@OnRPC('inventory:get')
getInventory(player: Player): InventoryDto {}
```

This ensures:

* Clear caller identity
* Server authority
* Consistent permission checks

---

## Parameters and Validation

RPC handlers support **schema-based validation**.

### Primitive Parameters

Primitive values are auto-validated:

```ts
@OnRPC()
ping(player: Player, value: number): number {
  return value
}
```

---

### Schema Validation (Recommended)

Use Zod schemas for complex or untrusted payloads.

```ts
@OnRPC(
  'bank:deposit',
  z.object({
    amount: z.number().positive(),
  })
)
deposit(
  player: Player,
  data: { amount: number }
) {
  // validated before execution
}
```

If validation fails:

* The handler is not executed
* The RPC call is rejected with a validation error

---

## Return Values

The return value of the handler is sent back to the caller.

```ts
@OnRPC()
getHealth(player: Player): number {
  return player.health
}
```

Rules:

* Returned values must be JSON-serializable
* Returned value becomes the RPC `result`
* `void` results resolve as `undefined`

---

## Error Handling

If the handler:

* Throws an exception
* Rejects a promise
* Explicitly returns an error

The RPC call:

* Is rejected
* Returns a structured error to the client
* Does not crash the server

Errors are isolated per call.

---

## Security Model

Server RPC handlers are **protected by default**.

This includes:

* Player context enforcement
* Permission checks
* Authentication guards

To allow unauthenticated access explicitly:

```ts
@Public()
```

This should be used only for safe, non-sensitive operations.

---

## Execution Guarantees

* Each RPC request maps to one handler execution
* Each execution produces at most one response
* Duplicate or late responses are ignored
* Handlers are never executed concurrently for the same request

There is no implicit retry.

---

## Relation to Other Systems

* **RPC Overview**
  Defines the request–response model and targets.

* **`@OnRPC()`**
  Defines client-side RPC handlers.

* **Network Events**
  Are unrelated and do not expect responses.

RPC handlers should not be used as event listeners.

---

## Mental Model

A server RPC handler is best understood as:

* A secured remote function
* Executed under server authority
* With strict input and output contracts

The server always remains the source of truth.

---

## Summary

`@OnRPC()` provides:

* Deterministic server-side RPC handling
* Strong validation and security guarantees
* Clean client–server interaction
* Explicit request–response semantics

If the client needs an answer from the server, this is the correct entry point.