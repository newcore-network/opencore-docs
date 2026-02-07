---
title: '@BinaryEvent'
description: Handles events emitted by a Binary Service.
---

## Overview

`@Server.BinaryEvent` defines a **listener for events emitted by a binary process**.

Unlike `@Server.BinaryCall`, events are:

- Initiated by the binary
- Asynchronous and unsolicited
- Fire-and-forget
- Not associated with a response

They allow a binary to **push information** into the OpenCore runtime.

---

## What a Binary Event Represents

A Binary Event is:

- A one-way message from the binary
- Emitted at any time during process lifetime
- Dispatched based on an event name
- Handled inside the Node.js runtime

A Binary Event is **not**:

- A request
- A callback response
- A promise-based operation
- Guaranteed to be delivered

Events favor **decoupling over reliability**.

---

## Declaring a Binary Event Handler

Binary events are declared by decorating a method with `@BinaryEvent`.

```ts
import { BinaryService, BinaryEvent } from "@open-core/framework/server";

@Server.BinaryService({ name: "worker" })
export class WorkerBinary {
  @Server.BinaryEvent("worker.ready")
  onReady(data: { pid: number }) {
    console.log("Worker ready:", data.pid);
  }
}
````

This declaration:

* Registers the method as an event handler
* Binds it to a specific event name
* Automatically dispatches incoming events

---

## Event Name Matching

The string passed to `@BinaryEvent` must match the `event` field emitted by the binary.

```json
{
  "type": "event",
  "event": "worker.ready",
  "data": {
    "pid": 1234
  }
}
```

If no handler exists for an event:

* The event is ignored
* A debug log may be emitted
* The binary is not affected

---

## Event Payload

The `data` field is passed directly to the handler method.

```ts
@Server.BinaryEvent("progress")
onProgress(data: { current: number; total: number }) {}
```

Rules:

* Payload must be JSON-serializable
* No validation is enforced by default
* Schema correctness is the responsibility of the binary

---

## Execution Model

* Events are processed in arrival order
* Handlers are executed synchronously in the JS event loop
* Errors inside handlers are caught and logged

An event **never blocks the binary**.

---

## Failure Isolation

If an event handler:

* Throws an error
* Crashes internally
* Is slow or blocking

The binary process continues running.

Event handling failures **do not propagate back** to the binary.

---

## Lifecycle Considerations

Events can be emitted:

* Immediately after process startup
* Before any `@BinaryCall` is executed
* At any moment during runtime

There is no buffering guarantee.

If the process restarts, events may be lost.

---

## Relation to Other Decorators

* **`@BinaryService`**
  Defines the process that emits the events.

* **`@BinaryEvent`**
  Defines how emitted messages are handled.

* **`@BinaryCall`**
  Is independent from events and not required.

Events and calls share the same transport but not the same semantics.

---

## Design Philosophy

Binary Events prioritize:

* Decoupling
* Simplicity
* Observability

They intentionally avoid:

* Backpressure
* Acknowledgements
* Delivery guarantees

If reliability is required, use `@BinaryCall`.

---

## Mental Model

Think of `@BinaryEvent` as:

* A signal handler
* A message bus subscription
* A push-based notification channel

It reacts, it does not request.

---

## Summary

`@BinaryEvent` enables:

* Reactive integrations
* Status notifications
* Progress updates
* Runtime signals from native code

If the binary needs to *inform* rather than *respond*, this is the tool.