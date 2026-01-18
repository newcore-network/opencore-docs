---
title: OnView
---
## Description
``@Client.OnView()`` registers a method as a NUI callback handler on the client.

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
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class SettingsController {

  @Client.OnView('settings:save')
  saveSettings(payload: unknown) {
    // process UI data
    return data // data to return to NUI
  }
}
```

On the UI side, this callback can be invoked using fetch or postMessage:

```ts
const response = await fetch(
  `https://${GetParentResourceName()}/settings:save`,
  {
    method: 'POST',
    body: JSON.stringify({ volume: 80 })
  }
)
const result = await response.json()
```

When the UI triggers the callback:
- The payload is passed as the first argument to the handler
- The handler result is sent back to the UI as ``{ ok: true, data }``
- Errors are caught and returned as ``{ ok: false, error }``

## Response format
The framework always responds using the FiveM callback (`cb`) with a standardized shape.

### Success
```json
{
  "ok": true,
  "data": {
    "saved": true
  }
}
```
### Error
```json
{
  "ok": false,
  "error": "error message"
}
```

## Execution flow
1. NUI sends a POST request via `fetch`
2. FiveM emits `__cfx_nui:<eventName>` internally
3. The framework intercepts the event
4. The decorated method is executed
5. The return value is sent back through `cb`
6. The UI receives the JSON response

## Notes
* This decorator binds directly to FiveM’s NUI callback mechanism (`__cfx_nui:*`)
* The handler receives **only the UI payload**
* All handlers are wrapped in `try/catch`
* Errors are logged automatically via the NUI logger
* Response structure is always consistent:
  * `{ ok: true, data }`
  * `{ ok: false, error }`
* Intended exclusively for **client-side controllers that interact with NUI views**