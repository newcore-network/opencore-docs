---
title: Runtime Model & Lifecycle
---

## Runtime Modes

The server runtime supports three modes:

- `CORE` - authoritative runtime for shared framework state.
- `RESOURCE` - feature resource that consumes core capabilities.
- `STANDALONE` - isolated runtime, useful for smaller setups and tooling.

## Bootstrap Flow

1. Import controllers/services (so decorators execute).
2. Register optional/required providers with setup functions.
3. Call `init({ mode })`.
4. Framework scans metadata and binds processors.
5. Runtime starts receiving events/commands/RPC.

## Provider Setup Timing

Provider setup must happen before `init()`.

```ts
import { init, setPrincipalProvider, setSecurityHandler } from '@open-core/framework/server'

setPrincipalProvider(MyPrincipalProvider)
setSecurityHandler(MySecurityHandler)

await init({ mode: 'CORE' })
```

## Lifecycle Notes

- Missing required providers in `CORE`/`STANDALONE` fail fast.
- `RESOURCE` delegates certain boundaries to `CORE`.
- Runtime context drives which local/remote implementations are injected.

## Client Lifecycle

Client bootstrap follows the same pattern:

- Import decorated classes.
- Call `init({ mode })` from `@open-core/framework/client`.
- Handlers are wired (`OnNet`, `OnView`, `Interval`, etc.).
