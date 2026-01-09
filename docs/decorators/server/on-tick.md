---
title: OnTick
---
## Description
``@Server.OnTick()`` is a method decorator used to register a method as a server tick handler.

A tick handler is executed on every server tick, allowing the server to perform continuous or periodic logic such as synchronization, state checks, or lightweight updates.

The decorator itself does not bind the method to the tick cycle immediately. It stores metadata that the framework later reads during bootstrap to attach the method to the FiveM server tick loop.

## Arguments
This decorator does not accept any arguments.

## Example
```ts
import { Server } from '@open-core/framework'

@Server.Controller()
export class SyncController {

  @Server.OnTick()
  updatePlayers() {
    this.service.syncPositions()
  }
}
```
In this example, the ``updatePlayers`` method is executed on every server tick.
The method is expected to perform fast, non-blocking operations to avoid degrading server performance.


## Notes

- This decorator only stores metadata; tick binding happens during server bootstrap. (Runtime)
- Tick handlers run very frequently and must remain lightweight.
- Blocking operations or heavy computations should be avoided.