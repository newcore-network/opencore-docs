---
title: Principal Provider
---

## Description
The `PrincipalProvider` is the **authoritative source for authorization**. It tells the framework what permissions and ranks a player has. Without an implementation of this contract, `@Server.Guard()` will always fail as it won't know how to verify the player.

## API Methods

### `getPrincipal()`
The most important method. It must return a `Principal` object containing the player's rank and an array of permission strings.

```ts
abstract getPrincipal(player: Server.Player): Promise<Principal | null>
```

---

### `getPrincipalByLinkedID()`
Allows querying permissions for a player who might be offline (e.g., for a Discord bot or web panel checking if someone is an admin).

---

### `refreshPrincipal()`
Forces the framework to re-fetch permissions from the provider. Use this after a player has been promoted or demoted in-game.

## Example Implementation

```ts
@Server.Bind(PrincipalProviderContract)
export class MySecurityProvider extends PrincipalProviderContract {
  
  async getPrincipal(player: Server.Player) {
    const user = await db.users.find(player.accountID);
    
    return {
      rank: user.admin_level,
      permissions: user.permissions, // e.g. ['vehicle.spawn', 'admin.kick']
      name: user.role_name
    };
  }

  async refreshPrincipal(player: Server.Player) {
    // Logic to clear local cache if you have one
  }

  async getPrincipalByLinkedID(id: string) {
    // Offline lookup logic
  }
}
```

## Performance Note
`getPrincipal` is called **every time** a guarded method is executed. It is critical to:
1.  **Cache results**: Store the principal in the `Player` session metadata after the first load.
2.  **Optimize queries**: Avoid heavy database joins in this method.
