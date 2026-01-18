---
title: Command
---

## Description
`@Server.Command()` registers a method as a server-side command handler executed through an OpenCore-compatible chat system.

Commands can be declared in any resource. During server startup, the framework discovers all commands, collects their metadata into the core, and exposes them through an internal communication bus.  
When a command is executed by a player, the call is routed back and executed inside the resource that originally defined the command.

This design allows commands to be globally available while keeping execution logic isolated, modular, and resource-safe.

Commands are intended for explicit player actions such as administration, utilities, or roleplay interactions.  
If the method declares parameters, the **first parameter must always be `Server.Player`**.

---

## Arguments
- `command` – The command name executed by the player, without the `/` prefix.
- `usage` *(optional)* – Usage string shown to the player when the command is misused or arguments are invalid.
- `description` *(optional)* – Short description of what the command does.
- `schema` *(optional)* – Zod schema used for argument validation.

---

## Validation behavior

- Primitive values (`string | number | boolean | any[]`) are auto-validated.
- `z.tuple([...])` validates positional arguments.
- `z.object({...})` enables complex validation (DTO-style payloads, limits, custom rules).
- Tuple schemas support **rest parameters (spread operator)** starting from `v0.3.x`.

If validation fails, the framework sends an error message built using the `usage` field.

---

## Spread operator (rest parameters)

Starting from **v0.3.x**, commands support **rest parameters (`...args`)**.

This allows a command to accept a variable number of arguments while preserving validation and type safety.

### Rules

- Rest parameters must always come **after fixed parameters**.
- Only **one rest parameter** is allowed.
- Validation is applied **before** the handler executes.
- This behavior matches standard TypeScript and JavaScript semantics.

---

### Simple spread example

```ts
@Server.Command('announce')
announce(player: Server.Player, ...message: string[]) {
  const text = message.join(' ')
  this.chatService.broadcast(text)
}
````

In this example:

* All remaining arguments are grouped into `message`.
* No manual parsing is required.
* Each argument is validated as a string.

---

### Spread parameters with schema validation

Spread parameters can be validated using a tuple schema with `rest()`.

```ts
@Server.Command(
  'say',
  z.tuple([
    z.string(),        // first argument
  ]).rest(z.string()) // remaining arguments
)
say(player: Server.Player, ...args: string[]) {
  // args contains all validated arguments
}
```

Validation rules:

* Fixed parameters are validated first.
* The `rest()` schema applies to all remaining arguments.
* If any argument fails validation, the command is rejected.

---

## Example

```ts
import { z, Infer } from '@open-core/framework'
import { Server } from '@open-core/framework/server'

const BanSchema = z.object({
  targetId: z.number().min(0).max(65565),
  reason: z.string().min(5).max(50),
})

@Server.Controller()
export class AdminController {

  // Simple command with primitive auto-validation
  @Server.Command('ping')
  ping(player: Server.Player, value: number) {
    // value is auto-parsed and validated
  }

  // Command with full configuration
  @Server.Command({
    command: 'kick',
    usage: '/kick <playerId:number> <reason:text>',
    description: 'Kick a player from the server',
  })
  kick(player: Server.Player, targetId: number, reason: string) {
    // command logic
  }

  // Command using schema-based validation (recommended for complex inputs)
  @Server.Command({
    command: 'ban',
    usage: '/ban <playerId:number> <reason:text>',
    description: 'Ban a player from the server',
  }, BanSchema)
  ban(player: Server.Player, data: Infer<typeof BanSchema>) {
    // data is strongly typed and validated by Zod
  }

  // Short form with schema
  @Server.Command('dosomething', BanSchema)
  doSomething(player: Server.Player, data: Infer<typeof BanSchema>) {
    // concise, strongly typed command
  }

  // Command with spread parameters
  @Server.Command(
    'note',
    z.tuple([z.number()]).rest(z.string())
  )
  note(player: Server.Player, targetId: number, ...message: string[]) {
    const text = message.join(' ')
    // command logic
  }
}
```

In these examples:

* Commands are discovered globally but executed in the defining resource.
* Argument validation happens before execution.
* Invalid usage or type errors automatically result in a player-facing error message.
* Spread parameters allow flexible input without manual parsing.

---

## Notes

* Commands can be defined in any resource; metadata is collected in the core, execution stays local to the resource.
* To use commands, you must run an OpenCore-compatible chat resource. `xchat` is the reference implementation and recommended starting point.
* The first parameter is always `Server.Player`.
* Primitive arguments have basic validation; complex data or strict rules require a schema.
* Spread parameters are supported from `v0.3.x` onward.
* `z` and `Infer` are framework-provided wrappers around Zod. You may use Zod directly, but the wrappers are recommended to ensure version compatibility.
* Commands are authenticated by default and can be combined with `@Server.Guard()`, `@Server.Throttle()`, `@Server.RequiresState()`, and `@Server.Public()` for security and gameplay rules.

```