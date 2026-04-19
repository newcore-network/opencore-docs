---
title: Dependency Injection (tsyringe)
---

## Overview

OpenCore uses `tsyringe` for dependency injection (DI). DI lets you declare dependencies in constructors and let the framework resolve them.

This keeps your code modular, testable, and free from manual wiring.

## Registration Decorators

- `@Controller()` - register an entry-point class.
- `@Service()` - register reusable business logic.
- `@Bind()` - register generic infrastructure classes.
- `@Repo()` - semantic alias for data-access classes.

All of these become container-managed classes.

## Constructor Injection

```ts
import { Controller, Command, Service, type Player } from '@open-core/framework/server'

@Service()
class InventoryService {
  addItem(clientId: number, item: string) {}
}

@Controller()
class ShopController {
  constructor(private readonly inventory: InventoryService) {}

  @Command({ command: 'buy' })
  buy(player: Player, item: string) {
    this.inventory.addItem(player.clientID, item)
  }
}
```

Client services use the same framework-level decorator:

```ts
import { Controller, Key, Service } from '@open-core/framework/client'

@Service()
class SelectionService {
  focus() {}
}

@Controller()
class CharacterController {
  constructor(private readonly selection: SelectionService) {}

  @Key('E')
  select() {
    this.selection.focus()
  }
}
```

## Rules

- Do not instantiate framework classes manually (`new MyService()`).
- Make sure decorated classes are imported before bootstrap.
- Prefer constructor injection over static/global access.

## Contract Registration vs DI

Contract provider selection is configuration, not only DI registration.

```ts
import { init, setPrincipalProvider, setPersistenceProvider } from '@open-core/framework/server'

setPrincipalProvider(MyPrincipalProvider)
setPersistenceProvider(MyPersistenceProvider)

await init({ mode: 'CORE' })
```

Use decorators for container registration; use `setX(...)` setup functions for framework provider selection.
