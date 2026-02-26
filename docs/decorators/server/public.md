---
title: '@Public'
---
## Description
``@Public()`` is a method decorator used to mark a server handler as publicly accessible, disabling authentication requirements.

By default, server network events and commands are protected by the framework’s security layer.
This decorator explicitly signals that the decorated method does not require an authenticated player context.

It is typically used together with @OnNet() or @Command() for endpoints such as login, registration, or handshake flows.

## Arguments
This decorator does not accept any arguments.

## Example
```ts

@Controller()
export class AuthController {
  @Public()
  @OnNet('auth:login')
  async login(player: Player, credentials: AuthCredentials) {
    // authentication is intentionally disabled for this handler
  }

  @Public()
  @Command('help')
  showHelp(player: Player) {
    // accessible without authentication
  }
}
```
In this example, both the network event and the command are exposed without requiring the player to be authenticated.
This is commonly required for initial connection or account-related flows.

## Notes

- By default, @OnNet() and @Command() handlers are authenticated.
- @Public() disables authentication for the decorated method only.
- Use this decorator with caution, as public handlers can be invoked by unauthenticated clients.
- Public handlers should avoid mutating sensitive game or account state unless strictly necessary.