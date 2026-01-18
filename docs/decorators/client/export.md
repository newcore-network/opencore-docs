---
title: Export
---
## Description
``@Client.Export()`` is a method decorator used to expose a client-side method as a FiveM client export.

Client exports allow other resources to call client logic directly through FiveM’s exports system.
This decorator does not immediately register the export. Instead, it stores metadata that the framework later processes during the client bootstrap phase to register the export correctly.

Exports are scoped to the resource where they are defined.


## Arguments
``name`` *(optional)* - Custom name for the export. If omitted, the method name is used as the export name.

## Example
```ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class UiExports {
  @Client.Export('setHudVisible')
  setHudVisible(visible: boolean) {
    // show or hide the HUD
  }
}
```
In this example, the method setHudVisible is exposed as a client export named setHudVisible.
Other resources can call it like this:
```ts
exports['ui-resource'].setHudVisible(true)
```
If no name had been provided, the method name itself would be used automatically.

## Notes
- This decorator only stores metadata; export registration happens during client bootstrap.
- Client exports are callable by other resources running on the client side.
- The export name must be stable, as other resources may depend on it.
- Intended for client-side controllers only.