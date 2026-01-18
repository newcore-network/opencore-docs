---
title: OnNet
---

## Description

`@Server.OnNet()` is a method decorator used to register a method as a server-side network event handler.

Network events are triggered by clients and delivered to the server. This decorator allows a controller method to handle those events in a structured, secure, and optionally validated way.

The decorator stores metadata describing the network event, its validation rules, and the expected parameter types. During server bootstrap, the framework scans this metadata and binds the method to the corresponding network event.

The behavior of argument parsing and validation is **consistent with `@Server.Command()`**, including support for **spread parameters (rest operator)** starting from `v0.3.x`.

---

## Arguments

- `eventName` – The name of the network event to register.
- `schema` *(optional)* – A Zod schema used to validate the event payload.

The schema can be provided in two ways:
- Directly as the second argument **(recommended)**
- Inside an options object with a `schema` property *(legacy support)*

---

## Validation behavior

- Primitive values (`string | number | boolean | any[]`) are auto-validated.
- `z.tuple([...])` validates positional arguments.
- `z.object({...})` validates a single structured payload.
- Tuple schemas support **rest parameters (`...args`)**.

If validation fails, the handler is **not executed** and the event is rejected.

---

## Spread operator (rest parameters)

Starting from **v0.3.x**, network event handlers support **rest parameters** in the same way as commands.

This allows network events to accept a variable number of arguments while preserving validation and type safety.

### Rules

- The first parameter must always be `Server.Player`.
- Rest parameters must come **after fixed parameters**.
- Only **one rest parameter** is allowed.
- Validation happens **before** the handler executes.

---

### Simple spread example

```ts
@Server.OnNet('chat:message')
onChat(player: Server.Player, ...message: string[]) {
  const text = message.join(' ')
  // handle message
}
````

All remaining arguments sent by the client are grouped into `message`.

---

### Spread parameters with schema validation

Spread parameters can be validated using tuple schemas with `rest()`.

```ts
@Server.OnNet(
  'chat:say',
  z.tuple([
    z.number(),          // channel id
  ]).rest(z.string())   // message words
)
onSay(player: Server.Player, channelId: number, ...message: string[]) {
  const text = message.join(' ')
  // handle event
}
```

Validation rules:

* Fixed parameters are validated first.
* The `rest()` schema applies to all remaining arguments.
* If any argument fails validation, the event is rejected.

---

## Example

```ts
import { z, Infer } from '@open-core/framework'
import { Server } from '@open-core/framework/server'

const PayloadSchema = z.object({
  message: z.string().min(2),
})

@Server.Controller()
export class ExampleController {

  // Primitive auto-validation
  @Server.OnNet('example:ping')
  ping(player: Server.Player, message: string) {
    // message is auto-validated
  }

  // Handler with schema (recommended for complex payloads)
  @Server.OnNet('example:data', PayloadSchema)
  handleData(player: Server.Player, data: Infer<typeof PayloadSchema>) {
    // data is validated against the schema
  }

  // Legacy usage with options object
  @Server.OnNet('example:legacy', { schema: PayloadSchema })
  handleLegacy(player: Server.Player, data: Infer<typeof PayloadSchema>) {
    // legacy-compatible registration
  }

  // Handler using spread parameters
  @Server.OnNet(
    'example:note',
    z.tuple([z.number()]).rest(z.string())
  )
  note(player: Server.Player, targetId: number, ...message: string[]) {
    const text = message.join(' ')
    // event logic
  }
}
```

In all cases:

* The first parameter of the handler is always `Server.Player`.
* Validation occurs before execution.
* Invalid payloads never reach the handler.

---

## Notes

* Network events can be declared in any resource; execution stays local to the defining resource.
* Spread parameters are supported from `v0.3.x` onward.
* If a schema is provided:

  * `z.tuple([...])` validates positional arguments (including rest parameters).
  * Any other schema validates a single payload argument (`args[0]`).
* If no schema is provided, only primitive parameters can be auto-validated.
* Complex or untrusted payloads should always use an explicit Zod schema.
* Network handlers are protected by the framework’s security layer by default.
* Use `@Server.Public()` to explicitly allow unauthenticated access when required.