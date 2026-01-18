---
title: KeyMapping
---
## Description
``@Client.KeyMapping()`` is a method decorator used to register a client-side key mapping handler.

It allows a method to be bound to a specific keyboard key, enabling player interactions through configurable key mappings.
The decorator does not bind the key immediately. Instead, it stores metadata that the framework later uses during client bootstrap to register the key mapping and attach the handler.

This approach keeps input configuration declarative and close to the logic it triggers.

## Arguments
``key`` - The key identifier to bind. The exact value depends on the key-mapping layer used by the runtime.
``description`` - A human-readable description of the action, typically shown in key-mapping or control configuration UIs.

## Example

```ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class InteractionController {
  @Client.KeyMapping('E', 'Interact')
  interact() {
    // interaction logic
  }
}
```

## Notes

- This decorator only stores metadata; key registration happens during client bootstrap.
- Key identifiers depend on the underlying key-mapping system.
- Handlers should execute quickly to keep input responsive.
- Intended for client-side controllers only.