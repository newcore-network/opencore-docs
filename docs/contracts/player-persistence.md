---
title: Player Persistence
---

## Description
The `PlayerPersistenceContract` defines the lifecycle hooks for saving and loading player data. It is the bridge between the framework's runtime `Player` entity and your physical database.

## API Methods

### `onSessionLoad()`
Called automatically when a player joins the server. Use this to fetch data from your database and populate the player's metadata.

```ts
abstract onSessionLoad(player: Player): Promise<void>
```

---

### `onSessionSave()`
Called when a player disconnects or when a manual save is triggered. This is where you write the current state of the player back to your database.

---

### `onAutoSave()`
Called periodically based on the `config` interval. You can implement a "lightweight" save here or simply call `onSessionSave`.

## Configuration
Every implementation must provide a `PersistenceConfig` object:

- `autoSaveEnabled`: (boolean) Enable/disable periodic saves.
- `autoSaveIntervalMs`: (number) Time between auto-saves (default: 5 minutes).

## Example Implementation

```ts
import { PlayerPersistenceContract, PersistenceConfig, Player } from '@open-core/framework/server'

@Server.Bind(PlayerPersistenceContract)
export class MyDatabaseProvider extends PlayerPersistenceContract {
  readonly config: PersistenceConfig = {
    autoSaveEnabled: true,
    autoSaveIntervalMs: 300000
  }

  async onSessionLoad(player: Player) {
    const data = await MySQL.query('SELECT * FROM users WHERE license = ?', [player.license]);
    if (data[0]) {
      player.setMeta('money', data[0].money);
      player.setMeta('job', data[0].job);
    }
  }

  async onSessionSave(player: Player) {
    const money = player.getMeta('money');
    await MySQL.update('UPDATE users SET money = ? WHERE license = ?', [money, player.license]);
  }

  async onAutoSave(player: Player) {
    await this.onSessionSave(player);
  }
}
```

## Notes
- The framework handles the **timing** of these calls; you only provide the **logic**.
- If no class implements this contract, player data will reset every time they reconnect.
