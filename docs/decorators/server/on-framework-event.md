---
title: '@OnFrameworkEvent'
---

## Description

`@OnFrameworkEvent()` is a method decorator used to register a method as a listener for an internal OpenCore framework event.

Internal framework events represent lifecycle or system-level signals emitted by the framework itself, not by FiveM directly.
This decorator allows controllers to react to those internal events in a structured and strongly typed way.

The decorator does not bind the event immediately. It stores metadata that the framework later reads during bootstrap to attach the method as an event listener.

Unlike `@OnRuntimeEvent`, the handler receives a framework-defined payload. Built-in framework events now work both locally and across `CORE -> RESOURCE` through the internal framework bridge.

Delivery behavior:

- `STANDALONE`: local only
- `CORE`: local only plus bridge dispatch to resources
- `RESOURCE`: receives bridged events from `CORE` and local framework events from its own runtime

When a built-in event crosses from `CORE` to `RESOURCE`, OpenCore serializes the transport payload and rehydrates framework objects like `Player` before invoking your listener.

## Arguments
`event` - The name of the internal framework event.

The event name is strongly typed and must be a valid key of `FrameworkEventsMap`.
The method signature should accept the payload type associated with the selected event.

## Events and Types
Use these types from the server package, for example `PlayerSessionCreatedPayload`.

- `internal:playerSessionCreated`: emitted as soon as the player session is created.
```ts
interface PlayerSessionCreatedPayload {
  clientId: number
  license: string | undefined
}
```
- `internal:playerSessionDestroyed`: emitted as soon as the player session is destroyed.
```ts
interface PlayerSessionDestroyedPayload {
  clientId: number
}
```
- `internal:playerFullyConnected`: emitted when the player is deemed safe to manage.
```ts
interface PlayerFullyConnectedPayload {
  player: Player
}
```
- `internal:playerSessionRecovered`: emitted when a session has been recovered, usually after a core restart.
```ts
interface PlayerSessionRecoveredPayload {
  clientId: number
  player: Player
  license: string | undefined
}
```

## Example
```ts

@Controller()
export class SystemController {
  @OnFrameworkEvent('internal:playerFullyConnected')
  onPlayerConnected(payload: PlayerFullyConnectedPayload) {
    console.log(`Player ${payload.player.clientID} connected`)
  }
}
```
In this example, the onPlayerConnected method is registered as a listener for the internal event ``internal:playerFullyConnected``.
When the framework emits this event, the method is invoked with a strongly typed payload.

## Notes
- This decorator only stores metadata; event binding occurs during server bootstrap.
- Internal events are emitted by the OpenCore framework, not by FiveM.
- The payload type is determined by `FrameworkEventsMap`.
- Built-in framework events can be delivered from `CORE` to `RESOURCE`.
- Bridged events keep the same public payload shape in listeners.
- This decorator is intended for server-side controllers only.
