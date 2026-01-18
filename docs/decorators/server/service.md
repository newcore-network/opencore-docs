---
title: Service
---
## Description
``@Server.Service()`` is a class decorator used to mark a class as a framework-managed service.

A service represents business logic or domain logic that can be reused across controllers and other services.
This decorator registers the class in the dependency injection container using a defined lifecycle scope, allowing it to be injected wherever it is needed.

Internally, ``@Server.Service()`` is a semantic wrapper over the lower-level [Bind](./bind.md) decorator. Its purpose is to clearly express intent and allow service-specific behavior to be introduced in the future without breaking user code.

## Arguments
``options.scope`` - (optional) Defines the binding scope of the service.
Possible values:
- singleton (default): a single shared instance is created.
- transient: a new instance is created on each resolution.

## Example
```ts
import { Server } from '@open-core/framework/server'

@Server.Service()
export class InventoryService {
  addItem() {
    // business logic
  }
}
```
In this example, ``InventoryService`` is registered as a singleton service and can be injected into controllers or other services through the DI container.

## Notes

- Internally, this decorator delegates to the Bind decorator.
- The decorator exists mainly for semantic clarity and organization.
- Services should contain business or domain logic, not persistence logic.
- Default scope is singleton unless explicitly overridden.