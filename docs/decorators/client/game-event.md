---
title: OnGameEvent
---

## Description
``@Client.OnGameEvent()`` is a method decorator used to listen to native GTA V game events on the client side.

These events originate from the RAGE engine itself and are exposed in FiveM through the gameEventTriggered mechanism.
They represent low-level gameplay signals such as damage, vehicle interactions, weapon usage, or AI reactions.

This decorator registers metadata that allows the framework to bind the method to the corresponding game event during client bootstrap.

## Arguments
eventName - The native game event name *(CEvent*)*. It must be a valid key of GameEventMap, ensuring strong typing and correct payload association.

``options`` *(optional)* - Configuration object for the event handler.

``options.autoParse`` *(optional)* - When set to true, the raw event arguments are automatically parsed into a structured, strongly typed object based on the event definition.
Defaults to false, in which case the handler receives the raw argument array.

## Example
```ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class CombatController {

  // Raw arguments (low-level access)
  @Client.OnGameEvent('CEventNetworkEntityDamage')
  onDamage(args: number[]) {
    const [victim, attacker] = args
  }

  // Auto-parsed, strongly typed payload
  @Client.OnGameEvent('CEventNetworkEntityDamage', { autoParse: true })
  onDamageParsed(data: EntityDamageEvent) {
    console.log(data.victim, data.attacker, data.victimDied)
  }
}
```
In the first handler, the method receives the raw argument array exactly as emitted by the engine.
In the second handler, the framework parses the event into a structured object, improving readability and type safety.


## Notes
- Game events are low-level and may fire very frequently; handlers should remain lightweight.
- Using autoParse improves developer ergonomics but may introduce minor overhead.
- Event names must match valid GTA V CEvent* identifiers.
- This decorator is intended for client-side controllers only.
- Documentation: https://docs.fivem.net/docs/game-references/game-events/