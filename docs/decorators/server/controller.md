---
title: '@Controller'
---
## Description

`@Controller()` is a class decorator used to declare a class as a server-side controller.
A server controller represents a logical entry point in the server layer. It groups commands, events, and handlers that react to player actions or engine events.

When applied, the decorator enables dependency injection, attaches controller metadata, and automatically registers the class under the current FiveM resource. This allows the framework to discover and initialize controllers without manual configuration.

The controllers operate in resources, core, and standalones; they are the main component of the framework.

**!! Controllers should always be imported in the project's index/main/init !!**

## Arguments

`@Controller()` accepts an optional `ControllerOptions` object. When provided, the framework applies the configured decorators to every method that does not already define them explicitly.

| Option | Type | Description |
|--------|------|-------------|
| `guard` | `GuardOptions` | Default `@Guard` applied to every method without its own `@Guard`. |
| `throttle` | `ThrottleOptions` \| `[limit, windowMs]` | Default `@Throttle` applied to every method without its own `@Throttle`. Supports a full options object or a tuple shorthand. |
| `requiresState` | `StateRequirement` | Default `@RequiresState` applied to every method without its own `@RequiresState`. |
| `public` | `boolean` | When `true`, marks every method as `@Public` unless the method already carries the decorator. |

## Examples

### Basic usage (no arguments)

```ts
import { Players } from '../services/player.service'

@Controller()
export class PlayerController {
  constructor(
    private readonly playerDirectory: Players
  ) {}

  // Commands, event handlers and all will be defined here
}
```
- In this example, `PlayerController` is marked as a server controller.
- The constructor dependency `Players` is injected automatically through the DI container.
- The controller is registered under the current resource and will be discovered during server startup.

Now you import it into the entry point (index server)
```ts
// Controllers
import './controllers/player.controller'

init({
    mode: 'CORE',
    //...
    })
```

### Default security and rate-limiting

```ts
@Controller({
  guard: { permission: 'user.authenticated' },
  throttle: { limit: 10, windowMs: 1000 },
})
export class MarketController {
  @Command('search')
  search(player: Player, query: string) {
    // inherits guard + throttle automatically
  }

  @Command('buy')
  @Guard({ permission: 'market.buy' }) // overrides controller default
  buy(player: Player, itemId: string) {
    // uses market.buy guard, throttle still inherited
  }
}
```

### Default state requirements

```ts
@Controller({
  requiresState: { missing: ['dead', 'cuffed'] },
})
export class VehicleController {
  @Command('spawn')
  spawn(player: Player, model: string) {
    // blocked if player is dead or cuffed
  }

  @Command('repair')
  @RequiresState({ has: ['mechanic'] }) // overrides controller default
  repair(player: Player) {
    // requires mechanic state, dead/cuffed check is replaced
  }
}
```

## Notes
- The decorator only registers and describes the class; it does not instantiate it.
- Controllers are scoped to the current FiveM resource.
- The class is automatically marked as injectable using tsyringe.
- Explicit method-level decorators always override controller-level defaults.
- This decorator is intended for server-side usage only.
