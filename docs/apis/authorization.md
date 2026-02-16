---
title: Authorization
---

## Description

The `Authorization` API is the gateway to the framework's security system. It allows you to query a player's permissions and rank, and enforce access control.

While you can use this API directly, it is most commonly used through the **`@Server.Guard()`** decorator, which automatically invokes `enforce()`.

## API Methods

### `hasPermission()`

Checks if a player has a specific permission string (supports wildcards like `admin.*`).

```ts
hasPermission(player: Player, permission: string): Promise<boolean>
```

### `hasRank()`

Checks if a player's rank is equal to or higher than the required level.

```ts
hasRank(player: Player, requiredRank: number): Promise<boolean>
```

### `enforce()`

The primary method for security. It validates requirements and **throws an error** if the player is unauthorized. This is what `@Server.Guard()` uses under the hood.

```ts
enforce(player: Player, requirements: GuardOptions): Promise<void>
```

### `getPrincipal()`

Retrieves the full `Principal` object, including all permissions, rank, and role names.

---

## Decorator Integration

The Authorization API is tightly integrated with decorators:

- **`@Server.Guard({ permission: '...' })`** — Automatically calls `enforce()` before the method executes.
- **`@Server.Command({ ... })`** — Commands use this API to verify rights when combined with guards.

## Examples

### Direct Usage

```ts
@Server.Command('adminmenu')
async openMenu(player: Server.Player) {
  await this.authorization.enforce(player, { rank: 5 })
  // Open menu logic — only runs if player is rank 5+
}
```

### Via Decorator (Recommended)

```ts
@Server.Controller()
export class AdminController {
  @Server.Command('ban')
  @Server.Guard({ permission: 'admin.ban' })
  handleBan(player: Server.Player, targetId: number) {
    // Logic only runs if guard passes
  }
}
```

## Performance Note

`getPrincipal` is called **every time** a guarded method is executed. It is critical to:
1. **Cache results** — Store the principal in the `Player` session metadata after the first load.
2. **Optimize queries** — Avoid heavy database joins in the principal provider.
