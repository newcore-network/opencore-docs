---
title: OnNet
---
## Description

``@Server.OnNet()`` is a method decorator used to register a method as a server-side network event handler.

Network events are triggered by clients and delivered to the server. This decorator allows a controller method to handle those events in a structured, secure, and optionally validated way.

The decorator stores metadata describing the network event, its validation rules, and the expected parameter types. During server bootstrap, the framework scans this metadata and binds the method to the corresponding network event.

## Arguments
``eventName`` - The name of the network event to register.

``schema`` - (optional) A Zod schema used to validate the event payload.

The schema can be provided in two ways:

The schema can be provided in two ways:
 - Directly as the second argument **(recommended)**
 - Inside an options object with a schema property (legacy support)

## Example

```ts
import { Server, z, Infer } from '@open-core/framework'

const PayloadSchema = z.object({
  message: z.string().min(2),
})

@Server.Controller()
export class ExampleController {

  @Server.OnNet('example:ping')
  ping(player: Server.Player, message: string) {
    // message is a primitive string
  }

  // Handler with schema (recommended)
  @Server.OnNet('example:data', PayloadSchema)
  handleData(player: Server.Player, data: Infer<typeof PayloadSchema>) {
    // data is validated against the schema
  }

  // Legacy usage with options object
  @Server.OnNet('example:legacy', { schema: PayloadSchema })
  handleLegacy(player: Server.Player, data: Infer<typeof PayloadSchema>) {
    // legacy-compatible registration
  }
}
```

In all cases, the first argument of the handler must be a Player, which represents the client that triggered the event.
If a schema is provided, the incoming payload is validated before the handler is executed.

## Notes
- The first parameter of a network handler must always be Player.
- If a schema is provided:
    - z.tuple([...]) validates all positional arguments.
    - Any other schema validates a single payload argument (args[0]).
- If no schema is provided, only primitive parameters can be auto-validated at runtime.
- Complex payloads should always use an explicit Zod schema.
- Handlers are usually protected by the framework’s network security layer; use @Server.Public to allow unauthenticated access if required.