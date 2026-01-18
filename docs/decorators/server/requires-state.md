---
title: RequiresState
---
## Description
@Server.RequiresState() is a method decorator used to enforce gameplay state requirements before executing a server-side handler.

It validates the current state flags of the player (such as dead, cuffed, on_duty, etc.) and blocks execution if the player does not meet the defined conditions. This allows gameplay rules to be expressed declaratively and kept close to the logic they protect.

The decorator wraps the original method and performs state validation at runtime.

## Arguments
``req`` - An object defining the required and forbidden player states.

``req.has`` *(optional)* - A whitelist of state flags the player must have.
The player must possess all listed states for the method to execute.

``req.missing`` *(optional)* -A blacklist of state flags the player must not have.
If the player has any of these states, execution is blocked.

``req.errorMessage`` *(optional)* - A custom error message sent to the client when validation fails.
If omitted, a default message is generated based on the failing state.

## Example

```ts
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class InventoryController {

  @Server.RequiresState({ missing: ['dead', 'cuffed'] })
  openInventory(player: Server.Player) {
    // inventory can only be opened if the player is alive and free
  }

  @Server.RequiresState({
    has: ['police_duty'],
    missing: ['dead'],
    errorMessage: 'You must be on duty to access the armory.',
  })
  openArmory(player: Server.Player) {
    // restricted to on-duty police officers
  }
}
```
In these examples, the method execution is blocked if the player does not satisfy the defined state constraints.
When validation fails, an error is sent to the client with either a custom or automatically generated message.

## Notes
- The decorated method must receive a Server.Player as its first argument.
- State validation is performed before the original method logic runs.
- This decorator throws an AppError with a client-facing message when validation fails.
- State rules are expressed declaratively and kept close to gameplay logic.