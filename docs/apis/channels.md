---
title: Channels
---

## Description

The `Channels` API provides a pub/sub communication system for grouping players and broadcasting messages to specific audiences. Channels are ideal for proximity-based systems, team communication, or any scenario where you need to target a subset of connected players.

## API Methods

### `create()`

Creates a new channel with a unique identifier.

```ts
create(channelId: string, options?: ChannelOptions): Channel
```

### `subscribe()` / `unsubscribe()`

Adds or removes a player from a channel.

```ts
subscribe(channelId: string, player: Player): void
unsubscribe(channelId: string, player: Player): void
```

### `broadcast()`

Sends a message to all players subscribed to a channel.

```ts
broadcast(channelId: string, event: string, ...args: any[]): void
```

### `getSubscribers()`

Returns all players currently subscribed to a channel.

---

## Example

```ts
@Controller()
export class TeamController {
  constructor(private readonly channels: Channels) {}

  @OnNet('team:join')
  onJoinTeam(player: Player, teamId: string) {
    this.channels.subscribe(`team:${teamId}`, player)
    this.channels.broadcast(`team:${teamId}`, 'team:member-joined', player.name)
  }
}
```

## Notes

- Channels are server-side only. Clients receive messages via standard net events.
- Channels are automatically cleaned up when all subscribers disconnect.
