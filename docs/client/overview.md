---
title: Client Runtime Overview
---

## What is the Client Runtime?

The Client Runtime is the player-facing layer of OpenCore. It handles interaction with the GTA V engine, UI management, and local entity control. Unlike the server which handles global authority, the client focuses on **responsiveness, visuals, and local player interaction**.

## Automatic Injection

Just like on the server, OpenCore handles the lifecycle of client services automatically. Use `@Controller()` to define entry points and `@Service()` for reusable client business logic.

```ts
@Service()
export class NotificationFacade {
  constructor(private readonly notification: NotificationService) {}

  showReady() {
    this.notification.show('You pressed E!')
  }
}

@Controller()
export class MyUIController {
  constructor(private readonly notifications: NotificationFacade) {}

  @Key('E')
  onPressE() {
    this.notifications.showReady()
  }
}
```

**Key rule**: Never use `new MyService()`. Define the service in your constructor to receive the framework-managed instance.

## Core Responsibilities

The client runtime handles several critical areas:

- **Streaming** — Loading and unloading models, animations, and textures.
- **Visuals** — Managing blips, markers, and native notifications.
- **Life Cycle** — Handling the complex process of spawning and resurrecting the player.
- **Interactions** — Displaying progress bars and managing WebView communication.
- **Input** — Binding keyboard keys and game events to controller methods.

## Available Client APIs

| API | Responsibility |
| --- | --- |
| **[Spawn](../apis/client/spawn.md)** | Orchestrates the complete player spawn/respawn lifecycle. |
| **[Appearance](../apis/client/appearance.md)** | Manages ped aesthetics (clothing, face, tattoos). |
| **[Notifications](../apis/client/notifications.md)** | Displays native GTA V notifications, help text, and subtitles. |
| **[Blips](../apis/client/blips.md)** | Manages map icons for entities, positions, and radii. |
| **[Markers](../apis/client/markers.md)** | Renders 3D markers in the game world. |
| **[Peds](../apis/client/peds.md)** | Spawns and manages NPCs with animations and AI tasks. |
| **[TextUI](../apis/client/textui.md)** | Renders 2D/3D text prompts and labels. |
| **[Streaming](../apis/client/streaming.md)** | High-level API for requesting and releasing game assets. |
| **[Progress](../apis/client/progress.md)** | Displays progress bars with animation and prop support. |
| **[Vehicle](../apis/client/vehicle.md)** | Client-side vehicle interaction (synchronized and local). |

## Design Notes

- Client controllers are **event-driven**, not request-driven.
- Prefer `@Interval()` over `@OnTick()` when possible to reduce CPU usage.
- `@LocalEvent()` is the recommended way to communicate between client systems.
- WebView communication is explicit and isolated through `@OnView()`.
