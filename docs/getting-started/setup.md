---
title: Setup
---

## Overview

From **v0.3.x onward**, OpenCore follows a **zero-config by default** philosophy.

This means:
- You can start a server with `Server.init({ mode: 'CORE' })` and everything works.
- Core systems (commands, players, net events, identity, sessions) are auto-configured.
- Reasonable **default implementations** are installed internally.

The **Setup API** exists for **advanced customization**, not as a requirement.

You only need it if you want to **replace or extend core behavior**.

---

## What is a Setup?

A *setup* is a set of explicit registrations into the global DI container **before** `Server.init()` runs.

Internally, OpenCore uses a global dependency container (`GLOBAL_CONTAINER`).  
Setup helpers allow you to register your own implementations for critical contracts.

Typical use cases:
- Custom authentication / permissions
- Custom persistence (database, cache, API)
- Security hardening
- Centralized error handling

---

## Available setup functions

### Principal Provider

```ts
import { Server } from '@open-core/framework/server'

Server.setPrincipalProvider(MyPrincipalProvider)
````

Registers a custom implementation of:

* `PrincipalProviderContract`

**What it controls:**

* Player identity
* Roles, permissions, claims
* Authorization logic used by `@Server.Guard`

**Default behavior if not set:**

* A **default principal provider** is installed automatically
* Guards follow a **deny-by-default** model
* Suitable for development and simple servers

Use a custom provider if you need:

* Database-backed roles
* External auth (API, Discord, OAuth, etc.)
* Advanced permission models

---

### Security Handler

```ts
Server.setSecurityHandler(MySecurityHandler)
```

Registers:

* `SecurityHandlerContract`

**What it controls:**

* How security rules are evaluated
* How guards, states, and permissions are enforced

**Default behavior if not set:**

* Built-in security handler is used
* Guards, throttles, and state checks work out of the box

You usually only replace this for **deep framework integrations**.

---

### Player Persistence Provider

```ts
Server.setPersistenceProvider(MyPlayerPersistence)
```

Registers:

* `PlayerPersistenceContract`

**What it controls:**

* How player data is stored and restored
* Session persistence and recovery

**Default behavior if not set:**

* In-memory persistence
* Data is lost on restart
* Session recovery still works for hot-reload scenarios

Use a custom provider if you want:

* Database persistence (SQL / NoSQL)
* Redis-backed sessions
* External player state storage

---

### Net Event Security Observer

```ts
Server.setNetEventSecurityObserver(MyNetEventObserver)
```

Registers:

* `NetEventSecurityObserverContract`

**What it controls:**

* Observes and validates incoming network events
* Can log, block, rate-limit, or audit events

**Default behavior if not set:**

* A safe internal observer is used
* Basic validation and security checks are applied

Useful for:

* Anti-cheat
* Network auditing
* Advanced telemetry

---

### Command Error Observer

```ts
Server.setCommandErrorObserver(MyCommandErrorObserver)
```

Registers:

* `CommandErrorObserverContract`

**What it controls:**

* How command errors are handled and reported
* Logging, player feedback, telemetry

**Default behavior if not set:**

* Errors are logged
* Players receive usage-based error messages automatically

Useful if you want:

* Custom error messages
* Centralized logging
* External monitoring

---

## When setups are required

Most setups are **optional**.

The only case where setup is **mandatory**:

### Principal Provider in CORE / STANDALONE

If:

* `principal` feature is enabled (default)
* Mode is `CORE` or `STANDALONE`
* And no provider is registered

Then:

* OpenCore will **fail fast** during bootstrap
* A clear fatal error is logged

This is intentional to prevent insecure deployments.

---

## Execution order (important)

Setups **must be executed before** calling `Server.init()`.

Correct pattern:

```ts
import { Server } from '@open-core/framework/server'

Server.setPrincipalProvider(MyPrincipalProvider)
Server.setPersistenceProvider(MyPersistence)

await Server.init({
  mode: 'CORE',
})
```

Incorrect pattern (too late):

```ts
await Server.init({ mode: 'CORE' })
Server.setPrincipalProvider(MyPrincipalProvider) // ❌ ignored
```

---

## How setups integrate with bootstrap

During bootstrap, OpenCore:

1. Registers platform adapters (FiveM / Node)
2. Registers core services
3. Loads framework controllers
4. Registers system processors
5. **Checks required providers**
6. Scans decorators and binds runtime behavior
7. Emits `core:ready`

Setup functions affect steps **3–6**.

If a setup is missing:

* Defaults are applied
* Or a fatal error is thrown if the contract is mandatory

---

## core:ready and setups

The `core:ready` event is emitted **after**:

* All setups are resolved
* Controllers are loaded
* System processors are registered

This guarantees that:

* Resources waiting for CORE can safely start
* All contracts and providers are available

You should **not** perform setup logic inside `core:ready`.

---

## Summary

* Setup is **optional**, not mandatory
* Defaults exist for everything except critical security contracts
* Use setups only when you need custom behavior
* Always configure setups **before** `Server.init()`
* `core:ready` is automatic and reliable

This keeps OpenCore:

* Safe by default
* Flexible when needed
* Predictable in production