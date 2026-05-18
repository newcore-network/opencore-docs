---
title: Controllers & Services
---

## Controllers

A **Controller** is a class that acts as an entry point for your gameplay logic. Controllers group commands, network events, ticks, and other handlers that react to player actions or engine events.

Mark a class with `@Controller()` (server) or `@Controller()` (client) to register it in the framework.

```ts

@Controller()
export class PlayerController {
  @Command({ command: 'hello' })
  sayHello(player: Player) {
    player.send('Hello!', 'chat')
  }
}
```

### Key rules

- **Import your controllers** in the entry file (`server/index.ts` or `client/index.ts`). If a controller is not imported, the framework cannot discover it.
- Controllers are **scoped to the current FiveM resource**.
- The decorator only registers the class — instantiation is handled by the framework.

### Default decorations

`@Controller()` accepts an optional configuration object that declares **default decorations** for every method in the class. This is useful when all (or most) handlers in a controller share the same security, rate-limiting, or state requirements.

Supported defaults:

| Option | Type | Description |
|--------|------|-------------|
| `guard` | `GuardOptions` | Applies `@Guard` to every method that does not define its own. |
| `throttle` | `ThrottleOptions` \| `[limit, windowMs]` | Applies `@Throttle` to every method that does not define its own. |
| `requiresState` | `StateRequirement` | Applies `@RequiresState` to every method that does not define its own. |
| `public` | `boolean` | When `true`, applies `@Public` to every method not already marked as such. |

**Override behavior:** if a method declares its own decorator explicitly, the method-level version wins. Defaults only fill the gaps.

```ts
@Controller({
  guard: { permission: 'user.authenticated' },
  throttle: { limit: 20, windowMs: 1000 },
})
export class ShopController {
  @Command('buy')
  buy(player: Player, item: string) {
    // inherits guard + throttle from the controller
  }

  @Command('admin:restock')
  @Guard({ rank: 5 }) // overrides the controller default guard
  restock(player: Player) {
    // uses rank 5 guard, but still inherits throttle
  }
}
```

---

## Services (`@Service()`)

A **Service** is a class that encapsulates reusable business logic. While controllers handle *how* a request arrives, services handle *what* to do.

```ts

@Service()
export class InventoryService {
  addItem(playerId: number, item: string) {
    // business logic
  }
}
```

Services are **singletons** by default — the framework creates one instance shared across all controllers. This allows services to maintain internal state (registries, counters, caches).

### Why use services?

- **Reusability** — multiple controllers can share the same logic.
- **Separation of concerns** — controllers handle input, services handle logic.
- **Testability** — services can be tested in isolation.

### Injection

Services are injected automatically via the constructor. Never use `new MyService()` — let the framework handle the lifecycle.

```ts
@Controller()
export class ShopController {
  constructor(private readonly inventory: InventoryService) {}

  @Command({ command: 'buy' })
  handleBuy(player: Player, item: string) {
    this.inventory.addItem(player.clientID, item)
  }
}
```

---

## Bind (`@Bind()`)

`@Bind()` registers a class in the dependency injection container without any semantic role. Use it for shared utilities, managers, adapters, or low-level classes that are not controllers or services.

```ts
@Bind()
export class InternalProcessor {
  process(data: string) {
    // internal logic
  }
}
```

| Argument | Description |
|---------|------------|
| `'singleton'` | Single shared instance for the entire runtime (default). |
| `'transient'` | New instance created every time the class is resolved. |

---

## Repositories (`@Repo()`)

`@Repo()` is a semantic alias for `@Bind()`, intended for data access and persistence layers.

```ts
@Repo()
export class AccountRepository {
  async findById(id: string) {
    // persistence logic
  }
}
```

Keeping repositories separate from services helps enforce clean architecture boundaries:
- **Services** → business/domain logic
- **Repositories** → database access and persistence

---

## Summary

| Decorator | Purpose | Default scope |
|-----------|---------|---------------|
| `@Controller()` / `@Controller()` | Entry point for gameplay logic | Singleton |
| `@Service()` | Reusable business logic | Singleton |
| `@Bind()` | Generic injectable class | Singleton |
| `@Repo()` | Data access / persistence | Singleton |

All of these are automatically injectable via constructor injection. The framework manages their lifecycle — you never instantiate them manually.
