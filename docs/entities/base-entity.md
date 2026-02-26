---
title: Base Entity Contracts
---

## Description

OpenCore entities are built from three foundational contracts used across server runtime objects:

- `BaseEntity` - identity, state flags, metadata, dimension, and snapshots.
- `Spatial` - position and heading operations.
- `NativeHandle` - access to runtime-native entity handle.

Most concrete entities (such as `Player`, `Vehicle`, and `NPC`) extend/implement these contracts.

## BaseEntity

`BaseEntity` is the shared abstract class for runtime entities.

### Core Identity

- `id: EntityId` - format: `kind:id` (example: `player:12`, `npc:spawn-1`).
- `kind: string` - inferred from `id` prefix.

### State Flags

- `add(state: string)`
- `has(key: string)`
- `all()`
- `delete(key: string)`
- `clearStates()`
- `toggle(state: string, force?: boolean)`

Use these for transient execution flags (for example, `dead`, `cuffed`, `frozen`).

### Metadata

- `setMeta<T>(key: string, value: T)`
- `getMeta<T>(key: string)`
- `hasMeta(key: string)`
- `deleteMeta(key: string)`
- `getAllMeta()`
- `clearMeta()`

Metadata is runtime-scoped and not automatically persisted.

### Dimension and Streaming

- `dimension` getter/setter
- `streamDistance` getter/setter

Concrete entities can override these accessors to map into platform-specific concepts (for example, routing buckets).

### Serialization

- `snapshot()`
- `restore(snapshot)`

These methods are useful for diagnostics, temporary transport, and state reconstruction flows.

## Spatial

`Spatial` defines location and heading behavior:

```ts
interface Spatial {
  getPosition(): Vector3
  setPosition(v: Vector3): void
  getHeading(): number
  setHeading(heading: number): void
}
```

## NativeHandle

`NativeHandle` standardizes access to the engine/native handle:

```ts
interface NativeHandle {
  getHandle(): number
}
```

This is useful for integrations that still need low-level native interoperability.

## Example

```ts
function logEntityCore(entity: Player | NPC) {
  const snap = entity.snapshot()
  console.log(`[${snap.kind}] id=${snap.id} dim=${snap.dimension}`)

  if (entity.has('frozen')) {
    entity.delete('frozen')
  }
}
```
