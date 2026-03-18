---
title: '@OnView'
---
## Description

`@OnView()` registers a method as a WebView callback handler on the client.

WebView callbacks are invoked when your web UI sends a message to the client runtime. The framework processes the metadata during client bootstrap and sets up the message routing.

## Arguments

`eventName` - The callback identifier used by your UI when sending messages.

## Returns

Optional return value that is sent back to the UI.

## Example

```ts
@Controller()
export class SettingsController {

  @OnView('settings:save')
  saveSettings(data: { volume: number; music: boolean }) {
    console.log(`Volume: ${data.volume}, Music: ${data.music}`)
    return { saved: true }
  }

  @OnView('menu:open')
  onMenuOpen() {
    // Hide cursor when opening a game menu
    WebView.blur()
  }
}
```

On the UI side, send messages using the WebView's message interface:

```ts
// Access window.opener or postMessage
window.parent.postMessage({
  action: 'settings:save',
  data: { volume: 80, music: true }
}, '*')
```

## Response Format

The framework responds with a standardized structure:

### Success
```json
{
  "ok": true,
  "data": { "saved": true }
}
```

### Error
```json
{
  "ok": false,
  "error": "error message"
}
```

## Execution Flow

1. UI sends a message to the WebView
2. The framework intercepts the message
3. The decorated method is executed with the payload
4. The return value is sent back to the UI

## Notes

* `@OnView()` callbacks work with `WebViewBridge` for sending data to UI
* The handler receives **only the UI payload**
* All handlers are wrapped in `try/catch`
* Errors are logged automatically
* Response structure is always consistent:
  * `{ ok: true, data }`
  * `{ ok: false, error }`
* Use `WebView` to send data back to the UI from other handlers
