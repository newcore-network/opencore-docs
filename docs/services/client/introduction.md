---
title: Introduction to Client Services
---

## What is a Client Service?

Client Services are the backbone of the player's local experience in OpenCore. They encapsulate interaction with the GTA V engine, UI management, and local entity control. Unlike Server Services which handle global authority, Client Services focus on **responsiveness, visuals, and local player interaction**.

## 1. Automatic Injection

Just like on the server, OpenCore handles the lifecycle of client services automatically. By using the `@Client.Controller()` or `@Server.Service()` decorators, dependencies are resolved and injected into your constructor.

### Key Rule:
- **No manual instantiation**: Never use `new MyClientService()`.
- **Constructor Injection**: Define the service in your class constructor to receive the framework-managed instance.

```ts
@Client.Controller()
export class MyUIController {
  // NotificationService is automatically injected
  constructor(private readonly notification: NotificationService) {}

  @Client.Key('E')
  onPressE() {
    this.notification.show('You pressed E!')
  }
}
```

## 2. Environment Awareness

Client services are optimized for the high-frequency nature of the FiveM client. Many services include internal caching or optimized tick-based logic to ensure that gameplay remains smooth (maintaining high FPS).

## 3. Core Responsibilities

Client Services handle several critical areas:
- **Streaming**: Loading and unloading models, animations, and textures.
- **Visuals**: Managing blips, markers, and native notifications.
- **Life Cycle**: Handling the complex process of spawning and resurrecting the player.
- **Interactions**: Displaying progress bars and managing NUI communication.

## 4. Summary of Core Client Services

| Service | Responsibility |
| ------- | -------------- |
| **SpawnService** | Orchestrates the complete player spawn/respawn lifecycle. |
| **NotificationService** | Displays native GTA V notifications, help text, and subtitles. |
| **BlipService** | Manages map icons for entities, positions, and radii. |
| **StreamingService** | High-level API for requesting and releasing game assets (models, anims). |
| **ProgressService** | Displays progress bars with animation and prop support. |
| **StreamingService** | Efficient loading of models, animations, and particles. |
