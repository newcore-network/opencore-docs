---
title: Rate Limiter Service
---

## Description
The `RateLimiterService` provides a simple, in-memory sliding window mechanism to protect your server from execution abuse. It is the engine behind the `@Server.Throttle()` decorator, but it can also be used directly for custom logic.

It is designed to be high-performance and process-local, meaning it tracks "hits" in the current resource memory.

## API Methods

### `checkLimit()`
Checks if a specific action (identified by a key) has exceeded its allowed limit within a time window.

```ts
checkLimit(key: string, limit: number, windowMs: number): boolean
```
- **key**: A unique string identifying the context (e.g., `player_1_command_spawn`).
- **limit**: Maximum number of allowed hits.
- **windowMs**: The time window in milliseconds.
- **Returns**: `true` if the hit is allowed, `false` if the limit is exceeded.

## Automatic Cleanup
To prevent memory leaks in long-running servers, the service automatically cleans up expired timestamps when the internal registry grows too large (over 5,000 unique keys).

## Example Usage

### Via Decorator (Recommended)
The easiest way to use the rate limiter is through the built-in decorator:

```ts
@Server.Controller()
export class SecureController {
  
  @Server.Command('spam')
  @Server.Throttle(2, 60000) // Allow only 2 times per minute
  handleSpam(player: Server.Player) {
    // Logic here
  }
}
```

### Direct Usage
For more complex scenarios where a decorator isn't enough:

```ts
@Server.Controller()
export class CustomController {
  constructor(private readonly rateLimiter: RateLimiterService) {}

  @Server.OnNet('custom:event')
  handleEvent(player: Server.Player) {
    const key = `event_check_${player.clientID}`;
    
    if (!this.rateLimiter.checkLimit(key, 5, 10000)) {
      return console.warn(`Player ${player.name} is clicking too fast!`);
    }

    // Process event...
  }
}
```

## Notes
- **Process Local**: If you have multiple resources, each has its own `RateLimiterService` instance. They do not share hit counts.
- **In-Memory**: Limits are reset whenever the resource is restarted.
- **Scalability**: While simple, it is highly efficient for most gameplay-related rate limiting needs.
