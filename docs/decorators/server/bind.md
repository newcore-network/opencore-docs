---
title: Bind
---

## Description

Registers a class in the dependency injection container, making it available
for constructor injection across the server runtime.

`@Server.Bind()` is intended for reusable, non-controller classes such as
managers, helpers, adapters, or low-level services.

By default, the bound class is treated as a **singleton** and instantiated
lazily when first requested.

Use this decorator when a class:
- Has no direct gameplay entry point (commands, events)
- Encapsulates shared logic or state
- Must be injected into controllers or other services

## Arguments

| Argument | Description |
|---------|------------|
| `'singleton'` | Registers the class as a single shared instance for the entire server runtime (default behavior). |
| `'transient'` | Creates a new instance every time the class is resolved from the container. |


## Example

[Example code en typescript]

```ts
@Server.Bind() // @Server.Bind('transient')
export class InternalProcessor {

    process(data: string)
    // internal logic
}
```