---
title: NUI Bridge
---

## Description

The NUI Bridge is the communication layer between your client-side gameplay logic (Lua/TypeScript) and your web-based UI (HTML/CSS/JavaScript). In FiveM, this is handled through the **NUI (Native UI)** system.

OpenCore provides the `@Client.OnView()` decorator to make this communication explicit and type-safe.

## How it Works

### UI → Client (NUI Callbacks)

When your UI sends a message to the client script, the `@Client.OnView()` decorator handles it:

```ts
@Client.Controller()
export class InventoryController {

  @Client.OnView('inventory:use-item')
  onUseItem(data: { itemId: string }) {
    console.log(`Player used item: ${data.itemId}`)
    return { success: true }
  }
}
```

From the UI side (JavaScript):
```js
fetch(`https://${GetParentResourceName()}/inventory:use-item`, {
  method: 'POST',
  body: JSON.stringify({ itemId: 'medkit' })
})
```

### Client → UI (SendNUIMessage)

To send data from the client to the UI, use the native `SendNUIMessage`:

```ts
SendNUIMessage({ action: 'showInventory', items: playerItems })
```

The UI listens for these messages:
```js
window.addEventListener('message', (event) => {
  if (event.data.action === 'showInventory') {
    renderInventory(event.data.items)
  }
})
```

## Focus Management

To show/hide the NUI cursor and capture keyboard input:

```ts
SetNuiFocus(true, true)   // Show cursor, capture keyboard
SetNuiFocus(false, false)  // Hide cursor, release keyboard
```

## Notes

- `@Client.OnView()` callbacks automatically parse the JSON body and return the response to the UI.
- NUI communication is **local only** — it never touches the network.
- Keep NUI callbacks lightweight. Heavy logic should be delegated to services.
- Use `@Client.LocalEvent()` to communicate between NUI handlers and other client controllers.
