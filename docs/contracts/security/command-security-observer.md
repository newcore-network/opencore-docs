---
title: Command Error Observer
---

## Description

The `CommandErrorObserverContract` is a **global observer contract** invoked whenever a command execution fails.

It provides a **centralized, runtime-agnostic hook** to react to command errors without coupling error handling logic to individual commands or controllers.

The framework **does not notify players automatically** when a command fails.  
Instead, it emits a rich error context and delegates the responsibility of logging, reporting, or notifying players to this observer.

This design keeps command execution:
- Safe by default
- Non-intrusive
- Fully customizable

---

## When is this observer called?

The observer is triggered whenever a command fails at any point in the execution pipeline, including:

- Command dispatch (command not found)
- Authentication failures
- Security checks (`@Guard`, `@Throttle`, `@RequiresState`)
- Argument validation (schema or type mismatch)
- Command handler execution
- Unexpected internal errors

This applies to:
- Local commands
- Remote commands (RESOURCE → CORE → RESOURCE)
- Public and protected commands

---

## Contract definition

```ts
export abstract class CommandErrorObserverContract {
  /**
   * Called whenever command execution fails.
   */
  abstract onError(ctx: CommandErrorContext): Promise<void>
}
````

---

## Error stages

The `stage` field indicates **where** the error occurred.

```ts
export type CommandErrorStage =
  | 'dispatch'
  | 'auth'
  | 'security'
  | 'validation'
  | 'handler'
  | 'unknown'
```

### How stages are determined

Internally, stages are inferred from the error type:

* `dispatch` – Command not found or not routable
* `auth` – Authentication failure (`AUTH:UNAUTHORIZED`)
* `security` – Guard, throttle, or security violations
* `validation` – Schema or argument validation failures
* `handler` – Error thrown inside the command handler
* `unknown` – Fallback for uncategorized errors

You should always rely on `stage` rather than inspecting error codes directly.

---

## CommandErrorContext

The observer receives a **rich execution context** describing the failure.

```ts
export interface CommandErrorContext {
  mode: FrameworkMode
  scope: FeatureScope
  stage: CommandErrorStage
  error: AppError
  commandName: string
  args: string[]
  player: CommandErrorPlayerInfo
  playerRef?: Player
  command?: CommandErrorCommandInfo
  commandMeta?: CommandMetadata
  ownerResourceName?: string
}
```

---

### Runtime information

* `mode` – Runtime mode (`CORE`, `RESOURCE`, `STANDALONE`)
* `scope` – Execution scope (`core`, `resource`, `standalone`)
* `ownerResourceName` – Present when the command belongs to a RESOURCE

This allows distinguishing:

* CORE-owned commands
* RESOURCE-owned commands
* Delegated executions

---

### Player information

```ts
export interface CommandErrorPlayerInfo {
  clientId: number
  accountId?: string
  name?: string
}
```

This minimal identity is **always available** and safe for logging.

If available, `playerRef` provides the full `Player` entity, allowing:

* Sending chat messages
* Accessing session state
* Applying sanctions

---

### Command metadata

```ts
export interface CommandErrorCommandInfo {
  command: string
  description?: string
  usage?: string
  isPublic?: boolean
  methodName?: string
  expectsPlayer?: boolean
  paramNames?: string[]
}
```

This information is **best-effort**:

* Always available for local commands
* May be partial for remote commands

Use it defensively.

---

## Default behavior

OpenCore ships with a built-in implementation:

```ts
DefaultCommandErrorObserver
```

Default behavior:

* Logs errors using the command logger
* Never notifies the player
* Never throws
* Never interrupts execution

This guarantees:

* Safe defaults
* No accidental player spam
* No information leakage

---

## Observer safety guarantees

The observer is executed through a protected wrapper:

* Errors inside `onError()` are caught
* Failures are logged as fatal
* Command execution flow is never affected

Observers are treated as **user-land code** and must never be able to break the framework.

---

## Registering a custom observer

To override the default behavior, register your own observer **before initialization**:

```ts
import { Server } from '@open-core/framework/server'

Server.setCommandErrorObserver(MyCommandErrorObserver)

await Server.init({
  mode: 'CORE',
})
```

---

## Example: notifying players on validation errors

```ts
import {
  CommandErrorObserverContract,
  CommandErrorContext,
} from '@open-core/framework/server'

export class MyCommandErrorObserver extends CommandErrorObserverContract {
  async onError(ctx: CommandErrorContext): Promise<void> {
    if (ctx.stage === 'validation' && ctx.playerRef) {
      ctx.playerRef.send(
        ctx.command?.usage
          ? `Usage: ${ctx.command.usage}`
          : 'Invalid command arguments',
        'chat',
      )
    }
  }
}
```

---

## Common use cases

* Custom player-facing error messages
* Centralized logging and telemetry
* Admin command auditing
* Anti-abuse detection
* Debug tooling in development mode

---

## Summary

* This observer is the **single global hook** for command failures
* It receives full execution context
* Defaults are safe and silent
* Custom behavior is explicit and controlled
* Errors inside observers never break the framework