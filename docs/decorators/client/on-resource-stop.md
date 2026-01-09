---
title: OnResourceStop
---

## Description
@Client.OnResourceStop() registers a method to be executed when the current client resource stops.

It listens to the FiveM client lifecycle event onClientResourceStop and ensures the handler is only called when the stopping resource matches the current one.

This decorator is typically used for cleanup logic, such as removing UI elements, clearing intervals, or releasing client-side resources.

## Arguments
This decorator does not accept any arguments.

## Example
```ts
import { Client } from '@open-core/framework'

@Client.Controller()
export class LifecycleController {
  @Client.OnResourceStop()
  onStop(resourceName: string) {
    // cleanup logic
  }
}
```
In this example, ``onStop`` is executed just before the client resource is unloaded.

## Notes
- Use this decorator for cleanup and teardown operations.
- The handler is scoped to the current resource only.
- Errors are caught and logged with resource and handler context.
- Intended for client-side controllers managing resource lifecycle behavior.