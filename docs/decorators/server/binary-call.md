---
title: '@BinaryCall'
description: Defines request-response calls from OpenCore to a Binary Service.
---

## Overview

`@BinaryCall` defines a **request-response operation** executed against a `@BinaryService`.

It maps a TypeScript method to a **remote action** executed inside a binary process,
using the Binary Protocol.

From the developer perspective, it behaves like an **async function call**.

---

## What a Binary Call Represents

A Binary Call is:

- A single request sent to a binary process
- Matched to exactly one response
- Asynchronous and promise-based
- Isolated from the Node.js runtime

A Binary Call is **not**:

- A stream
- A background job
- A fire-and-forget message
- A direct function invocation

Each call is a **remote procedure call over stdin/stdout**.

---

## Declaring a Binary Call

A binary call is declared by decorating a method with `@Server.BinaryCall`.

```ts
import { BinaryService, BinaryCall } from "@open-core/framework/server";

@Server.BinaryService({ name: "crypto" })
export class CryptoBinary {
  @Server.BinaryCall("hashPassword")
  hash(password: string): Promise<{ hash: string }> {
    return null as any;
  }
}
```

This declaration:

* Binds the method to a protocol `action`
* Transforms the method into a remote call
* Replaces the method body at runtime

The method body is never executed.

---

## Action Mapping

The string passed to `@Server.BinaryCall` defines the **action name** sent to the binary.

```ts
@Server.BinaryCall("hashPassword")
```

This results in a protocol request:

```json
{
  "id": "...",
  "action": "hashPassword",
  "params": [...]
}
```

If no name is provided, the method name is used by default.

---

## Parameters and Serialization

Method parameters are serialized **positionally** and sent as `params`.

```ts
@Server.BinaryCall()
compare(a: string, b: string): Promise<boolean> {}
```

Produces:

```json
{
  "action": "compare",
  "params": ["a", "b"]
}
```

Rules:

* Parameters must be JSON-serializable
* Functions and class instances are not allowed
* Validation is responsibility of the binary

---

## Return Values

The return type of the method represents the expected `result` field.

```ts
@Server.BinaryCall()
sign(data: string): Promise<string> {}
```

Binary response:

```json
{
  "status": "ok",
  "result": "signature"
}
```

Type safety exists **only at the TypeScript boundary**.
The binary must enforce correctness.

---

## Error Propagation

If the binary responds with `status: "error"`:

* The promise is rejected
* The error message is propagated
* Optional error codes are preserved

```json
{
  "status": "error",
  "error": {
    "message": "Invalid key"
  }
}
```

From JavaScript, this behaves like a thrown exception.

---

## Timeouts

Each call is executed with a timeout.

If the binary does not respond in time:

* The call fails
* The promise is rejected
* The service may be restarted

Timeouts protect the server from blocked processes.

---

## Execution Guarantees

* Calls are matched using a unique `id`
* Responses are resolved exactly once
* Late or duplicate responses are ignored
* Calls are isolated per Binary Service instance

There is no implicit retry.

---

## Relation to Other Decorators

* **`@BinaryService`**
  Defines where the call is executed.

* **`@BinaryCall`**
  Defines how a request is sent and resolved.

* **`@BinaryEvent`**
  Is unrelated to calls and does not affect responses.

Calls and events can coexist but are handled independently.

---

## Mental Model

A `@BinaryCall` is best understood as:

* A remote function invocation
* Executed outside the JS runtime
* With strict request/response semantics

If the binary crashes, the call fails.
If the protocol breaks, the call fails.
This is intentional.

---

## Summary

`@BinaryCall` provides:

* Clear request-response semantics
* Strong isolation
* Predictable failure behavior
* A clean async API for native code

If you need a value back from a binary, this is the tool.