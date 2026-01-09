---
title: OnFiveMEvent
---

## Description
`@Server.OnFiveMEvent()` is a method decorator used to register a method as a server-side listener for a native FiveM event.

It allows controller methods to react to built-in FiveM server events such as player connection, disconnection, or other engine-level signals.
The decorator itself does not bind the event immediately. It stores metadata that the framework later processes during the bootstrap phase to attach the method as an event handler.

## Arguments
``event`` - The name of the FiveM server event to listen to (for example: playerJoining).

## Example

```ts
import { Server } from '@open-core/framework'

@Server.Controller()
export class JoinerController {
  @Server.OnFiveMEvent('playerJoining')
  onPlayerJoining() {
    // Player is joining the server
  }
}
```

In this example, the onPlayerJoining method is registered as a listener for the playerJoining FiveM event.
When the event is triggered by the engine, the framework invokes this method automatically.

## Notes

- This decorator only stores metadata; actual event binding happens during server bootstrap.
- The method is expected to run in the server context.
- The event name must match a valid FiveM server event.
- Multiple controllers or methods may listen to the same FiveM event.
- More About server events: https://docs.fivem.net/docs/scripting-reference/events/server-events/