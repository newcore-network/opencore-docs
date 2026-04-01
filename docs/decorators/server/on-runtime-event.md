---
title: '@OnRuntimeEvent'
---

## Description
`@OnRuntimeEvent` is a method decorator used to register a method as a server-side listener for a native FiveM event.

It allows controller methods to react to built-in FiveM server events such as player connection, disconnection, or other engine-level signals.
The decorator itself does not bind the event immediately. It stores metadata that the framework later processes during the bootstrap phase to attach the method as an event handler.

This decorator is designed to manage runtimes like FiveM or RedM

`@OnRuntimeEvent` passes the raw runtime arguments directly to your method. It does not wrap them in an object payload and it does not automatically resolve a `Player` entity.

## Arguments
``event`` - The name of the FiveM server event to listen to (for example: playerJoining).

## Handler Arguments

The method signature must match the runtime event arguments exposed by the adapter.

Common examples in the current runtime map:

- `playerJoining`: `(clientId: number, identifiers?: Record<string, string>)`
- `playerDropped`: `(clientId: number)`
- `onServerResourceStop`: `(resourceName: string)`

If you need a framework-managed payload such as `{ player }`, use `@OnFrameworkEvent` instead.

## Example

```ts

@Controller()
export class JoinerController {
  @OnRuntimeEvent('playerJoining')
  onPlayerJoining(clientId: number, identifiers?: Record<string, string>) {
    console.log('joining', clientId, identifiers?.license)
  }
}
```

In this example, the onPlayerJoining method is registered as a listener for the playerJoining FiveM event.
When the event is triggered by the engine, the framework invokes this method automatically.

## Notes

- This decorator only stores metadata; actual event binding happens during server bootstrap.
- The method is expected to run in the server context.
- The event name must match a valid FiveM server event.
- The handler receives raw runtime arguments, not a framework payload.
- Multiple controllers or methods may listen to the same FiveM event.
- More About server events: https://docs.fivem.net/docs/scripting-reference/events/server-events/
