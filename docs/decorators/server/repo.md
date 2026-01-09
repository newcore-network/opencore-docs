---
title: Repo
---
## Description
``@Server.Repo()`` is a class decorator used to mark a class as a repository within the framework.

A repository encapsulates persistence-related logic, such as database access, API calls, or hybrid storage mechanisms.
It is registered in the dependency injection container in the same way as a service, but with a distinct semantic role.

Like [``@Server.Service()``](./service.md), this decorator is internally backed by [Bind](./bind.md), but is intentionally separated to clearly distinguish persistence concerns from business logic.

## Arguments
``options.scope`` - (optional) Defines the binding scope of the repository.
Possible values:
- singleton (default): a single shared instance is created.
- transient: a new instance is created on each resolution.

## Example

```ts
import { Server } from '@open-core/framework'

@Server.Repo()
export class AccountRepository {
  async findById(id: string) {
    // persistence logic
  }
}
```
In this example, ``AccountRepository`` is registered as a singleton repository and can be injected into services or controllers.

## Notes

- Repositories are intended for persistence and data access only.
- This decorator is a semantic wrapper over Bind.
- Keeping repositories separate from services helps enforce clean architecture boundaries.