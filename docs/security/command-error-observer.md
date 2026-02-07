---
title: Command Error Observer
---

## Description

The `CommandErrorObserverContract` is a **global observer** invoked whenever a command execution fails. It provides a centralized hook to react to command errors without coupling error handling logic to individual commands or controllers.

The framework **does not notify players automatically** when a command fails. Instead, it emits a rich error context and delegates the responsibility to this observer.

## When is this observer called?

The observer is triggered whenever a command fails at any point in the execution pipeline:

- Command dispatch (command not found)
- Authentication failures
- Security checks (`@Guard`, `@Throttle`, `@RequiresState`)
- Argument validation (schema or type mismatch)
- Command handler execution errors
- Unexpected internal errors

## Error Stages

The `stage` field indicates **where** the error occurred:

| Stage | Description |
| --- | --- |
| `dispatch` | Command not found or not routable |
| `auth` | Authentication failure |
| `security` | Guard, throttle, or security violations |
| `validation` | Schema or argument validation failures |
| `handler` | Error thrown inside the command handler |
| `unknown` | Fallback for uncategorized errors |

## CommandErrorContext

```ts
interface CommandErrorContext {
  mode: FrameworkMode
  scope: FeatureScope
  stage: CommandErrorStage
  error: AppError
  commandName: string
  args: string[]
  player: CommandErrorPlayerInfo
  playerRef?: Player
  command?: CommandErrorCommandInfo
}
```

---

## Example: Notifying players on validation errors

```ts
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

## Registration

```ts
Server.setCommandErrorObserver(MyCommandErrorObserver)
await Server.init({ mode: 'CORE' })
```

## Default Behavior

OpenCore ships with a `DefaultCommandErrorObserver` that:
- Logs errors using the command logger
- Never notifies the player
- Never throws or interrupts execution

## Safety Guarantees

- Errors inside `onError()` are caught and logged as fatal
- Command execution flow is never affected by observer failures
- Observers are treated as user-land code and cannot break the framework

## Common Use Cases

- Custom player-facing error messages
- Centralized logging and telemetry
- Admin command auditing
- Anti-abuse detection
- Debug tooling in development mode
