---
title: '@Guard'
---

## Description
`@Guard()` is a method decorator used to enforce access control on server controller methods.

It protects a method by validating whether the calling player meets specific authorization requirements, such as a minimum rank or a required permission, before the method logic is executed. It is usually used primarily by staff, or user permissions; rank usually refers to hierarchical rank/role level.

The authorization check is delegated to the PrincipalPort, which centralizes security rules and role/permission evaluation. This makes access control declarative, consistent, and easy to reason about.

## Arguments
`options` - An object defining the access requirements for the method.

- options.rank (optional)
The minimum rank required for the player to execute the method.
- options.permission (optional)
A specific permission the player must have to execute the method.

## Example

```ts
import { Infer } from '@open-core/framework'


@Controller()
export class AdminController {

  @Guard({ permission: 'factions.manage' })
  @Command('newfaction', schema)
  async createFaction(player: Player, dto: Infer<typeof schema>) {
    return this.service.create(dto)
  }

  @Guard({ rank: 3 })
  @Command('ban')
  async ban(player: Player, targetID: string) {
    return this.service.ban(player, memberID)
  }
}
```

In this example, ``createFaction`` can only be executed by players who have the factions.manage permission.
The ban method requires the player to have at least rank 3.

In both cases, the first argument must always be a Player, as the guard uses it to determine the caller’s identity and privileges.

## Notes

- Authorization is enforced before the method logic is executed.
- If the player is not authorized, a user-friendly error message is sent to the player.
- In edge cases where the PropertyDescriptor is missing, the decorator only stores metadata and does not wrap the method.
- This decorator is intended for server-side controller methods only.