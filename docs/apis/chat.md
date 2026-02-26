---
title: Chat
---

## Description

`Chat` is the server runtime API for sending chat messages to players. It abstracts underlying network events and provides a clean API for broadcast, private, and proximity communication.

By using this service instead of raw `emitNet` calls, you ensure that messages follow the framework's standard formatting and color protocols.

## API Methods

### `broadcast()`

Sends a message to every player currently connected to the server.

```ts
broadcast(message: string, author?: string, color?: RGB)
```

- **message** — The text content of the message.
- **author** — (Optional) The name shown as the sender. Defaults to `SYSTEM`.
- **color** — (Optional) An RGB object `{ r, g, b }`. Defaults to white.

### `sendPrivate()`

Sends a message to a specific player.

```ts
sendPrivate(player: Player, message: string, author?: string, color?: RGB)
```

### `sendNearby()`

Sends a message to all players within a certain distance of an origin player. Ideal for local roleplay chat.

```ts
sendNearby(playerFrom: Player, message: string, radius: number, author?: string, color?: RGB)
```

### `clearChat()` / `clearChatAll()`

Clears the chat box for a specific player or for everyone on the server.

### `broadcastSystem()`

A helper method to send important system-wide alerts with a distinct light blue color.

---

## Example

```ts
@Controller()
export class ChatController {
  constructor(private readonly chat: Chat) {}

  @Command('me')
  handleMe(player: Player, message: string) {
    this.chat.sendNearby(player, message, 10.0, `* ${player.name}`, { r: 200, g: 100, b: 200 })
  }

  @Command('announce')
  @Guard(AdminGuard)
  handleAnnounce(player: Player, message: string) {
    this.chat.broadcastSystem(`ANNOUNCEMENT: ${message}`)
  }
}
```

## Notes

- All messaging is performed via network events (`core:chat:message`, `core:chat:addMessage`).
- Colors are passed as simple objects: `{ r: 255, g: 255, b: 255 }`.
