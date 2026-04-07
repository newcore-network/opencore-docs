---
title: '@Export (Server)'
---

## Description
`@Export()` is a method decorator used to expose a server method as a resource export.

An export allows other resources to call a method through the adapter's export layer.
This decorator does not register the export immediately. Instead, it stores metadata that the framework later reads during the bootstrap phase to properly register the export.

The decorated method becomes callable from other resources using the resource name and the export name.

## Arguments
name (optional)
A custom export name.
If not provided, the method name is used as the export name.

## Example

```ts

@Controller()
export class AccountController {

  @Export()
  getAccountById(id: string) {
    return this.accountService.find(id)
  }
}

```

In this example, the method getAccountById is exposed as a server export with the name getAccountById.
During bootstrap, the framework registers this method so it can be accessed externally.

From another resource in a local/synchronous export runtime, it can be called like this:

```ts 
const account = exports['core-resource'].getAccountById('1234')
```
but we strongly recommend typing it

## Optional Remote Access Helper

OpenCore adapters may expose an optional remote export helper layer on top of `@Export()`.

This is useful when you want an explicit async API for resource-to-resource calls without changing the meaning of `getResource()`.

OpenCore distinguishes two access patterns:

- `getResource()` for local/synchronous access used by framework internals such as CORE bootstrap
- `getRemoteResource()` / `waitForRemoteResource()` when the adapter offers an explicit remote/async export helper

Example:

```ts
import { Controller, Command, Player } from '@open-core/framework/server'
import { IExports } from '@open-core/framework/contracts/server'

interface DatabaseExports {
  pingDatabase(): Promise<{ success: boolean }>
}

@Controller()
export class ExampleController {
  constructor(private readonly exportsService: IExports) {}

  @Command({ command: 'dbping' })
  async ping(_player: Player) {
    const database = await this.exportsService.waitForRemoteResource<DatabaseExports>('database', {
      exportName: 'pingDatabase',
    })

    return database.pingDatabase()
  }
}
```

Treat remote export helper calls as async.

## Notes
- This decorator only stores metadata; it does not register the export by itself.
- Exports are registered during the server bootstrap process.
- The decorator is intended for server-side usage only.
- Exported methods should remain stable, as other resources may depend on them.
- If your adapter exposes remote export helpers, prefer `waitForRemoteResource()` for resource-to-resource calls instead of assuming `getResource()` resolves everything.
