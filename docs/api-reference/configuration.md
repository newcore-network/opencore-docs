---
title: Configuration (ServerInitOptions, Features)
---

## Server Initialization

Main entrypoint:

```ts
import { init } from '@open-core/framework/server'

await init({ mode: 'CORE' })
```

## `ServerInitOptions`

Common options:

- `mode`: `CORE | RESOURCE | STANDALONE`
- `features`: feature toggles/configuration for runtime modules
- `plugins`: server plugin list (optional)

## Provider Setup

Configure providers before `init()`:

```ts
import {
  setPrincipalProvider,
  setSecurityHandler,
  setPersistenceProvider,
  setNetEventSecurityObserver,
} from '@open-core/framework/server'
```

## Runtime Modes

- `CORE`: authoritative and provider-owning mode.
- `RESOURCE`: consumer mode with remote-backed boundaries.
- `STANDALONE`: isolated mode.

## Validation Notes

- Missing required providers in authoritative modes triggers fail-fast startup errors.
- Optional providers use safe defaults when omitted.
