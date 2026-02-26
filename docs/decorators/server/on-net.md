---
title: '@OnNet'
description: Registers a server-side network event handler.
---

## Overview

`@OnNet()` is a method decorator used to register a **server-side network event handler**.

Network events are triggered by clients and delivered to the server through FiveM’s
network event system (`emitNet → onNet`).

This decorator allows controller methods to handle those events in a **structured,
secure, and optionally validated** way, without manually binding `onNet(...)`.

---

## Execution Model

- Events are **initiated by clients**
- Handlers run **exclusively on the server**
- The framework binds the handler during server bootstrap
- Argument parsing and validation occur **before execution**

If validation fails, the handler is **never executed**.

---

## Decorator Signature

```ts
@OnNet(eventName, schema?)
````

### Arguments

* **`eventName`**
  The name of the network event to register.

* **`schema`** *(optional)*
  A Zod schema used to validate the incoming payload.

The schema can be provided in two forms:

* Directly as the second argument (**recommended**)

---

## Handler Signature

A server network handler must always follow this rule:

> **The first parameter is always `Player`.**

```ts
@OnNet('example:event')
handle(player: Player, ...args) {}
```

This guarantees:

* Clear event origin
* Access to player identity and state
* Consistent security enforcement

---

## Validation Behavior

Validation rules are consistent with `@Command()`.

### Supported patterns

* **Primitive auto-validation**
  `string | number | boolean | any[]`

* **Tuple validation**
  Positional arguments using `z.tuple([...])`

* **Object validation**
  Single structured payload using `z.object({...})`

If validation fails:

* The event is rejected
* The handler is not executed
* A structured error is logged

---

## Spread Parameters (Rest Operator)

Starting from **v0.3.x**, `@OnNet()` supports **spread parameters**
in the same way as commands.

This enables variable-length payloads while preserving validation.

### Rules

* The first parameter must be `Player`
* Rest parameters must appear **after fixed parameters**
* Only **one rest parameter** is allowed
* Validation occurs **before execution**

---

### Simple Spread Example

```ts
@OnNet('chat:message')
onChat(player: Player, ...message: string[]) {
  const text = message.join(' ')
}
```

All remaining arguments sent by the client are grouped into `message`.

---

### Spread Parameters with Validation

Spread parameters can be validated using tuple schemas with `rest()`.

```ts
@OnNet(
  'chat:say',
  z.tuple([
    z.number(),        // channel id
  ]).rest(z.string()) // message words
)
onSay(player: Player, channelId: number, ...message: string[]) {
  const text = message.join(' ')
}
```

Validation rules:

* Fixed parameters are validated first
* `rest()` applies to all remaining arguments
* If any argument fails validation, the event is rejected

---

## Example

```ts
import { z, Infer } from '@open-core/framework'

const PayloadSchema = z.object({
  message: z.string().min(2),
})

@Controller()
export class ExampleController {

  // Primitive auto-validation
  @OnNet('example:ping')
  ping(player: Player, message: string) {}

  // Structured payload validation (recommended)
  @OnNet('example:data', PayloadSchema)
  handleData(player: Player, data: Infer<typeof PayloadSchema>) {}

  // Spread parameters
  @OnNet(
    'example:note',
    z.tuple([z.number()]).rest(z.string())
  )
  note(player: Player, targetId: number, ...message: string[]) {
    const text = message.join(' ')
  }
}
```

---

## Security Model

* Server network handlers are **protected by default**
* Player context is always enforced
* Invalid or malformed payloads are rejected early

To allow unauthenticated access explicitly, use:

```ts
@Public()
```

This should be used **sparingly**.

---

## Notes

* Network handlers are local to the resource that defines them
* Spread parameters are supported from `v0.3.x`
* If a schema is provided:

  * `z.tuple(...)` validates positional arguments (including rest)
  * Any other schema validates a single payload argument
* Complex or untrusted payloads should always use Zod schemas
* This decorator is **server-only**

---

## Summary

`@OnNet()` provides:

* Declarative server-side network event handling
* Strong validation and safety guarantees
* Consistent player context
* A clean alternative to manual `onNet(...)` bindings