---
title: '@OnNet (Client)'
description: Registers a client-side network event handler.
---

## Overview

`@Client.OnNet()` is a method decorator used to register a **client-side network event handler**.

Network events are sent from the server to the client using FiveM’s
network event system (`emitNet → onNet`).

This decorator allows client controllers to react to those events
**declaratively**, without manually calling `onNet(...)`.

---

## Execution Model

- Events are **initiated by the server**
- Handlers run **exclusively on the client**
- The framework binds the handler during client bootstrap
- Arguments are passed **exactly as emitted** by the server

Client network events are **reactive by nature**.

---

## Decorator Signature

```ts
@Client.OnNet(eventName)
````

### Arguments

* **`eventName`**
  The name of the network event to listen to.

This name must match the event emitted by the server.

---

## Handler Signature

Client network handlers **do not receive a `Player` parameter**.

```ts
@Client.OnNet('ui:setVisible')
setVisible(isVisible: boolean) {}
```

The handler parameters correspond directly to the arguments sent by the server.

---

## Argument Handling

* Arguments are received **positionally**
* No implicit validation is applied
* Payload shape must be agreed upon with the server

If validation or transformation is required, it should be handled
inside the method body.

---

## Example

```ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class UiController {

  @Client.OnNet('ui:setVisible')
  setVisible(isVisible: boolean) {
    // Update UI visibility
  }

  @Client.OnNet('ui:updateData')
  updateData(data: { title: string; count: number }) {
    // React to server-driven state
  }
}
```

Server-side emission:

```ts
emitNet('ui:setVisible', playerId, true)
emitNet('ui:updateData', playerId, { title: 'Shop', count: 3 })
```

---

## Error Handling

* Handlers are automatically wrapped by the framework
* Exceptions are caught and logged
* Client runtime stability is preserved

Errors **do not propagate back** to the server.

---

## Lifecycle Considerations

* Events can be received at any time after client bootstrap
* There is no buffering guarantee
* If the client reconnects, missed events are lost

Client network events should be used for **state updates**, not critical logic.

---

## Relation to Server OnNet

| Aspect     | Server                | Client        |
| ---------- | --------------------- | ------------- |
| Initiator  | Client                | Server        |
| Context    | `Server.Player`       | None          |
| Validation | Supported (Zod)       | Manual        |
| Security   | Enforced by framework | N/A           |
| Use case   | Gameplay / authority  | UI / feedback |

---

## Notes

* This decorator binds to FiveM’s `onNet(...)` client API
* Intended for client-side controllers
* Arguments are delivered as-is
* Use `@Server.OnNet()` for server-side network handlers

---

## Summary

`@Client.OnNet()` provides:

* Declarative client-side event handling
* Clean separation from server logic
* Safe error isolation
* A clear reactive model

If the server needs to **notify** the client, this is the correct tool.