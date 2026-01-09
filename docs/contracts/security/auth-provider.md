---
title: Auth Provider
---

## Description
The `AuthProvider` contract manages the **Authentication** flow—verifying who a player is. This is distinct from *Authorization* (what they can do), which is handled by the `PrincipalProvider`.

## API Methods

### `authenticate()`
Handles the login logic. It receives credentials (passwords, tokens, or licenses) and returns an `accountID` if successful.

```ts
abstract authenticate(player: Server.Player, credentials: AuthCredentials): Promise<AuthResult>
```

---

### `register()`
Handles the creation of new accounts.

---

### `validateSession()`
Used during reconnections to check if a player's previous session is still valid without requiring a full re-login.

## Example Usage

```ts
@Server.Bind(AuthProviderContract)
export class MyAuthProvider extends AuthProviderContract {
  async authenticate(player: Server.Player, credentials: AuthCredentials) {
    const user = await db.users.findOne({ username: credentials.username });
    
    if (user && verifyPassword(credentials.password, user.hash)) {
      return { success: true, accountID: user.id };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  // ... other methods ...
}
```

## Notes
- Once authenticated, you should call `player.linkAccount(id)` to bind the physical player to your database user.
- The `AuthCredentials` object is flexible and can contain anything from Discord IDs to steam licenses.
