---
title: '@OnRPC (Client)'
description: Registers a client-side RPC handler.
---

## Overview

`@Client.OnRPC()` is a method decorator used to register a **client-side RPC handler**.

Client RPC handlers allow the **server to invoke logic on a specific client**
and optionally receive a response.

This is useful for scenarios where the client owns state or behavior that the
server should not or cannot execute directly.

---

## Execution Model

- RPC requests are **initiated by the server**
- Handlers execute **exclusively on the client**
- Each request expects **at most one response**
- Execution happens inside the client runtime

Client RPC handlers are **reactive**, not authoritative.

---

## Decorator Signature

```ts
@Client.OnRPC(actionName?)
````

### Arguments

* **`actionName`** *(optional)*
  The RPC action name.
  If omitted, the method name is used.

---

## Handler Signature

Client RPC handlers **do not receive a `Player` parameter**.

```ts
@Client.OnRPC('ui:confirm')
confirmAction(data: { message: string }): boolean {
  return true
}
```

The handler parameters correspond directly to the payload sent by the server.

---

## Parameters and Validation

* Parameters are received as-is
* No automatic validation is enforced
* Payload structure must be agreed upon with the server

If validation is required, it must be implemented manually in the handler.

---

## Return Values

Client RPC handlers **may return a value**.

```ts
@Client.OnRPC()
getResolution(): { width: number; height: number } {
  return {
    width: 1920,
    height: 1080,
  }
}
```

Rules:

* Returned values must be JSON-serializable
* The return value is sent back to the server
* `void` resolves as `undefined`

---

## Error Handling

If the handler:

* Throws an exception
* Rejects a promise

The RPC call:

* Is rejected
* Sends an error response back to the server
* Does not crash the client runtime

Errors are isolated per request.

---

## Common Use Cases

Client-side RPC handlers are appropriate for:

* UI confirmations
* Client-owned settings
* Screen or resolution queries
* Client-only computations
* Controlled client-side state access

They should **not** be used for:

* Authoritative gameplay logic
* Security-sensitive operations
* Validation of player actions

The server must always remain authoritative.

---

## Lifecycle Considerations

* Client RPC handlers are available after client bootstrap
* If the client disconnects, pending RPC calls fail
* There is no persistence across reconnects

RPC calls to clients should be treated as **best-effort**.

---

## Relation to Other RPC Components

* **RPC Overview**
  Defines the global request–response model.

* **`@Server.OnRPC()`**
  Handles client-initiated RPC calls.

* **RPC Calls / Notify**
  Define how RPC requests are sent.

Client RPC handlers are the inverse of server RPC handlers.

---

## Mental Model

A client RPC handler is best understood as:

* A callable client capability
* Exposed temporarily to the server
* Without authority or trust guarantees

The server decides *when* to call.
The client decides *how* to respond.

---

## Summary

`@Client.OnRPC()` provides:

* Controlled server-to-client RPC handling
* Optional response semantics
* Safe error isolation
* A clear separation from server authority

If the server needs to **ask** the client something, this is the correct tool.