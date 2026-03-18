---
title: Adapters
---

## What are Adapters?

Adapters are packages that connect OpenCore with specific multiplayer platforms. Each adapter implements the framework's contracts for platform-specific APIs like player info, vehicle management, events UI bridges and extra APIs.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Game Code                       │
│         (Controllers, Services, Decorators)             │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   OpenCore Framework                    │
│              (Runtime, DI, Processors)                  │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    Contracts (Interfaces)               │
│     IPlayerServer, IVehicleServer, IWebViewBridge...    │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                      Adapters                           │
│     FiveM Adapter  │  RageMP Adapter  │  RedM Adapter   │
└─────────────────────────────────────────────────────────┘
```

## Available Adapters

| Adapter | Package | Status | Game |
|---------|---------|--------|------|
| **[FiveM](./fivem)** | `@open-core/fivem-adapter` | Stable | GTA V |
| **[RageMP](./ragemp)** | `@open-core/ragemp-adapter` | Stable | GTA V |
| **[RedM](./redm)** | Built-in | Coming Soon | RDR3 |

## Common Contracts

All adapters implement these core contracts:

### Server Contracts
- **IPlayerServer** — Player operations (drop, getPed, getName, getPing)
- **IVehicleServer** — Vehicle operations (create, delete, getAll)
- **IPedServer** — Ped operations (spawn, delete)
- **IPlayerLifecycleServer** — Spawn, teleport, respawn actions
- **IPlayerStateSyncServer** — Health, armor, state sync
- **IPlatformContext** — Platform info and capabilities
- **MessagingTransport** — RPC and events between server/client

### Client Contracts
- **IClientRuntimeBridge** — Tick, commands, NUI callbacks
- **IClientSpawnBridge** — Player spawn management
- **IClientWebViewBridge** — WebView/NUI communication
- **IClientBlipBridge** — Map blip management
- **IClientMarkerBridge** — 3D marker rendering
- **IClientNotificationBridge** — Notifications and help text

## Installation

Each adapter has its own package. Install the ones you need:

```bash
# FiveM
pnpm add @open-core/fivem-adapter

# RageMP
pnpm add @open-core/ragemp-adapter
```

## Usage

Import and pass the adapter during initialization:

```typescript
import { Server } from '@open-core/framework/server'
import { Client } from '@open-core/framework/client'

// FiveM
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'

await Server.init({ mode: 'CORE', adapter: FiveMServerAdapter() })
await Client.init({ mode: 'CORE', adapter: FiveMClientAdapter() })
```

Or use the CLI wizard which handles installation and configuration automatically:

```bash
opencore init my-server --adapter=fivem
opencore init my-server --adapter=ragemp
```

## Platform Detection

OpenCore automatically detects the platform at runtime. The adapter you provide determines:

- Which native APIs are available
- How player identifiers are handled
- Transport protocol for server/client communication
- Maximum player counts and game-specific defaults

## Next Steps

- [FiveM](./fivem) — FiveM/RedM (Cfx) specifics
- [RageMP](./ragemp) — Rage Multiplayer specifics
- [RedM](./redm) — Red Dead Redemption specifics
