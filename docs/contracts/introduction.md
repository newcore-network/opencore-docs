---
title: Introduction to Contracts
---

## What is a Contract?

In OpenCore, a **Contract** is an abstract definition that specifies a stable set of methods the framework can rely on.  
Think of contracts as **formal boundaries between the framework and your application logic**.

Contracts allow OpenCore to remain decoupled from:
- Databases
- Authentication systems
- Permission models
- Persistence layers
- Security policies

While still enabling powerful extensibility.

The framework uses contracts to:
1. **Define boundaries** – Different subsystems communicate through stable, predictable APIs.
2. **Ensure reliability** – Required lifecycle methods (such as `onSessionSave`) are always present.
3. **Enable flexibility** – Implementations can be swapped without modifying the framework itself.

---

## 1. How Contracts Work

Contracts are defined as `abstract class` definitions.

To customize framework behavior, you:
1. **Extend** a contract
2. **Register** the implementation before the framework boots

From **v0.3.x onward**, contracts are **not registered implicitly**.  
Registration happens through the **Setup API**, not decorators.

---

### Registration model (v0.3+)

The framework *requests* a contract.  
You *provide* an implementation explicitly.

```ts
import { Server } from '@open-core/framework/server'

Server.setPersistenceProvider(MySqlPersistence)
````

This registration must happen **before** calling `Server.init()`.

---

### About `@Server.Bind`

The `@Server.Bind()` decorator **does not configure contracts**.

Its purpose is:

* Marking a class as injectable
* Enabling constructor-based dependency injection
* Ensuring proper resolution inside controllers and services

Example:

```ts
@Server.Bind()
export class MySqlPersistence extends PlayerPersistenceContract {
  // injectable class
}
```

Use `@Server.Bind` for **dependency injection**,
use `Server.setX(...)` for **framework configuration**.

---

## 2. Required vs Optional Contracts

Not all contracts must be implemented.
OpenCore provides **safe defaults** for most of them.

| Contract                             | Required                         | Default behavior if not provided                 |
| ------------------------------------ | -------------------------------- | ------------------------------------------------ |
| **PrincipalProviderContract**        | ⚠️ Required in CORE / STANDALONE | Default provider (deny-by-default)               |
| **PlayerPersistenceContract**        | Optional                         | In-memory persistence (no data survives restart) |
| **SecurityHandlerContract**          | Optional                         | Internal handler (block + log)                   |
| **NetEventSecurityObserverContract** | Optional                         | Internal observer                                |
| **Repository**                       | Optional                         | Not used unless extended                         |

Notes:

* RESOURCE mode delegates required contracts to CORE.
* Missing required contracts cause a **fail-fast bootstrap error**.
* Optional contracts always have internal defaults.

---

## 3. Why use Contracts?

* **Zero coupling** – The framework never depends on concrete implementations.
* **Predictable execution** – The framework controls when and how your logic runs.
* **Inversion of control** – You provide behavior; the framework orchestrates it.
* **Security by default** – Missing implementations never result in permissive behavior.

Contracts ensure OpenCore remains:

* Modular
* Testable
* Safe by default
* Extensible without hacks

---

## Requirement rules

* Some contracts are required **depending on runtime mode**.
* Required contracts must be registered **before `Server.init()`**.
* If a required contract is missing, the framework will:

  * Log a fatal error
  * Abort initialization
* Defaults are applied only when explicitly allowed.

This design prevents silent misconfiguration in production environments.