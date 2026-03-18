---
title: WebView Bridge
---

## Description

The **WebView Bridge** is the communication layer between your client-side gameplay logic and your web-based UI (HTML/CSS/JavaScript).

OpenCore provides:
- `WebViewBridge` class for programmatic UI control
- `@OnView()` decorator for handling UI messages
- `WebViewService` for advanced use cases

## WebViewBridge

The `WebViewBridge` class provides a simple API for managing your UI:

```ts
import { WebView } from '@open-core/framework/client'

// Create a WebView
WebView.create('https://my-ui-page.com', {
  visible: true,
  focused: true,
  cursor: true,
})

// Send data to UI
WebView.send('updateInventory', { items: playerItems })

// Listen for messages from UI
WebView.on('itemSelected', (data) => {
  console.log(`Item selected: ${data.itemId}`)
})

// Show/Hide UI
WebView.show(true, true)   // show with focus and cursor
WebView.hide()

// Toggle visibility
WebView.toggle()
```

## Type-Safe WebView

For type-safe communication, create a typed instance:

```ts
interface UISend {
  showInventory: { items: Item[] }
  updateHealth: { health: number }
}

interface UIReceive {
  itemSelected: { itemId: string; quantity: number }
  menuClosed: void
}

const ui = new WebViewBridge<UIReceive, UISend>()

// Now send is typed
ui.send('showInventory', { items: myItems })

// And on() is typed
ui.on('itemSelected', (data) => {
  // data is { itemId: string; quantity: number }
})
```

## Controller Integration

Use the `@OnView()` decorator in controllers:

```ts
@Controller()
export class InventoryController {

  @OnView('inventory:use-item')
  onUseItem(data: { itemId: string }) {
    console.log(`Player used item: ${data.itemId}`)
    // Return value is sent back to UI
    return { success: true }
  }

  @OnView('inventory:close')
  onClose() {
    // Hide UI when player closes inventory
    WebView.hide()
  }
}
```

## Focus Management

```ts
// Show UI with cursor and focus
WebView.show(true, true)

// Hide cursor, keep UI visible
WebView.focus(false)

// Release focus without hiding
WebView.blur()

// Allow mouse clicks to pass through UI to game
WebView.setInputPassthrough(true)
```

## WebViewService

For advanced scenarios, inject `WebViewService` directly:

```ts
import { WebViewService } from '@open-core/framework/client'

@Controller()
export class UIController {
  constructor(private readonly webview: WebViewService) {}

  openSettings() {
    this.webview.create({ id: 'settings', url: '/settings.html' })
    this.webview.show('settings')
  }

  closeAll() {
    this.webview.destroy('settings')
  }
}
```

## Notes

- WebView communication is **local only** — it never touches the network.
- Keep handlers lightweight. Heavy logic should be delegated to services.
- Use `@LocalEvent()` to communicate between view handlers and other client controllers.
- The old `NuiBridge` and `NUI` exports are deprecated; use `WebViewBridge` and `WebView` instead.
