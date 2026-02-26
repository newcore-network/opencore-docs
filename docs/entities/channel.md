---
title: Channel
---

## Description

A **Channel** is a server-side entity that represents a communication group. Channels allow you to organize players into logical groups and broadcast messages to specific audiences without manually tracking player lists.

## Use Cases

- **Team chat** — Group players by faction, job, or team.
- **Proximity zones** — Subscribe players when they enter an area, unsubscribe when they leave.
- **Radio systems** — Simulate radio frequencies where only subscribed players receive messages.
- **Instanced content** — Group players in the same mission or dungeon instance.

## How it Works

Channels are managed through the [Channels API](../apis/channels.md). You create a channel, subscribe players to it, and broadcast events to all subscribers.

```ts
@Controller()
export class RadioController {
  constructor(private readonly channels: Channels) {}

  @OnNet('radio:tune')
  onTune(player: Player, frequency: string) {
    this.channels.subscribe(`radio:${frequency}`, player)
    player.send(`Tuned to frequency ${frequency}`, 'chat')
  }

  @OnNet('radio:speak')
  onSpeak(player: Player, frequency: string, message: string) {
    this.channels.broadcast(`radio:${frequency}`, 'radio:message', player.name, message)
  }
}
```

## Notes

- Channels are **server-side only**. Clients receive messages via standard net events.
- Players are automatically unsubscribed when they disconnect.
- Channels are lightweight — create as many as needed without performance concerns.
