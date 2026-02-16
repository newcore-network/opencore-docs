---
title: Progress
---

## Description

The `ProgressService` provides a visual indicator for timed actions (e.g., "Repairing Vehicle", "Searching Bin"). It handles the UI, player animations, and prop attachments in a single call.

## API Methods

### `start()`

Starts a progress bar and waits for it to complete or be cancelled.

```ts
async start(options: ProgressOptions): Promise<boolean>
```

**Options include:**
- `label` — Text shown on the bar.
- `duration` — Time in milliseconds.
- `animation` — (Optional) Dict and Anim to play.
- `prop` — (Optional) Model and Bone to attach.
- `disableMovement` / `disableCombat` — Security flags to restrict player actions.
- `canCancel` — Whether the player can cancel (e.g., by pressing ESC).
- `useCircular` — Use a circular busy spinner instead of a linear bar.

---

## Example

```ts
@Client.Controller()
export class RepairController {
  constructor(private readonly progress: ProgressService) {}

  async repairVehicle() {
    const completed = await this.progress.start({
      label: 'Repairing Vehicle...',
      duration: 5000,
      animation: {
        dict: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
        anim: 'machinic_loop_meig_3'
      },
      disableMovement: true,
      canCancel: true
    })

    if (completed) {
      // Logic for successful repair
    }
  }
}
```

## Notes

- Returns a `Promise<boolean>`: `true` if the duration elapsed, `false` if the player cancelled.
- Handles cleanup of animations and attached props automatically upon completion or cancellation.
