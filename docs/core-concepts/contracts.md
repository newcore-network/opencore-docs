---
title: Contracts
---

## What is a Contract?

A **Contract** is an abstract class that defines a set of methods the framework can call. You provide the implementation — the framework orchestrates when and how it runs.

Contracts allow OpenCore to remain decoupled from your database, authentication system, and security policies while still enabling powerful extensibility.

```ts

// You implement the contract
@Bind(PlayerPersistenceContract)
export class MySqlPersistence extends PlayerPersistenceContract {
  async onSessionLoad(player: Player) {
    const data = await MySQL.query('SELECT * FROM users WHERE license = ?', [player.license])
    if (data[0]) {
      player.setMeta('money', data[0].money)
      player.setMeta('job', data[0].job)
    }
  }

  async onSessionSave(player: Player) {
    const money = player.getMeta('money')
    await MySQL.update('UPDATE users SET money = ? WHERE license = ?', [money, player.license])
  }

  async onAutoSave(player: Player) {
    await this.onSessionSave(player)
  }
}
```

---

## How to register a Contract

From **v0.3.x**, contracts are registered through the **Setup API** before calling `init()`:

```ts

setPersistenceProvider(MySqlPersistence)
setPrincipalProvider(MySecurityProvider)

await init({ mode: 'CORE' })
```

:::info
`@Bind()` makes the class injectable. `setX(...)` tells the framework which implementation to use. Both are needed.
:::

---

## Required vs Optional Contracts

Not all contracts must be implemented. OpenCore provides safe defaults for most of them.

| Contract | Required | Default if not provided |
| --- | --- | --- |
| **PrincipalProviderContract** | Required in CORE / STANDALONE | Deny-by-default provider |
| **PlayerPersistenceContract** | Optional | In-memory (data lost on restart) |
| **SecurityHandlerContract** | Optional | Block + log |
| **NetEventSecurityObserverContract** | Optional | Internal observer |
| **CommandErrorObserverContract** | Optional | Silent logging |
| **Repository** | Optional | Not used unless extended |

- **RESOURCE** mode delegates required contracts to the CORE.
- Missing required contracts cause a **fail-fast bootstrap error**.
- Optional contracts always have internal defaults.

---

## PlayerPersistenceContract

Defines the lifecycle hooks for saving and loading player data. This is the bridge between the runtime `Player` entity and your database.

| Method | When it's called |
| --- | --- |
| `onSessionLoad(player)` | Player joins the server |
| `onSessionSave(player)` | Player disconnects or manual save |
| `onAutoSave(player)` | Periodically (configurable interval) |

### Configuration

Every implementation must provide a `PersistenceConfig`:

```ts
readonly config: PersistenceConfig = {
  autoSaveEnabled: true,
  autoSaveIntervalMs: 300000 // 5 minutes
}
```

The framework handles the **timing** — you only provide the **logic**.

---

## Repository Pattern

OpenCore includes an abstract `Repository` base class for standardized CRUD operations:

```ts
@Repo()
export class UserRepository extends Repository<User> {
  protected tableName = 'users'

  protected toEntity(row: any): User {
    return { id: row.id, name: row.username }
  }

  protected toRow(entity: User) {
    return { id: entity.id, username: entity.name }
  }
}
```

Built-in methods: `findById`, `findOne`, `findMany`, `save`, `delete` — with support for pagination, ordering, and field selection.

---

## Why use Contracts?

- **Zero coupling** — the framework never depends on concrete implementations.
- **Security by default** — missing implementations never result in permissive behavior.
- **Inversion of control** — you provide behavior; the framework orchestrates it.
- **Swap implementations** without modifying framework code (e.g., switch from MySQL to MongoDB by changing one class).
