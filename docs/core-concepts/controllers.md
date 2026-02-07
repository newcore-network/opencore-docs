---
title: Controllers & Services
---

## Controllers

A **Controller** is a class that acts as an entry point for your gameplay logic. Controllers group commands, network events, ticks, and other handlers that react to player actions or engine events.

Mark a class with `@Server.Controller()` (server) or `@Client.Controller()` (client) to register it in the framework.

```ts
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class PlayerController {
  @Server.Command({ command: 'hello' })
  sayHello(player: Server.Player) {
    player.send('Hello!', 'chat')
  }
}
```

### Key rules

- **Import your controllers** in the entry file (`server/index.ts` or `client/index.ts`). If a controller is not imported, the framework cannot discover it.
- Controllers are **scoped to the current FiveM resource**.
- The decorator only registers the class — instantiation is handled by the framework.

---

## Services (`@Server.Service()`)

A **Service** is a class that encapsulates reusable business logic. While controllers handle *how* a request arrives, services handle *what* to do.

```ts
import { Server } from '@open-core/framework/server'

@Server.Service()
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
@Server.Controller()
export class ShopController {
  constructor(private readonly inventory: InventoryService) {}

  @Server.Command({ command: 'buy' })
  handleBuy(player: Server.Player, item: string) {
    this.inventory.addItem(player.clientID, item)
  }
}
```

---

## Bind (`@Server.Bind()`)

`@Server.Bind()` registers a class in the dependency injection container without any semantic role. Use it for shared utilities, managers, adapters, or low-level classes that are not controllers or services.

```ts
@Server.Bind()
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

## Repositories (`@Server.Repo()`)

`@Server.Repo()` is a semantic alias for `@Server.Bind()`, intended for data access and persistence layers.

```ts
@Server.Repo()
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
| `@Server.Controller()` / `@Client.Controller()` | Entry point for gameplay logic | Singleton |
| `@Server.Service()` | Reusable business logic | Singleton |
| `@Server.Bind()` | Generic injectable class | Singleton |
| `@Server.Repo()` | Data access / persistence | Singleton |

All of these are automatically injectable via constructor injection. The framework manages their lifecycle — you never instantiate them manually.
