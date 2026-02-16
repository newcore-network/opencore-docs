---
title: 'Binary Protocol'
description: Low-level communication protocol between OpenCore and external binary processes.
---

## Overview

The **Binary Protocol** defines how OpenCore communicates with external native processes
(C++, Rust, Go, Java, etc.) in a **deterministic, language-agnostic, and runtime-safe** way.

This protocol is the foundation of:

- `@BinaryService`
- `@BinaryCall`
- `@BinaryEvent`

It is intentionally **simple**, **explicit**, and **stream-based**, avoiding RPC frameworks,
shared memory, or FFI bindings.

At its core, the protocol is:

- **Transport**: `stdin` / `stdout`
- **Encoding**: UTF-8
- **Format**: JSON (one message per line)
- **Direction**: Bidirectional
- **Model**: Request / Response + Fire-and-forget Events

Part of our team created libraries to easily and seamlessly use the protocol with Go and Rust; you can download them here.
- **Go**: [Github](https://github.com/Flussen/opencore-jsonrpc-go) - [pkg.go.dev](https://pkg.go.dev/github.com/Flussen/opencore-jsonrpc-go)
  - `go get github.com/Flussen/opencore-jsonrpc-go`
- **Rust**: [Github](https://github.com/Flussen/opencore-jsonrpc-rust) - [crates.io](https://crates.io/crates/opencore-jsonrpc-rust)
  - `cargo install opencore-jsonrpc-rust`

---

## Transport Model

Each binary is spawned as a **child process**.

Communication happens exclusively through:

- `stdin` → messages sent **from OpenCore to the binary**
- `stdout` → messages sent **from the binary to OpenCore**
- `stderr` → logs, diagnostics, crashes (not part of the protocol)

Each message **must be a single JSON object terminated by `\n`**.

```

{ ... }\n

```

Multi-line JSON or pretty printing is **not allowed**.

---

## Message Categories

There are three message categories:

1. **Requests** (OpenCore → Binary)
2. **Responses** (Binary → OpenCore)
3. **Events** (Binary → OpenCore)

Each category has a strict schema.

---

## Requests (OpenCore → Binary)

Requests are sent when using `@BinaryCall`.

### Structure

```json
{
  "id": "string",
  "action": "string",
  "params": any
}
```

### Fields

| Field    | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| `id`     | string | yes      | Unique request identifier  |
| `action` | string | yes      | Operation name             |
| `params` | any    | no       | Payload sent to the binary |

### Example

```json
{
  "id": "42",
  "action": "hashPassword",
  "params": {
    "password": "secret"
  }
}
```

---

## Responses (Binary → OpenCore)

Every request **must produce exactly one response**.

### Structure

```json
{
  "id": "string",
  "status": "ok" | "error",
  "result"?: any,
  "error"?: {
    "message": string,
    "code"?: string
  }
}
```

### Fields

| Field    | Type               | Required                |
| -------- | ------------------ | ----------------------- |
| `id`     | string             | yes                     |
| `status` | `"ok"` | `"error"` | yes                     |
| `result` | any                | if `status === "ok"`    |
| `error`  | object             | if `status === "error"` |

### Success Example

```json
{
  "id": "42",
  "status": "ok",
  "result": {
    "hash": "$2b$10$..."
  }
}
```

### Error Example

```json
{
  "id": "42",
  "status": "error",
  "error": {
    "message": "Invalid input",
    "code": "INVALID_PASSWORD"
  }
}
```

---

## Events (Binary → OpenCore)

Events are **unsolicited messages** emitted by the binary.

They are handled by `@BinaryEvent`.

### Structure

```json
{
  "type": "event",
  "event": "string",
  "data": any
}
```

### Fields

| Field   | Type      | Required |
| ------- | --------- | -------- |
| `type`  | `"event"` | yes      |
| `event` | string    | yes      |
| `data`  | any       | no       |

### Example

```json
{
  "type": "event",
  "event": "worker.ready",
  "data": {
    "pid": 1234
  }
}
```

Events **do not receive responses**.

---

## Message Ordering Guarantees

* Messages are processed **in arrival order**
* Responses are matched using `id`
* Events are handled independently from request lifecycle

There is **no guarantee** that events will arrive before or after a response unless
explicitly designed by the binary.

---

## Error Handling Rules

### Invalid JSON

If the binary writes invalid JSON:

* The line is discarded
* The error is logged
* The process may be terminated depending on severity

### Unknown `id`

If a response references an unknown `id`:

* The response is ignored
* A warning is logged

### Missing Response

If a response is not received within the configured timeout:

* The call fails
* The promise is rejected
* The binary process may be restarted

---

## Design Constraints (Intentional)

The protocol deliberately **does not support**:

* Streaming responses
* Partial results
* Shared state between calls
* Binary payloads
* Auto-retries at protocol level

These decisions keep the protocol:

* Debuggable with `echo`
* Implementable in `<50` lines in most languages
* Safe under crashes
* Predictable under load

---

## Reference Implementation

Minimal pseudo-code loop for a binary process:

```text
while (read line from stdin):
  parse JSON
  if request:
    execute action
    write response JSON + \n
```

---

## Relation to Decorators

This protocol is consumed by:

* **`@BinaryService`** → Process lifecycle and binding. [Read more](../decorators/server/binary-service.md)
* **`@BinaryCall`** → Request / Response mapping. [Read more](../decorators/server/binary-call.md)
* **`@BinaryEvent`** → Event subscription. [Read more](../decorators/server/binary-event.md)

Each decorator builds on this protocol without extending it.

---

## Summary

The Binary Protocol is:

* Minimal
* Explicit
* Deterministic
* Language-neutral

If you can read JSON from stdin and write JSON to stdout, you can integrate with OpenCore.

Nothing more is required.
