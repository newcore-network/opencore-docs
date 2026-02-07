---
title: '@BinaryService'
description: Defines and manages external binary processes used by OpenCore.
---

## Overview

`@Server.BinaryService` defines a **managed external binary process** and binds it to the OpenCore runtime.

A binary service is responsible for:

- Spawning a native process
- Keeping it alive
- Providing a communication channel based on the Binary Protocol
- Acting as the execution context for `@BinaryCall` and `@BinaryEvent`

Every interaction with a binary **starts** with a `@Server.BinaryService`.

---

## What a Binary Service Is (and Is Not)

A **Binary Service** is:

- A long-lived child process
- Language-agnostic (Go, Rust, C++, Java, etc.)
- Isolated from the Node.js runtime
- Communicated with via stdin/stdout

A Binary Service is **not**:

- A one-shot CLI command
- A shell script
- A dynamically linked library
- A replacement for JavaScript code

Think of it as a **worker process with a strict contract**.

---

## Declaring a Binary Service

A binary service is declared by decorating a class with `@Server.BinaryService`.

```ts
import { BinaryService } from "@open-core/framework/server";

@Server.BinaryService({
  name: "crypto",
  binary: "crypto" // no need extension
})
export class CryptoBinary {}
```

This declaration:

* Registers the service in the runtime
* Associates the class with a binary process
* Enables `@BinaryCall` and `@BinaryEvent` on this service

The class itself does **not** execute logic.
It represents a **binding**, not an implementation.

---

## Binary Resolution

At runtime, OpenCore resolves the executable using the following priority:

1. `bin/<platform>/<name>`
2. `bin/<name>`
3. Resource root fallback

Where `<platform>` is resolved dynamically, for example:

* `linux`
* `win32`
* `darwin`

This allows shipping **multiple platform binaries** in a single resource.

```
my-resource/
└─ bin/
   ├─ linux/
   │  └─ crypto
   ├─ win32/
   │  └─ crypto.exe
   └─ darwin/
      └─ crypto
```

---

## Process Lifecycle

The binary process lifecycle is fully managed by OpenCore.

### Startup

* The process is spawned lazily
* It is started on first usage
* Environment variables are inherited from the server

### Runtime

* stdin/stdout are monitored
* Messages are parsed line-by-line
* Events and responses are dispatched internally

### Failure Handling

If the process:

* Crashes
* Stops responding
* Emits invalid protocol messages

OpenCore may:

* Reject pending calls
* Restart the process
* Log and isolate the failure

This behavior is intentional to preserve server stability.

---

## Service Scope

Each `@BinaryService` represents **one process instance**.

* Calls are serialized per process
* Events originate from that process
* State is maintained inside the binary, not in JavaScript

If you need parallelism, you define **multiple services**, not threads.

---

## Configuration Surface

`@BinaryService` focuses strictly on **process binding**.

It does **not**:

* Define protocol behavior
* Validate payloads
* Implement retries
* Control call semantics

Those responsibilities are handled by:

* `@BinaryCall`
* `@BinaryEvent`
* The Binary Protocol itself

This separation keeps concerns explicit and testable.

---

## Relation to Other Decorators

* **`@BinaryService`**
  Defines *what* binary exists and how it is managed.

* **`@BinaryCall`**
  Defines *how* requests are sent to that binary.

* **`@BinaryEvent`**
  Defines *which* events the binary can emit.

A service without calls or events is valid but useless.

---

## Mental Model

If you come from other ecosystems:

* Spring → `@Service` + external worker
* Erlang → GenServer (but external)
* Unix → supervised daemon
* Game engines → native plugin (process-based)

The key difference: **hard isolation with explicit messaging**.

---

## Summary

`@BinaryService` is the **anchor point** of OpenCore’s binary integration.

It provides:

* Deterministic lifecycle
* Platform-aware resolution
* Safe isolation
* A stable execution boundary

Everything else builds on top of it.