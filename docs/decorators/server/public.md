---
title: Public
---
## Description
``@Server.Public()`` is a method decorator used to mark a server handler as publicly accessible, disabling authentication requirements.

By default, server network events and commands are protected by the framework’s security layer.
This decorator explicitly signals that the decorated method does not require an authenticated player context.

It is typically used together with @Server.OnNet() or @Server.Command() for endpoints such as login, registration, or handshake flows.

## Arguments
This decorator does not accept any arguments.

## Example
```ts
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class AuthController {
  @Server.Public()
  @Server.OnNet('auth:login')
  async login(player: Server.Player, credentials: AuthCredentials) {
    // authentication is intentionally disabled for this handler
  }

  @Server.Public()
  @Server.Command('help')
  showHelp(player: Server.Player) {
    // accessible without authentication
  }
}
```
In this example, both the network event and the command are exposed without requiring the player to be authenticated.
This is commonly required for initial connection or account-related flows.

## Notes

- By default, @Server.OnNet() and @Server.Command() handlers are authenticated.
- @Server.Public() disables authentication for the decorated method only.
- Use this decorator with caution, as public handlers can be invoked by unauthenticated clients.
- Public handlers should avoid mutating sensitive game or account state unless strictly necessary.