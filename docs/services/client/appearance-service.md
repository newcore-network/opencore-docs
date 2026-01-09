---
title: Appearance Service
---

## Description
The `AppearanceService` is the client-side authority for managing ped aesthetics. It handles the complex process of applying head blends, face features, overlays (makeup, beard), clothing components, props, and tattoos.

## Key Features

### 1. Sequential Application
Applying appearance in GTA V requires a specific order to avoid glitches. The service automatically handles this:
1.  **HeadBlend**: Essential foundation for face features and overlays.
2.  **Face Features**: Bone-level facial adjustments.
3.  **Components**: Clothing and hair.
4.  **Props**: Hats, glasses, ears.
5.  **Head Overlays**: Skin details and makeup.
6.  **Tattoos**: Applied via decorations.

### 2. Validation
Includes a `validateAppearance` method to ensure data integrity before attempting to apply it to the ped, preventing potential crashes or invalid states.

## API Methods

### `applyAppearance()`
Applies a full `PlayerAppearance` object to a ped handle.

```ts
async applyAppearance(ped: number, appearance: PlayerAppearance): Promise<void>
```

---

### `getAppearance()`
Reads the current clothing and props from a ped. 
*Note: HeadBlend and Overlay data cannot be read back from the engine and must be tracked via state.*

---

### `getNumComponentDrawables()` / `getNumPropDrawables()`
Retrieves the total number of available variations for a specific slot (e.g., how many jackets exist for this model).

## Example Usage

```ts
@Client.Controller()
export class BarberController {
  constructor(private readonly appearance: AppearanceService) {}

  async updateHair(ped: number, drawable: number, texture: number) {
    const current = await this.appearance.getAppearance(ped);
    
    current.components[2] = { drawable, texture };
    
    await this.appearance.applyAppearance(ped, current);
  }
}
```

## Notes
- HeadBlend must be set before FaceFeatures or HeadOverlays will work.
- Tattoos are managed via `addDecoration` and require the collection and overlay hashes.
- Use `setDefaultAppearance()` to reset a ped to its base state.
