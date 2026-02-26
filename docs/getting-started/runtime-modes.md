---
title: Runtime Modes (CORE / RESOURCE / STANDALONE)
---

## Modes

OpenCore server runtime operates in one explicit mode.

### `CORE`

- Authoritative runtime for shared framework boundaries.
- Usually hosts principal/auth/session providers.
- Other resources can delegate through ports/remote adapters.

### `RESOURCE`

- Feature resource that depends on CORE for shared state.
- Uses the same API surface, with remote-backed implementations where needed.

### `STANDALONE`

- Self-contained runtime with no external CORE dependency.
- Useful for small servers, isolated modules, and tests.

## Example

```ts
import { init } from '@open-core/framework/server'

await init({ mode: 'CORE' })
```

## Choosing a Mode

- Pick `CORE` for central authority and multi-resource scaling.
- Pick `RESOURCE` for modular gameplay resources attached to CORE.
- Pick `STANDALONE` for simple deployments.
