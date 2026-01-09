---
title: Introduction to Contracts
---

## What is a Contract?

In OpenCore, a **Contract** is an abstract definition that specifies a set of rules and methods that a class must implement. Think of them as "Instructions for the Framework".

The framework uses contracts to:
1.  **Define Boundaries**: Ensure that different parts of the system (like databases or auth providers) communicate using a stable, predictable API.
2.  **Ensure Reliability**: By implementing a contract, you guarantee that the framework can rely on certain methods (like `onSessionSave`) being present.
3.  **Allow Flexibility**: You can swap implementations (e.g., changing from a MySQL to a MongoDB database) without changing the core framework code, as long as both implement the same contract.

## 1. How Contracts Work

Contracts are typically `abstract class` definitions. When you want to provide a specific functionality to the framework, you **extend** the contract and **register** your class in the dependency container.

### The Registration Pattern
The framework "asks" for a contract, and you "provide" the implementation.

```ts
// 1. You implement the contract
export class MySqlPersistence extends PlayerPersistenceContract {
  // ... implementation ...
}

// 2. You register it (usually in your main resource entry point)
@Server.Bind(PlayerPersistenceContract)
export class MySqlPersistence extends PlayerPersistenceContract { ... }
```

## 2. Mandatory vs. Optional Contracts

| Contract | Type | Purpose |
| -------- | ---- | ------- |
| **PlayerPersistenceContract** | Optional | Defines how to save/load player data. If not provided, data is transient. |
| **AuthProviderContract** | Optional | Handles login/register logic. Defaults to basic identifier auth if missing. |
| **PrincipalProviderContract** | **Mandatory*** | Required if you use `@Server.Guard()` or permission checks. |
| **Repository** | Optional | A base class for creating type-safe data access layers. |

*\*Note: Some features of the framework will throw errors or disable themselves if their required contracts are not implemented.*

## 3. Why use Contracts?

- **Zero Coupling**: The framework doesn't care *where* your data comes from (SQL, API, JSON files).
- **Validation**: Contracts act as a shield, ensuring that data passed between your resource and the core is correctly structured.
- **Inversion of Control**: You don't call the framework; the framework calls your contract implementation when it needs information.

---

:::info
To see how to implement specific functionality, browse the detailed contract documentation in this section.
:::
