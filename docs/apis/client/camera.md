---
title: Camera
description: Low-level scripted camera control for client-side gameplay and cinematic workflows.
---

## Description

The `Camera` API is the low-level wrapper around FiveM scripted camera natives.
It gives you full control over camera lifecycle, transforms, interpolation, pointing, and shake.

Use this API when you need deterministic camera behavior for gameplay features, custom views, or cutscene tooling.

## When to Use

- Use `Camera` for direct and manual camera control.
- Use `Cinematic` when you need a timeline-based sequence with shots, effects, and runtime control.

## API Methods

### `create()`

Creates a scripted camera and optionally applies the initial transform.

```ts
create(options?: CameraCreateOptions): number
```

### `getActiveCam()`

Returns the currently tracked active camera handle.

```ts
getActiveCam(): number | null
```

### `setActive()`

Sets camera active state and updates internal tracking.

```ts
setActive(cam: number, active: boolean): void
```

### `render()` / `isRendering()`

Enables or disables scripted camera rendering and checks current render status.

```ts
render(enable: boolean, options?: CameraRenderOptions): void
isRendering(): boolean
```

### `destroy()` / `destroyAll()` / `reset()`

Lifecycle cleanup methods.

- `destroy` removes one camera.
- `destroyAll` removes all scripted cameras.
- `reset` disables rendering (if enabled) and clears all managed cameras.

```ts
destroy(cam: number, destroyActiveCam?: boolean): void
destroyAll(destroyActiveCam?: boolean): void
reset(options?: CameraRenderOptions): void
```

### `setPosition()` / `setRotation()` / `setFov()` / `setTransform()`

Applies camera transform values in world space.

```ts
setPosition(cam: number, position: Vector3): void
setRotation(cam: number, rotation: CameraRotation, rotationOrder?: number): void
setFov(cam: number, fov: number): void
setTransform(cam: number, transform: CameraTransform): void
```

### `pointAtCoords()` / `pointAtEntity()` / `stopPointing()`

Controls camera look-at behavior.

```ts
pointAtCoords(cam: number, position: Vector3): void
pointAtEntity(cam: number, entity: number, offset?: Vector3): void
stopPointing(cam: number): void
```

### `interpolate()`

Interpolates between two cameras using native interpolation.

```ts
interpolate(
  fromCam: number,
  toCam: number,
  durationMs: number,
  easeLocation?: boolean,
  easeRotation?: boolean,
): void
```

### `shake()` / `stopShaking()`

Starts or stops camera shake effects.

```ts
shake(cam: number, options: CameraShakeOptions): void
stopShaking(cam: number, stopImmediately?: boolean): void
```

## Core Types

```ts
interface CameraRotation {
  x: number
  y: number
  z: number
}

interface CameraTransform {
  position: Vector3
  rotation?: CameraRotation
  fov?: number
}

interface CameraCreateOptions {
  camName?: string
  active?: boolean
  transform?: CameraTransform
}

interface CameraRenderOptions {
  ease?: boolean
  easeTimeMs?: number
}

interface CameraShakeOptions {
  type: string
  amplitude: number
}
```

## Example

```ts
@Controller()
export class CameraDemoController {
  constructor(private readonly camera: Camera) {}

  async showIntroView() {
    const playerPed = PlayerPedId()
    const [px, py, pz] = GetEntityCoords(playerPed, true)

    const cam = this.camera.create({
      active: true,
      transform: {
        position: { x: px + 2.5, y: py + 2.5, z: pz + 1.2 },
        rotation: { x: -10, y: 0, z: 225 },
        fov: 50,
      },
    })

    this.camera.render(true, { ease: true, easeTimeMs: 300 })
    this.camera.pointAtEntity(cam, playerPed, { x: 0, y: 0, z: 0.8 })
    this.camera.shake(cam, { type: 'HAND_SHAKE', amplitude: 0.2 })

    await new Promise((resolve) => setTimeout(resolve, 2500))

    this.camera.stopShaking(cam)
    this.camera.stopPointing(cam)
    this.camera.render(false, { ease: true, easeTimeMs: 250 })
    this.camera.destroy(cam)
  }
}
```

## Best Practices

- Always cleanup (`destroy`/`destroyAll`/`reset`) when the sequence is done.
- Avoid creating many cameras per frame; reuse handles when possible.
- Keep interpolation durations consistent with your UX pacing.
- Use `setTransform` when applying multiple transform values together.

## Notes

- `Camera` is intentionally low-level and does not provide timeline orchestration.
- `setRotation` defaults to rotation order `2` unless you override it.
- `render(false)` should be called before leaving custom camera flow.

## Visual Samples (Placeholder)

Add screenshots later under:

- `static/img/apis/client/camera/camera-overview.png`
- `static/img/apis/client/camera/camera-lookat.png`
- `static/img/apis/client/camera/camera-interpolate.png`
