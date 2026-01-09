---
title: Introduction to Ports
---

## What is a Port?

In OpenCore, a **Port** is an architectural boundary that defines a contract for a core service. It follows the **Hexagonal Architecture (Ports & Adapters)** pattern. 

Ports allow the framework to remain **mode-agnostic**. This means your code can interact with "Core" functionality (like player directories or permissions) without knowing *how* or *where* that data is stored.

## 1. The Core-Side Boundary

The primary problem Ports solve is the **Resource vs. Core** isolation. In FiveM, code usually runs in isolated resources. 

- If you are writing a **Core** resource, the data is local (in memory).
- If you are writing a **Gameplay** resource, the data belongs to the Core and must be accessed via exports or network events.

**Ports abstract this away.** When you inject a Port, the framework automatically provides the correct implementation based on the environment:
- In the Core, it provides a **Local Adapter** (direct access).
- In a Resource, it provides a **Remote Adapter** (transparently calling Core exports).

## 2. Why use Ports instead of Services?

While Services handle business logic, **Ports** handle **Framework Infrastructure**. 

| Feature | Service | Port |
| ------- | ------- | ---- |
| **Logic** | Specific (Vehicles, Chat) | General (Sessions, Permissions) |
| **Location** | Defined in any resource | Defined by the Framework Core |
| **Access** | Local to the resource | Cross-resource (Remote access) |
| **Injection** | Via `@Server.Service()` | Via abstract class injection |

## 3. How it works (Remote Access)

When you ask for a Port in a resource that isn't the Core:
1. The framework detects it's in `RESOURCE` mode.
2. it injects a "Proxy" implementation of the Port.
3. Every method call you make is automatically routed to the Core resource.
4. The result is returned to your resource as if it were local.

```ts
@Server.Controller()
export class MyController {
  // You don't care if the player directory is local or in another resource
  constructor(private readonly playerDirectory: PlayerDirectoryPort) {}

  @Server.Command('online')
  checkOnline(player: Server.Player) {
    const total = this.playerDirectory.getAll().length;
    // ...
  }
}
```

## 4. Key Ports available

- **[PlayerDirectoryPort](/docs/ports/player-directory)**: Access to active player sessions and metadata.
- **[PrincipalPort](/docs/ports/principal)**: Access to permissions, ranks, and authorization.
- **[CommandExecutionPort](/docs/ports/command-execution)**: Registration and routing of chat commands.
- **[PlayerSessionLifecyclePort](/docs/ports/session-lifecycle)**: Creating and destroying sessions (Core-only).

---

:::info
For more details on how to use these in your logic, see the [Services Section](/docs/services/introduction).
:::
