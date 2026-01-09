---
title: Introduction to Services
---

## What is a Service?

In OpenCore, a **Service** is a class that encapsulates specific business logic or domain functionality. Services are designed to be reusable, testable, and isolated from the transport layer (like network events or commands).

While **Controllers** act as entry points (handling input), **Services** are the "workers" that perform the actual operations, such as managing vehicles, sending chat messages, or handling persistence.

## 1. Automatic Injection

OpenCore features a built-in Dependency Injection (DI) system. You don't need to manually instantiate services or deal with complex container logic.

When you decorate a class with `@Server.Service()` or `@Server.Bind()`, it becomes available for injection. The framework automatically resolves and injects these dependencies into the constructors of your Controllers or other Services.

### Key Rule:
- **No manual instantiation**: Never use `new MyService()`. Let the framework handle the lifecycle.
- **Constructor Injection**: Simply define the service in your constructor, and OpenCore will provide the instance.

```ts
@Server.Controller()
export class MyController {
  // ChatService is automatically injected here
  constructor(private readonly chatService: ChatService) {}

  @Server.Command('hello')
  sayHello(player: Server.Player) {
    this.chatService.sendPrivate(player, 'Hello from an injected service!')
  }
}
```

## 2. Singleton by Default

Most services in OpenCore are **Singletons**. This means the framework creates only one instance of the service for the entire resource. This allows services to maintain internal state, like registries of active vehicles or rate-limit counters, across different controllers.

## 3. Why use Services?

Using services instead of putting logic directly in controllers provides several benefits:

- **Reusability**: Multiple controllers can use the same logic (e.g., `VehicleService`).
- **Separation of Concerns**: Controllers handle "how" a request arrives, while Services handle "what" to do.
- **Security**: Services centralize authority and validation (e.g., proximity and ownership checks).
- **Testability**: Services can be tested in isolation from the FiveM environment.

## 4. Environment-Specific Behavior

Services in OpenCore are designed to be environment-aware. While the API remains consistent, the underlying implementation might change depending on whether it's running in a `default`, `http`, or `parallel` context.

- **Default**: Standard runtime behavior inside a FiveM resource.
- **Parallel**: Optimized for heavy computation using worker threads (via `ParallelComputeService`).
- **Persistence**: Specialized services that bridge the framework with data providers.

## 5. Services vs. Ports

While Services contain specific logic, OpenCore uses **Ports** for core framework infrastructure that needs to be accessed across resources (like player sessions or permissions). 

If you need to access global framework data, you should look at the [Ports Documentation](/docs/ports/introduction).

## 6. Summary of Core Services

| Service | Responsibility |
| ------- | -------------- |
| **ChatService** | Global and private messaging, radius-based chat. |
| **VehicleService** | Authoritative vehicle spawning and registry management. |
| **VehicleModificationService** | Validated server-side modifications (mods, colors, etc). |
| **PersistenceService** | Orchestrating player data saving and loading. |
| **RateLimiterService** | In-memory protection against execution abuse. |
| **ParallelComputeService** | Offloading heavy tasks to background workers. |
