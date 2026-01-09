---
title: Net Event Security Observer
---

## Description
The `NetEventSecurityObserver` contract provides hooks to monitor and react to invalid payloads sent via network events. This is particularly useful for detecting automated exploitation attempts or malformed data from the client.

## API Methods

### `onInvalidPayload()`
Called when a network event receives a payload that doesn't match its expected schema (e.g., failed Zod validation) or has an incorrect argument count.

```ts
abstract onInvalidPayload(player: Player, ctx: NetEventInvalidPayloadContext): Promise<void>
```

## Context Data
The `ctx` object provides detailed information about the failure:
- `event`: The name of the event that failed.
- `reason`: 'zod' (schema failure), 'arg_count', or 'security_error'.
- `zodSummary`: A list of specific validation errors.
- `expectedArgsCount` / `receivedArgsCount`.

## Example Usage

```ts
@Server.Bind(NetEventSecurityObserverContract)
export class MyNetSecurityObserver extends NetEventSecurityObserverContract {
  async onInvalidPayload(player: Player, ctx: NetEventInvalidPayloadContext) {
    if (ctx.reason === 'zod') {
      console.error(`[Anti-Cheat] Player ${player.name} sent invalid data to ${ctx.event}`);
      console.error('Errors:', ctx.zodSummary.join(', '));
    }
  }
}
```
