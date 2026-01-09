---
title: Streaming Service
---

## Description
The `StreamingService` simplifies the process of requesting and loading game assets. In FiveM, assets like models and animations must be explicitly requested and loaded into memory before they can be used. This service provides a `Promise`-based API to handle this cleanly.

## API Methods

### `requestModel()`
Loads a Ped, Vehicle, or Object model into memory.

```ts
async requestModel(model: string | number, timeout?: number): Promise<boolean>
```

### `requestAnimDict()`
Loads an animation dictionary.

### `requestPtfxAsset()`
Loads a particle effect (PTFX) asset.

### `requestTextureDict()`
Loads a texture dictionary for UI or world draw calls.

### `startParticleEffect()`
A high-level helper that ensures the asset is loaded before starting a particle effect at a coordinate.

## Example Usage

```ts
@Client.Controller()
export class EffectController {
  constructor(private readonly streaming: StreamingService) {}

  async playExplosion(pos: Vector3) {
    const handle = await this.streaming.startParticleEffect(
      'core', 
      'ent_anim_dust_exh', 
      pos, 
      { x: 0, y: 0, z: 0 }, 
      2.0
    );
    
    // Auto-releases the asset after use
  }
}
```

## Notes
- **Automatic Tracking**: The service tracks all loaded assets.
- **Resource Cleanup**: You can call `releaseAll()` to free up memory, or use `releaseModel()`, `releaseAnimDict()`, etc., for specific assets.
- **Timeouts**: All request methods include a default 10-second timeout to prevent infinite loops if an asset is missing.
