---
title: 'Characters'
---

# @open-core/characters

Official character domain library for OpenCore.

It provides character lifecycle logic, policy-driven rules, active character state binding, and domain events, without shipping UI.

## Installation

```bash
pnpm add @open-core/characters
```

## Entry Points

- `@open-core/characters/server`
- `@open-core/characters/client`
- `@open-core/characters/shared`

## Recommended Integration (Plugin-First)

Install characters through OpenCore Server Plugin API:

```ts
import * as Server from '@open-core/framework/server'
import {
  CharacterStoreContract,
  charactersServerPlugin,
} from '@open-core/characters/server'

class MyCharacterStore extends CharacterStoreContract {
  async listByAccount(accountId) { return [] }
  async getById(characterId) { return null }
  async create(character) {}
  async update(character) {}
  async delete(characterId) {}
}

await init({
  mode: 'CORE',
  plugins: [
    charactersServerPlugin({
      store: new MyCharacterStore(),
      baseSlots: 3,
      bridgeExternalEvents: false,
    }),
  ],
})
```

## Legacy Module Flow (Still Supported)

```ts
import { CharactersModule } from '@open-core/characters/server'

CharactersModule.setStore(new MyCharacterStore())
CharactersModule.install({
  baseSlots: 3,
  bridgeExternalEvents: false,
})
```

## Server Surface

Main exports:

- `Characters` domain service
- `CharactersModule`
- `charactersServerPlugin(...)`
- `CharactersEvents`
- contracts and policies

Core behavior of `Characters`:

- ownership checks on update/delete/select,
- slot enforcement on create,
- deletion policy enforcement,
- active character metadata (`opencore.characters.active`),
- internal event emission for each domain action.

## Events

Internal domain events via `CharactersEvents`:

- `created`
- `updated`
- `deleted`
- `selected`
- `unselected`

Optional external bridge events are available with `bridgeExternalEvents: true`.

## Client Surface

Client API is intentionally minimal and transport-oriented:

- `CharactersClient`
- `requestCharacterSelect(characterId)`
- `requestCharacterCreate(input)`

No client-side plugin is exposed for this package by design. The library keeps client integration lightweight and focused on event transport.

## Shared Contracts

Use shared contracts to integrate with your own persistence and policy logic:

- `CharacterStoreContract`
- `CharacterSlotPolicyContract`
- `CharacterDeletionPolicyContract`

This keeps your storage and business rules replaceable without changing the domain service API.
