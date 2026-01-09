---
title: NuiCallback
---
## Description
``@Client.NuiCallback()`` registers a method as a NUI callback handler on the client.

NUI callbacks are invoked when the browser UI (HTML/JS) sends a message to the client runtime using FiveM’s NUI messaging system.
This decorator does not bind the callback immediately. It stores metadata that the framework processes during client bootstrap.

During bootstrap, the NuiProcessor:

- Registers the callback name with RegisterNuiCallbackType
- Listens to the internal ``__cfx_nui:<eventName>`` event
- Executes the handler safely
- Sends a structured response back to the UI

This provides a clean, typed bridge between UI code and client-side logic.


## Arguments
``eventName`` - The NUI callback name used by the UI when sending messages.

## Returnings
optional return value

## Example
```ts
import { Client } from '@open-core/framework'

@Client.Controller()
export class SettingsController {

  @Client.NuiCallback('settings:save')
  saveSettings(payload: unknown) {
    // process UI data
    return { saved: true }
  }
}
```

On the UI side, this callback can be invoked using fetch or postMessage:

```ts
fetch(`https://${GetParentResourceName()}/settings:save`, {
  method: 'POST',
  body: JSON.stringify({ volume: 80 })
})

```

When the UI triggers the callback:
- The payload is passed as the first argument to the handler
- The handler result is sent back to the UI as ``{ ok: true, data }``
- Errors are caught and returned as ``{ ok: false, error }``

## Notes
- This decorator binds to FiveM’s NUI callback mechanism ``(__cfx_nui:*)``.
- The handler receives only the payload sent from the UI.
- The framework automatically wraps the handler in error handling and logging.
- The callback response format is standardized:
    - Success: ``{ ok: true, data: result }``
    - Error: ``{ ok: false, error: message }``
- Intended for client-side controllers that interact with NUI (HTML/JS) interfaces.