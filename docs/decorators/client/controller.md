---
title: Controller
---
## Description
``@Client.Controller()`` is a class decorator used to declare a class as a client-side controller.

A client controller groups logic that runs on the client, such as UI handling, client-side events, NUI interactions, or client-only gameplay behavior.
This decorator enables dependency injection, attaches controller metadata, and registers the class so the client runtime can automatically discover and initialize it.

Client controllers are scoped per resource, allowing multiple resources to define their own isolated client logic.`

## Arguments
This decorator does not accept any arguments.

## Example
```ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class HudController {
  constructor(
    private readonly notifications: NotificationService
  ) {}
}
```
In this example, HudController is registered as a client controller.
Its dependencies are injected automatically, and the controller is discovered during the client bootstrap phase of the resource.

## Notes

- The decorator marks the class as injectable using tsyringe.
- Controllers are registered per resource using the current resource name.
- Metadata is stored to identify the class as a client controller.
- The decorator does not instantiate the class; discovery and instantiation happen during client bootstrap.