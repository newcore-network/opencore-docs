---
title: Security Overview
---

## Security Model

OpenCore applies security in the execution pipeline, not as an afterthought.

Core layers:

- Access control (`Guard`, principals, permissions/ranks)
- Throttling (`Throttle` and `RateLimiterService`)
- State constraints (`RequiresState`)
- Input validation (Zod schemas in commands/events/RPC)
- Security observers/handlers for auditing and reactions

## Default Behavior

- Required security boundaries fail fast when misconfigured.
- Optional observers have safe defaults.
- Unauthorized execution is blocked before your handler logic runs.

## Recommended Baseline

1. Define strict schemas for command/event inputs.
2. Use `Guard` on sensitive handlers.
3. Add `Throttle` for spam-prone endpoints.
4. Implement custom security handler/observers for logging and policy.

## Setup Example

```ts
import {
  init,
  setPrincipalProvider,
  setSecurityHandler,
  setNetEventSecurityObserver,
} from '@open-core/framework/server'

setPrincipalProvider(MyPrincipalProvider)
setSecurityHandler(MySecurityHandler)
setNetEventSecurityObserver(MyNetEventObserver)

await init({ mode: 'CORE' })
```
