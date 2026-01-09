---
title: OnresourceStart
---
## Description
``@Client.OnResourceStart()`` registers a method to be executed when the current client resource starts.

This decorator hooks into the FiveM client lifecycle event onClientResourceStart.
The handler is only executed when the started resource matches the current resource, ensuring correct scoping and avoiding cross-resource side effects.

The decorator itself only stores metadata. During client bootstrap, the framework binds the method using an internal processor and wraps execution with structured logging and error handling.

## Arguments
This decorator does not accept any arguments.

## Example
```ts
import { Client } from '@open-core/framework'

@Client.Controller()
export class LifecycleController {
  @Client.OnResourceStart()
  onStart(resourceName: string) {
    // initialization logic
  }
}
```
In this example, onStart is executed when the client resource starts.
The resource name is passed to the handler for contextual use if needed.

## Notes
- The handler only runs for the current resource, not for all client resources.
- Execution is wrapped in error handling to prevent crashes during startup.
- Intended for initialization logic such as UI setup, cache initialization, or client-side state bootstrapping.