---
title: Interval
---
## Description
``@Client.Interval()`` is a method decorator used to execute a client-side handler at a fixed time interval.

It allows client logic to run periodically without being tied to the frame rate.
This is useful for synchronization, polling, or periodic UI or gameplay updates that do not need to run every frame.

The decorator stores scheduling metadata, which the framework processes during client bootstrap to schedule execution.

## Arguments
``ms`` - The interval in milliseconds between executions.


## Example
```ts
import { Client } from '@open-core/framework'

@Client.Controller()
export class SyncController {
    
  @Client.Interval(1000)
  syncOncePerSecond() {
    // runs every second
  }
}
```
In this example, the ``syncOncePerSecond`` method is executed once every 1000 milliseconds on the client.

## Notes

- This decorator only stores metadata; scheduling occurs during client bootstrap.
- Interval handlers should remain lightweight to avoid client-side performance issues.
- Use this instead of per-frame logic when high-frequency updates are not required.