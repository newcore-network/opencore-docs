---
title: Cinematic
description: Timeline-based cinematic orchestration with shots, effects, and runtime controls.
---

## Description

The `Cinematic` API is a high-level timeline system built on top of `Camera`.
It lets you define shot sequences, interpolation behavior, look targets, and camera effects,
then control playback through a runtime handle.

## When to Use

- Use `Cinematic` for intros, mission reveals, scripted moments, and camera tours.
- Use `Camera` directly when you only need one-shot manual camera control.

## Main API

### `scene()`

Creates a fluent `SceneBuilder` bound to this cinematic instance.

```ts
scene(id?: string): SceneBuilder
```

### `start()`

Starts a cinematic immediately and returns a mutable `CinematicHandle`.

```ts
start(scene: SceneBuildable, options?: CinematicStartOptions): CinematicHandle
```

### `play()`

Starts and awaits completion in one call.

```ts
play(scene: SceneBuildable, options?: CinematicStartOptions): Promise<CinematicResult>
```

### `isRunning()` / `cancel()`

Checks if there is an active timeline and cancels it.

```ts
isRunning(): boolean
cancel(): void
```

### `registerEffect()`

Registers a custom reusable effect in the effect registry.

```ts
registerEffect<TParams = Record<string, unknown>>(
  effect: CameraEffectDefinition<TParams>,
): void
```

## Runtime Handle (`CinematicHandle`)

`start()` returns a `CinematicHandle` with mutable runtime controls and events.

### Playback control

```ts
pause(): void
resume(): void
cancel(): void
skip(): void
```

### Live editing

```ts
edit(mutator: (definition: CinematicDefinition) => void): void
insertShot(index: number, shot: CinematicShot): void
replaceShot(shotId: string, shot: CinematicShot): void
setEffects(effects: CameraEffectReference[]): void
addEffect(effect: CameraEffectReference): void
removeEffect(effectId: string): void
```

### Result and events

```ts
result: Promise<CinematicResult>

on<TEventName extends CinematicEventName>(
  eventName: TEventName,
  handler: (payload: CinematicEventPayloadMap[TEventName]) => void,
): () => void
```

Available events:

- `shotStart`
- `shotEnd`
- `effectApplied`
- `paused`
- `resumed`
- `completed`
- `cancelled`
- `interrupted`

## Scene Builder Helpers

### `Pos`

Position/node builders used in shots:

- `Pos.coords(x, y, z)`
- `Pos.entity(entity, offset?)`
- `Pos.entityBone(entity, bone, offset?)`
- `Pos.anchor(name, offset?)`
- `Pos.resolver(() => Vector3 | Promise<Vector3>)`

Each returns a `NodeBuilder` with helpers like `.offset(...)`, `.rot(...)`, and `.fov(...)`.

### `Fx`

Effect builder helpers:

- `Fx.effect(id, params?)`
- `Fx.fadeIn(ms?)`
- `Fx.fadeOut(ms?)`
- `Fx.camShake(type?, amplitude?)`
- `Fx.timecycle(name?, strength?)`
- `Fx.letterbox(top?, bottom?, alpha?)`
- `Fx.subtitle(text, durationMs?)`

Effects can be windowed using `.from(ms)`, `.to(ms)`, or `.window(fromMs, toMs)`.

## Core Types

```ts
type CinematicEase =
  | 'linear'
  | 'inSine'
  | 'outSine'
  | 'inOutSine'
  | 'inCubic'
  | 'outCubic'
  | 'inOutCubic'

interface CinematicShot {
  id?: string
  durationMs?: number
  waitMs?: number
  from?: CameraNodeInput
  to?: CameraNodeInput
  path?: CameraNodeInput[]
  lookAt?: LookAtInput | LookAtInput[]
  ease?: CinematicEase
  effects?: CameraEffectReference[]
}

interface CinematicDefinition {
  id?: string
  skippable?: boolean
  freezePlayer?: boolean
  invinciblePlayer?: boolean
  hideHud?: boolean
  hideRadar?: boolean
  effects?: CameraEffectReference[]
  effectPresets?: string[]
  anchors?: Record<string, Vector3>
  shots: CinematicShot[]
}

interface CinematicStartOptions {
  skipControlId?: number
  cameraName?: string
}

type CinematicResultStatus = 'completed' | 'cancelled' | 'interrupted'

interface CinematicResult {
  status: CinematicResultStatus
  definitionId?: string
}
```

## Example

```ts
@Controller()
export class IntroCinematicController {
  constructor(private readonly cinematic: Cinematic) {}

  async playSpawnIntro() {
    const playerPed = PlayerPedId()

    const scene = this.cinematic
      .scene('spawn_intro')
      .flags({
        skippable: true,
        freezePlayer: true,
        invinciblePlayer: true,
        hideHud: true,
        hideRadar: true,
      })
      .anchor('player_origin', { x: 0, y: 0, z: 0 })
      .effects(Fx.fadeIn(700), Fx.letterbox(0.1, 0.1, 230))
      .shot('opening', (shot) =>
        shot
          .duration(3200)
          .ease('inOutSine')
          .from(Pos.entity(playerPed).offset(-6, -2, 2.4).fov(55))
          .to(Pos.entity(playerPed).offset(-2, -1, 1.4).fov(42))
          .lookAt(Pos.entity(playerPed).offset(0, 0, 0.9))
          .effect(Fx.subtitle('Welcome to OpenCore', 2000).window(800, 2800)),
      )
      .wait('hold', 600)

    const handle = this.cinematic.start(scene, { skipControlId: 200 })

    handle.on('shotStart', (payload) => {
      console.log('Shot started:', payload.shotId ?? payload.shotIndex)
    })

    const result = await handle.result
    console.log('Cinematic finished with status:', result.status)
  }
}
```

## Best Practices

- Use stable shot ids (`id`) if you need runtime patching with `replaceShot`.
- Prefer `scene().play(...)` for simple linear flows and `start(...)` for advanced controls.
- Keep shots focused; split long movements into multiple shots for better tuning.
- Use presets/effects sparingly to avoid visual overload and maintain readability.
- Validate anchors and effect ids early to avoid runtime validation errors.

## Notes

- A new cinematic interrupts any currently running one.
- Invalid scene definitions throw `CinematicValidationError` with detailed issues.
- Built-in effect presets include `dramatic_intro`, `action_chase`, and `dialog_scene`.
- On resource stop, active cinematics are cancelled and camera state is reset.

## Visual Samples (Placeholder)

Add screenshots later under:

- `static/img/apis/client/cinematic/cinematic-timeline-overview.png`
- `static/img/apis/client/cinematic/cinematic-shot-path.png`
- `static/img/apis/client/cinematic/cinematic-effects-layer.png`
