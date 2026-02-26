---
title: Authorization Port
---

## Description
The `Authorization` port is the gateway to the framework's security system. It allows you to query a player's **Principal** (permissions and rank) and enforce access control.

While you can use this port directly, it is most commonly used through the **`@Guard()`** decorator, which automatically invokes `enforce()`.

## API Methods

### `hasPermission()`
Checks if a player has a specific permission string (supports wildcards like `admin.*`).

```ts
abstract hasPermission(player: Player, permission: string): Promise<boolean>
```

---

### `hasRank()`
Checks if a player's rank is equal to or higher than the required level.

```ts
abstract hasRank(player: Player, requiredRank: number): Promise<boolean>
```

---

### `enforce()`
The primary method for security. It validates requirements and **throws an error** if the player is unauthorized. 

**This method is what `@Guard()` uses under the hood.**

```ts
abstract enforce(player: Player, requirements: GuardOptions): Promise<void>
```

---

### `getPrincipal()`
Retrieves the full `Principal` object, including all permissions, rank, and role names.

## Decorator Integration

The `Authorization` port is tightly integrated with the framework's decorators:

- **`@Guard({ permission: '...' })`**: Automatically calls `authorization.enforce()` before the method executes.
- **`@Command({ ... })`**: Commands use this port to verify if a player has the rights to execute them if combined with guards.

## Example

### Direct Usage
```ts
@Command('adminmenu')
async openMenu(player: Player) {
  // This will throw and stop execution if the player isn't rank 5 or higher
  await this.principalPort.enforce(player, { rank: 5 });
  
  // Open menu logic...
}
```

### Via Decorator (Recommended)
```ts
@Controller()
export class AdminController {
  @Command('ban')
  @Guard({ permission: 'admin.ban' }) // cleaner and more declarative
  handleBan(player: Player, targetId: number) {
    // Logic only runs if guard passes
  }
}
```
