---
title: 'Identity'
---

# @open-core/identity

Enterprise-grade identity, authentication, and authorization plugin for the OpenCore Framework.

Identity gives your server a unified way to:
- authenticate players (multi-strategy),
- resolve principals (roles/ranks/permissions),
- and enforce authorization rules,
while staying fully compatible with OpenCore’s dependency injection and lifecycle.

Install it with:
```bash
pnpm add @open-core/identity
```

## Features

- **Multi-Strategy Authentication**
  Supports `local`, `credentials`, and `api` authentication modes.
- **RBAC with Rank + Permissions**
  Principals can be resolved from static roles, a database, or an external API.
- **Permission Overrides**
  Account-level permission overrides support grants, revocations, and wildcard rules.
- **Constructor Injection (DI)**
  Identity services are available through OpenCore’s container with zero manual wiring.
- **Stateless Persistence via Contracts**
  Storage is implemented through `IdentityStore` (required) and `RoleStore` (optional depending on mode).
- **Boot Hooks**
  Wait for external dependencies and run setup logic once Identity is ready.

## Quick Start

Use constructor injection to consume Identity services.

```ts
import { Server } from "@open-core/framework";
import { AccountService } from "@open-core/identity";

@Server.Controller()
export class AdminController {
  constructor(private readonly accounts: AccountService) {}

  @Server.OnNet("admin:ban")
  async ban(player: Server.Player, targetId: string) {
    await this.accounts.ban(targetId, { reason: "Policy violation" });
  }
}
```

## Installation

### 1) Register Stores

Identity requires an `IdentityStore`. Some principal modes also require a `RoleStore`.

```ts
import { Identity } from "@open-core/identity";

Identity.setIdentityStore(MyIdentityStore);
// Optional (only when principal.mode = "db"):
Identity.setRoleStore(MyRoleStore);
```

### 2) Install Identity

```ts
import { Identity } from "@open-core/identity";

Identity.install({
  auth: { mode: "local", autoCreate: true, primaryIdentifier: "license" },
  principal: {
    mode: "roles",
    defaultRole: "user",
    roles: {
      admin: { name: "admin", rank: 100, permissions: ["*"] },
      user:  { name: "user",  rank: 0,   permissions: ["chat.use"] },
    },
  },
});
```

## Configuration Overview

Identity is configured through two main blocks:

* `auth`: how players are authenticated
* `principal`: how roles/rank/permissions are resolved

## Public API

Identity exports a small set of high-level components:

* `Identity`: installation and store registration
* `AuthService`: authentication/registration entrypoint
* `AccountService`, `RoleService`: business services
* `IdentityStore`, `RoleStore`: persistence contracts
* `IDENTITY_OPTIONS`: DI token for advanced container usage
* Relevant types/interfaces for accounts, principals, and roles

## Authentication Modes

`auth.mode` defines how players are identified and authenticated on connection.

Identity supports three authentication modes:

- `local`: authenticate using FiveM identifiers (license/steam/discord/etc.)
- `credentials`: authenticate with username/password stored in your backend
- `api`: delegate authentication to an external HTTP service

All modes are consumed through `AuthService`, which selects the correct provider based on configuration.

## local (Default)

Authenticate using player identifiers (license/steam/discord/etc.). Ideal for classic FiveM servers where players simply join and play.

**Workflow**
1. Player connects.
2. Identity reads the `primaryIdentifier` from the player identifiers.
3. IdentityStore is queried for an account matching that identifier.
4. If missing and `autoCreate=true`, a new account is created and linked.

```ts
Identity.install({
  auth: {
    mode: "local",
    primaryIdentifier: "license",
    autoCreate: true,
  },
});
```

## credentials

Username/password authentication stored in your system (passwords are hashed with `bcrypt`).

**Workflow**

1. Player registers via your event/command/UI.
2. Credentials are stored (hashed).
3. Player logs in using credentials on next sessions.

```ts
Identity.install({
  auth: { mode: "credentials" },
});
```

## api

Delegates auth to your external HTTP service. Useful for networks with centralized accounts/SSO.

**Workflow**

1. Identity sends identifiers + credentials to your API.
2. Your API returns `{ success, accountId, account?, isNewAccount? }`.
3. Identity links the returned account to the player.

```ts
Identity.install({
  auth: {
    mode: "api",
    primaryIdentifier: "license",
    api: {
      baseUrl: "https://auth.example.com",
      authPath: "/auth",
      registerPath: "/register",
      sessionPath: "/session",
      logoutPath: "/logout",
    },
  },
});
```

### API Payload (Minimal Shape)

Request:

```json
{
  "action": "authenticate",
  "accountId": null,
  "primaryIdentifier": "license:abc123",
  "identifiers": [{ "type": "license", "value": "license:abc123" }],
  "credentials": { "username": "john", "password": "123" }
}
```

Response:

```json
{
  "success": true,
  "accountId": "42",
  "isNewAccount": false
}
```

## Principal Modes (Authorization)

`principal.mode` defines how Identity resolves the player's **principal** (role/rank/permissions).

Identity supports:

- `roles`: static roles defined in code
- `db`: roles loaded from your database using `RoleStore`
- `api`: roles resolved by an external HTTP service

## roles (Static)

Roles are defined in your `Identity.install()` options.

**Best for**
- predefined staff/user roles
- fast setup
- minimal infrastructure

```ts
Identity.install({
  principal: {
    mode: "roles",
    defaultRole: "user",
    roles: {
      admin: { name: "admin", rank: 100, permissions: ["*"], displayName: "Staff" },
      user:  { name: "user",  rank: 0,   permissions: ["chat.use"], displayName: "Player" }
    },
    cacheTtl: 600000
  },
});
```

## db (Dynamic)

Roles are resolved from a database through `RoleStore`. Identity caches results using `cacheTtl`.

**Setup**

1. Register `RoleStore` via `Identity.setRoleStore()`.
2. Use `principal.mode = "db"`.

```ts
Identity.setRoleStore(MyRoleStore);

Identity.install({
  principal: { mode: "db", defaultRole: "1" }
});
```

## api (External)

Principal resolution is delegated to your API. Your API returns principal data such as rank, permissions, and optional metadata.

```ts
Identity.install({
  principal: {
    mode: "api",
    api: {
      baseUrl: "https://api.mynetwork.com",
      principalPath: "/v1/game/principal"
    }
  }
});
```

## Permission Resolution Rules

Identity merges permissions using a strict priority:

1. **Explicit Revocation**: `-permission` denies access even if the role grants it.
2. **Explicit Grant**: `+permission` or `permission` grants access.
3. **Wildcard Override**: `*` grants access.
4. **Role Permissions**: falls back to role permissions (supports `*`).

This allows precise per-account overrides without modifying global roles.

## Implementing Contracts (Stores)

Identity is stateless by design: persistence is implemented through contracts.

You must implement:

- `IdentityStore` (required): accounts, identifiers, bans, credential lookups
- `RoleStore` (optional): only required when `principal.mode = "db"`

## IdentityStore (Required)

IdentityStore is responsible for loading and persisting account state.

**Common required methods**
- `findByIdentifier(identifier)`
- `findByLinkedId(linkedId)`
- `findByUsername(username)` (used in credentials mode)
- `create(data)`
- `update(id, data)`
- `setBan(id, banned, reason?, expiresAt?)`

### Example Skeleton

```ts
import { IdentityStore, IdentityAccount } from "@open-core/identity";

export class MyIdentityStore extends IdentityStore {
  async findByIdentifier(identifier: string): Promise<IdentityAccount | null> { /* ... */ return null; }
  async findByLinkedId(linkedId: string): Promise<IdentityAccount | null> { /* ... */ return null; }
  async findByUsername(username: string): Promise<IdentityAccount | null> { /* ... */ return null; }

  async create(data: any): Promise<IdentityAccount> { /* ... */ throw new Error("not implemented"); }
  async update(id: any, data: any): Promise<void> { /* ... */ }
  async setBan(id: any, banned: boolean, reason?: string, expiresAt?: Date): Promise<void> { /* ... */ }
}
```

### Register Before Install

```ts
import { Identity } from "@open-core/identity";

Identity.setIdentityStore(MyIdentityStore);

Identity.install({
  auth: { mode: "local" },
  principal: { mode: "roles", roles: { user: { name: "user", rank: 0, permissions: [] } } }
});
```

## RoleStore (Only for principal.mode = db)

RoleStore loads roles dynamically.

Typical methods:

* `findById(id)`
* `findByRank(rank)`
* `getDefaultRole()`
* plus any save/delete operations you support in your backend

```ts
import { RoleStore } from "@open-core/identity";

export class MyRoleStore extends RoleStore {
  async findById(id: any) { /* ... */ return null; }
  async findByRank(rank: number) { /* ... */ return null; }
  async getDefaultRole() { /* ... */ return { id: "user", name: "user", rank: 0, permissions: [] }; }
}
```

Register it before install:

```ts
Identity.setRoleStore(MyRoleStore);
```

## Use Cases

This guide shows three common Identity setups and practical solutions for typical integration problems.

## 1) Traditional FiveM Server (local + roles)

Automatic login using identifiers, roles defined in code.

```ts
Identity.install({
  auth: { mode: "local", autoCreate: true, primaryIdentifier: "license" },
  principal: {
    mode: "roles",
    defaultRole: "user",
    roles: {
      admin: { name: "admin", rank: 100, permissions: ["*"], displayName: "Staff" },
      user:  { name: "user",  rank: 0,   permissions: ["chat.use"], displayName: "Player" }
    }
  }
});
```

## 2) Integrated Web Dashboard (api + api)

Authentication and permissions resolved by a central service.

```ts
Identity.install({
  auth: {
    mode: "api",
    api: {
      baseUrl: "https://api.mynetwork.com",
      timeoutMs: 5000,
      headers: { Authorization: "Bearer internal-secret" }
    }
  },
  principal: {
    mode: "api",
    api: {
      baseUrl: "https://api.mynetwork.com",
      principalPath: "/v1/game/principal"
    }
  }
});
```

## 3) Persistent Database System (credentials + db)

Username/password accounts + roles stored in SQL.

```ts
Identity.setIdentityStore(MyIdentityStore);
Identity.setRoleStore(MyRoleStore);

Identity.install({
  auth: { mode: "credentials" },
  principal: { mode: "db", defaultRole: "1" }
});
```

---

## Common Problems

### A) Per-Account Permission Overrides

Grant a permission to a single player without changing their role:

```ts
await accountService.addCustomPermission(player.accountID, "teleport.self");
```

Revoke a permission even if their role grants it:

```ts
await accountService.addCustomPermission(player.accountID, "-chat.global");
```

### B) Waiting for External Dependencies

Ensure Identity does not query storage before your database is ready:

```ts
Identity.install({
  hooks: {
    waitFor: [MyDatabase.connect()],
    onReady: async () => {
      console.log("Identity system ready!");
    }
  }
});
```

### C) Refreshing Principal Data

When rank/permissions change, refresh the principal so checks fetch updated data:

```ts
await principalProvider.refreshPrincipal(player);
```