---
title: Appearance API (Server)
---

## Description

The server-side `AppearanceService` provides authoritative control over player appearance data. It works in conjunction with the [Client Appearance API](./client/appearance.md) to ensure appearance changes are validated and synchronized.

## Key Responsibilities

- **Persistence** — Stores and retrieves appearance data from the player's session.
- **Validation** — Ensures appearance data integrity before broadcasting to clients.
- **Synchronization** — Coordinates appearance updates between server state and client rendering.

## Usage

The server-side appearance API is typically used during:
- Player session load (restoring saved appearance)
- Character creation/selection flows
- Admin commands that modify player appearance

```ts
@Server.Controller()
export class CharacterController {
  constructor(private readonly appearance: AppearanceService) {}

  @Server.OnNet('character:select')
  async onCharacterSelect(player: Server.Player, characterId: string) {
    const savedAppearance = player.getMeta('appearance')
    if (savedAppearance) {
      player.emit('appearance:apply', savedAppearance)
    }
  }
}
```

## Notes

- For client-side rendering and direct ped manipulation, see the [Client Appearance API](./client/appearance.md).
- Appearance data should be persisted via the `PlayerPersistenceContract`.
