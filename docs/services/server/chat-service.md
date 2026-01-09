---
title: Chat Service
---

## Description
The `ChatService` is the central authority for sending chat messages to players. It abstracts the underlying network events and provides a clean API for broadcasting, private messaging, and radius-based communication.

By using this service instead of raw `emitNet` calls, you ensure that messages follow the framework's standard formatting and color protocols.

## API Methods

### `broadcast()`
Sends a message to every player currently connected to the server.

```ts
broadcast(message: string, author?: string, color?: RGB)
```
- **message**: The text content of the message.
- **author**: (Optional) The name shown as the sender. Defaults to `SYSTEM`.
- **color**: (Optional) An RGB object `{ r, g, b }`. Defaults to white.

---

### `sendPrivate()`
Sends a message to a specific player.

```ts
sendPrivate(player: Server.Player, message: string, author?: string, color?: RGB)
```
- **player**: The `Server.Player` instance of the recipient.
- **message**: The text content.
- **author**: Defaults to `Private`.
- **color**: Defaults to a light grey.

---

### `sendNearby()`
Sends a message to all players within a certain distance of an origin player. This is ideal for local roleplay chat.

```ts
sendNearby(playerFrom: Server.Player, message: string, radius: number, author?: string, color?: RGB)
```
- **playerFrom**: The player acting as the center of the radius.
- **radius**: Distance in game units.
- **author**: Defaults to the name of `playerFrom`.

---

### `clearChat()` / `clearChatAll()`
Clears the chat box for a specific player or for everyone on the server.

---

### `broadcastSystem()`
A helper method to send important system-wide alerts with a distinct light blue color.

## Example Usage

```ts
@Server.Controller()
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Server.Command('me')
  handleMe(player: Server.Player, message: string) {
    // Send a message to everyone within 10 meters
    this.chat.sendNearby(player, message, 10.0, `* ${player.name}`, { r: 200, g: 100, b: 200 })
  }

  @Server.Command('announce')
  @Server.Guard(AdminGuard)
  handleAnnounce(player: Server.Player, message: string) {
    this.chat.broadcastSystem(`ANNOUNCEMENT: ${message}`)
  }
}
```

## Notes
- All messaging is performed via network events (`core:chat:message`, `core:chat:addMessage`).
- The service relies on a `PlayerDirectory` to locate players for nearby checks.
- Colors are passed as simple objects: `{ r: 255, g: 255, b: 255 }`.
