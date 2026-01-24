---
title: OnFrameworkEvent
---

## Description

`@Server.OnFrameworkEvent()` is a method decorator used to register a method as a listener for an internal OpenCore framework event.

Internal framework events represent lifecycle or system-level signals emitted by the framework itself, not by FiveM directly.
This decorator allows controllers to react to those internal events in a structured and strongly typed way.

The decorator does not bind the event immediately. It stores metadata that the framework later reads during bootstrap to attach the method as an event listener.

This only works within each resource context; that is, if it's in the core, it only listens for events that will be sent within the core. There is no communication between resources here!

## Arguments
`event` - The name of the internal framework event.

The event name is strongly typed and must be a valid key of InternalEventMap.
The method signature should accept the payload type associated with the selected event.

## Events and Types
Use this type from the Server namespace, e.g:  `Server.PlayerSessionCreatedPayload`

- `internal:playerSessionCreated`: emmited as soon as the player session is created.
```ts
interface PlayerSessionCreatedPayload {
  clientId: number
  license: string | undefined
}
```
- `internal:playerSessionDestroyed`: emmited as soon as the player session is destroyed.
```ts
interface PlayerSessionDestroyedPayload {
  clientId: number
}
```
- `internal:playerFullyConnected`: It is emitted when the player is deemed safe to manage.
```ts
interface PlayerFullyConnectedPayload {
  player: Player
}
```
- `internal:playerSessionRecovered`: It is emitted when session has been recovered, this usually only happens when there is a core restart.
```ts
interface PlayerSessionRecoveredPayload {
  clientId: number
  player: Player
  license: string | undefined
}
```

## Example
```ts
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class SystemController {
  @Server.OnFrameworkEvent('internal:playerFullyConnected')
  onPlayerConnected(payload: Server.PlayerFullyConnectedPayload) {
    console.log(`Player ${payload.player.id} connected`)
  }
}
```
In this example, the onPlayerConnected method is registered as a listener for the internal event ``internal:playerFullyConnected``.
When the framework emits this event, the method is invoked with a strongly typed payload.

## Notes
- This decorator only stores metadata; event binding occurs during server bootstrap.
- Internal events are emitted by the OpenCore framework, not by FiveM.
- The payload type is determined by the InternalEventMap definition.
- This decorator is intended for server-side controllers only.