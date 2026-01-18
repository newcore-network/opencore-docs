---
title: Throttle
---
## Description
``@Server.Throttle()`` is a method decorator used to rate-limit how frequently a player can invoke a server-side handler.

It protects commands, network events, or other controller methods from being spammed by the same player within a defined time window.
The decorator enforces limits per player and per method, ensuring fair usage and protecting server resources.

Internally, rate limiting is handled by the RateLimiterService, using a composite key based on the player and the method being called.

## Arguments
This decorator supports two overloads.

### Numeric overload
- limit: Maximum number of calls allowed within the time window.
- windowMs: Time window in milliseconds.

### Object-based overload
- options.limit: Maximum number of calls allowed within the time window.
- options.windowMs: Time window in milliseconds.
- options.onExceed *(optional)*: Security action to perform when the limit is exceeded (for example: logging, kick, ban).
- options.message *(optional)*: Custom error message returned when the rate limit is exceeded.

## Example

```ts
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class MarketController {

  // Allow 5 calls every 2 seconds
  @Server.Throttle(5, 2000)
  async search(player: Server.Player, query: string) {
    // ...
  }

  // Allow 1 call every 5 seconds with a custom message
  @Server.Throttle({ limit: 1, windowMs: 5000, message: 'Too fast!' })
  async placeOrder(player: Server.Player) {
    // ...
  }
}
```
In these examples, each player is rate-limited independently.
If a player exceeds the allowed call rate, the framework throws a security error and applies the configured action.

## Notes

- Rate limiting is applied per player and per method.
- The rate-limit key is composed as clientId:ClassName:MethodName.
- If the method is invoked without a valid Player as the first argument, throttling is skipped.
- When the limit is exceeded, a SecurityError is thrown.
- This decorator is intended for server-side controller methods only.