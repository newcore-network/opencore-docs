---
title: Security Handler
---

## Description

The `SecurityHandlerContract` allows you to define custom actions when a security violation occurs. A violation happens when a player fails a `@Server.Guard()` check, attempts to use an unauthorized command, or triggers a rate limit.

## API Methods

### `handleViolation()`

Called whenever a `SecurityError` is thrown by the framework's security layer.

```ts
abstract handleViolation(player: Server.Player, error: SecurityError): Promise<void>
```

---

## Example

```ts
@Server.Bind(SecurityHandlerContract)
export class MySecurityHandler extends SecurityHandlerContract {
  async handleViolation(player: Server.Player, error: SecurityError) {
    console.warn(`[Security] ${player.name} triggered a violation: ${error.message}`)

    await db.logs.security({
      source: player.clientID,
      reason: error.code,
      message: error.message
    })

    if (error.code === 'AUTH:FORGERY_DETECTED') {
      DropPlayer(player.clientIDStr, 'Security Violation')
    }
  }
}
```

## Registration

Register your handler before initialization:

```ts
Server.setSecurityHandler(MySecurityHandler)
await Server.init({ mode: 'CORE' })
```

## Why use this?

While the framework automatically blocks unauthorized actions, the `SecurityHandler` gives you the opportunity to:
- **Alert staff** — Send a message to Discord or an admin chat.
- **Audit Logging** — Maintain a history of suspicious behavior.
- **Automated Punishment** — Kick or temporary ban players who repeatedly fail security checks.
