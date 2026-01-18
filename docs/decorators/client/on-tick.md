---
title: OnTick
---
## Description
``@Client.Tick()`` registers a method to be executed on every client frame.

This decorator binds a method to the FiveM client tick loop using setTick(...).
The method is executed continuously, once per rendered frame, making it suitable for real-time client logic such as HUD updates, proximity checks, or lightweight visual state synchronization.

Internally, the decorator stores metadata. During client bootstrap, the TickProcessor discovers the method and registers it with setTick, wrapping execution with error handling and structured logging.

## Arguments
This decorator does not accept any arguments.

## Example
```ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class HudController {
  @Client.Tick()
  updateHud() {
    // update HUD every frame
  }
}
```
In this example, ``updateHud`` is executed once per client frame.
The handler is bound automatically during bootstrap and runs continuously while the resource is active.

## Notes

- Tick handlers run every frame and must be extremely lightweight.
- Avoid blocking operations, heavy computations, or I/O inside tick handlers.
- Errors thrown inside the handler are caught and logged to prevent runtime crashes.
- Use @Client.Interval() instead of @Client.Tick() when per-frame precision is not required.