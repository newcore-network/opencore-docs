---
title: Notification Service
---

## Description
The `NotificationService` provides a clean, high-level API for interacting with the native GTA V "Thefeed" system. It handles everything from simple text messages to advanced notifications with textures and icons.

## API Methods

### `show()`
Displays a standard native notification above the minimap.

```ts
show(message: string, blink?: boolean)
```

---

### `showWithType()`
Shows a notification with a specific framework icon (info, success, warning, error).

```ts
showWithType(message: string, type: 'info' | 'success' | 'warning' | 'error')
```

---

### `showAdvanced()`
Displays a rich notification with a custom texture dictionary and icon.

```ts
showAdvanced(options: AdvancedNotificationOptions)
```

---

### `showHelp()` / `showFloatingHelp()`
- `showHelp`: Displays text in the top-left corner (standard FiveM help text).
- `showFloatingHelp`: Displays text directly above the player's head in the 3D world.

---

### `showSubtitle()`
Displays a centered text message at the bottom of the screen, typically used for dialogue or mission instructions.

## Example Usage

```ts
@Client.Controller()
export class InteractionController {
  constructor(private readonly notification: NotificationService) {}

  @Client.OnNet('item:used')
  onItemUsed(itemName: string) {
    this.notification.showWithType(`You used ${itemName}`, 'success');
  }

  @Client.Interval(1000)
  checkArea() {
    this.notification.showHelp('Press ~INPUT_CONTEXT~ to interact');
  }
}
```

## Notes
- All text components are automatically handled by the service using `AddTextComponentString`.
- Use `clearHelp()` and `clearSubtitle()` to stop showing persistent messages.
