---
title: Input Validation (Zod Schemas)
---

## Why Validation Matters

All external input should be validated before business logic runs.

Use Zod schemas with decorators to validate and coerce payloads consistently.

## Commands

```ts
import { z } from 'zod'
import { Command, Controller, type Player } from '@open-core/framework/server'

const TransferSchema = z.tuple([
  z.coerce.number().int().positive(),
  z.coerce.number().min(1),
])

@Controller()
class BankController {
  @Command({ command: 'transfer', schema: TransferSchema })
  transfer(player: Player, [targetId, amount]: z.infer<typeof TransferSchema>) {
    // safe values
  }
}
```

## Net Events and RPC

- `OnNet(event, schema)` validates client payloads.
- `OnRPC(action, { schema })` validates request payloads.

Use small, explicit schemas per endpoint.

## Best Practices

- Prefer coercion (`z.coerce.number()`) for chat/string inputs.
- Keep schemas close to handlers for readability.
- Reject unknown fields for sensitive objects.
- Combine validation with `Guard` and `Throttle` on critical handlers.
