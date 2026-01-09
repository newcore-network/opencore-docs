---
title: OnNet
---
## Description
``@Client.OnNet()`` registers a method as a client-side network event handler.

Network events are events sent from the server to the client (or from other client-aware systems) using FiveM’s onNet(...) mechanism.
This decorator allows client controllers to react to those events declaratively, without manually calling onNet.

Internally, the decorator only stores metadata. During client bootstrap, the ClientNetEventProcessor reads that metadata and binds the method using onNet(eventName, handler).
The handler is wrapped with error handling and structured logging to prevent runtime crashes.

## Arguments
``eventName`` - The name of the network event to listen to. This must match the event name emitted from the server using emitNet(...).

## Example
```ts
import { Client } from '@open-core/framework'

@Client.Controller()
export class UiController {
  @Client.OnNet('ui:setVisible')
  setVisible(isVisible: boolean) {
    // update UI visibility
  }
}
```
In this example:
- The server can trigger the event using emitNet('ui:setVisible', playerId, true) or player.emit
- The client receives the event
- The setVisible method is executed with the transmitted arguments


## Notes
- This decorator binds to FiveM’s onNet(...) client API.
- Arguments are passed to the handler exactly as emitted by the server.
- Handlers are automatically wrapped in error logging; exceptions are caught and logged with context.
- Network events are client-side only; use @Server.OnNet() for server-side handlers.
- Intended for client controllers that react to server-driven state changes or UI updates.