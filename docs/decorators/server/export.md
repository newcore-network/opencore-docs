---
title: Export
---

## Description
`@Server.Export()` is a method decorator used to expose a server method as a FiveM server export.

An export allows other resources to call a method directly using FiveM’s exports system.
This decorator does not register the export immediately. Instead, it stores metadata that the framework later reads during the bootstrap phase to properly register the export.

The decorated method becomes callable from other resources using the resource name and the export name.

## Arguments
name (optional)
A custom export name.
If not provided, the method name is used as the export name.

## Example

```ts
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class AccountController {

  @Server.Export()
  getAccountById(id: string) {
    return this.accountService.find(id)
  }
}

```

In this example, the method getAccountById is exposed as a server export with the name getAccountById.
During bootstrap, the framework registers this method so it can be accessed externally.

From another resource, it can be called like this:

```ts 
const account = exports['core-resource'].getAccountById('1234')
```
but we strongly recommend typing it

## Notes
- This decorator only stores metadata; it does not register the export by itself.
- Exports are registered during the server bootstrap process.
- The decorator is intended for server-side usage only.
- Exported methods should remain stable, as other resources may depend on them.