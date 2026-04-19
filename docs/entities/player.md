---
title: Player Entity
---

## Description

`Player` is the server-side runtime representation of a connected client.

It extends `BaseEntity` and implements `Spatial` and `NativeHandle`, exposing session identity, communication helpers, movement/dimension controls, transient metadata/state flags, and combat utilities.

## Key Properties

- `clientID` - platform client/source ID.
- `accountID` - linked persistent account ID (if authenticated).
- `name` - display name from player info adapter.
- `dimension` - alias of routing bucket.

## Methods

### Communication

- `emit(eventName: string, ...args: any[])` - send a net event directly to this player.
- `send(message: string, type?: 'chat' | 'error' | 'success' | 'warning')` - convenience private chat output.

### Position and Lifecycle

- `getPosition()` / `setPosition(vector)`
- `getHeading()` / `setHeading(heading)`
- `teleport(vector)`
- `spawn(vector, model?, options?)`
- `setRoutingBucket(bucket)` / `getRoutingBucket()`
- `kick(reason?)`

### State & Metadata

- `setMeta(key, value)` / `getMeta<T>(key)`
- `addState(state)` / `removeState(state)`
- `toggleState(state, force?)`
- `hasState(state)`
- `getStates()`

### Identity and Linking

- `getPlayerIdentifiers()`
- `getIdentifier(identifierType)`
- `getLicense()` (deprecated alias)
- `linkAccount(accountID)` / `unlinkAccount()`

### Health & Combat

- `getHealth()` / `setHealth(value)`
- `getArmor()` / `setArmor(value)`
- `kill()`
- `isAlive()`

### Serialization

- `serialize()` - returns transport-safe player snapshot data.

## Example Usage

```ts

@Command('heal')
handleHeal(player: Player) {
  player.setHealth(200)
  player.setArmor(100)
  player.setMeta('last_heal', Date.now())
  player.send('You were healed', 'success')
}
```

## Spawn Options

`player.spawn(vector, model?, options?)` supports:

- `skipLoadingScreenShutdown?: boolean`

This option is primarily useful in FiveM when the client resource uses `loadscreen_manual_shutdown 'yes'` and needs to control exactly when the loading screen is dismissed.

## Security Integration

`Player` is the first argument in server decorators such as `@Command()` and `@OnNet()`, making it the primary runtime object for authorization, validation, and gameplay actions.
