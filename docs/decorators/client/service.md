---
title: '@Service'
---

## Description

`@Service()` is a class decorator used to mark a class as a framework-managed client service.

A client service represents reusable client-side business logic, such as scene orchestration, UI coordination, camera flows, or local gameplay helpers.

This decorator registers the class in the dependency injection container using a defined lifecycle scope, allowing it to be injected into client controllers and other services.

## Arguments

`options.scope` is optional and controls the binding scope:

- `singleton` (default): one shared instance
- `transient`: a new instance for each resolution

## Example

```ts
import { Controller, Key, Service } from '@open-core/framework/client'

@Service()
export class SelectionService {
  focusCharacter() {
    // client-side selection logic
  }
}

@Controller()
export class SelectionController {
  constructor(private readonly selection: SelectionService) {}

  @Key('E')
  handleConfirm() {
    this.selection.focusCharacter()
  }
}
```

## Notes

- Client `@Service()` matches the server-side decorator contract.
- Use `@Controller()` for entry points and `@Service()` for reusable client logic.
- Default scope is singleton unless explicitly overridden.
