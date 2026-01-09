---
title: OnLocalEvent
---

## Description
``@Client.OnLocalEvent()`` registers a method as a listener for a local client runtime event using FiveM’s JavaScript on(eventName, fn) mechanism.

This is not a “network event” and it is not “framework-internal only” either. It is a direct binding to the client event bus provided by the FiveM runtime: when someone calls emit('some:event', ...) on the client, handlers registered with on('some:event', ...) will run.

In OpenCore, the decorator stores metadata first, and during bootstrap the LocalEventProcessor reads that metadata and calls on(eventName, handler) for you. The processor also wraps the handler in a try/catch and logs errors consistently, so a failing handler does not crash the entire runtime.

## Arguments
``eventName`` - The local client event name to listen to (triggered via emit(...) on the client).

## Example

```ts
import { Client } from '@open-core/framework'

@Client.Controller()
export class UiController {
  @Client.OnLocalEvent('ui:toggle')
  toggleUi() {
    // runs when some client script calls: emit('ui:toggle')
  }

  @Client.OnLocalEvent('ui:notify')
  notify(message: string) {
    // runs when: emit('ui:notify', 'hello')
    console.log(message)
  }
}
```

Around this example:
- Any client-side script (same resource or another resource on the client) can trigger the event using emit('ui:toggle') or emit('ui:notify', '...').
- OpenCore will automatically bind these handlers during bootstrap by calling the FiveM runtime on(...) function internally.


## Notes

- This decorator binds to FiveM’s client on(...) event system (local events triggered via emit(...)), not to onNet(...) (networked events).
- Handlers are executed with the arguments passed to emit(...) in the same order.
- OpenCore wraps the handler with error logging; if the handler throws, it logs the event name and handler name instead of failing silently.
- Use @Client.OnNet(...) (or the server equivalent) when you need events that can be triggered across client/server boundaries.