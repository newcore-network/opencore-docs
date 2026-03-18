---
title: FiveM
---

## Overview

The **FiveM adapter** connects OpenCore with CitizenFX (FiveM/RedM) runtimes. It implements all framework contracts using FiveM's native APIs.

```bash
pnpm add @open-core/fivem-adapter
```

[NPM](https://www.npmjs.com/package/@open-core/fivem-adapter) | [GitHub](https://github.com/newcore-network/opencore-fivem-adapter)

---

## Server Contracts

### Core Implementations

| Contract | Description |
|----------|-------------|
| `FiveMPlatformContext` | Platform info, game profile (GTA5), capabilities |
| `FiveMPlayerServer` | Player operations: drop, getPed, getName, getPing, getEndpoint, dimension |
| `FiveMVehicleServer` | Vehicle creation, deletion, retrieval |
| `FiveMPedServer` | Ped spawning and deletion |
| `FiveMNpcLifecycleServer` | NPC lifecycle management |
| `FiveMVehicleLifecycleServer` | Vehicle spawn/despawn with model preloading |
| `FiveMPlayerLifecycleServer` | Player spawn, teleport, respawn actions |
| `FiveMPlayerAppearanceLifecycleServer` | Ped appearance changes |
| `FiveMPlayerStateSyncServer` | Health, armor, state synchronization |
| `FiveMPedAppearanceServerAdapter` | Server-side ped appearance |
| `FiveMEngineEvents` | Resource start/stop, server events |
| `FiveMExports` | Export registration and invocation |
| `FiveMTick` | Server tick/interval handling |
| `FiveMHasher` | Model hash computation |
| `FiveMResourceInfo` | Current resource metadata |
| `FiveMPlayerInfo` | Player identifiers and info |

---

## Client Contracts

### Core Implementations

| Contract | Description |
|----------|-------------|
| `FiveMRuntimeBridge` | Tick, commands, NUI callbacks via CFX globals |
| `FiveMLocalPlayerBridge` | Local player position, heading, health |
| `FiveMClientSpawnBridge` | Player spawn with model loading |
| `FiveMPedAppearanceClientAdapter` | Client ped appearance (clothing, props, tattoos) |
| `FiveMClientBlipBridge` | Map blip creation and management |
| `FiveMClientMarkerBridge` | 3D marker rendering |
| `FiveMClientNotificationBridge` | Notifications, help text, subtitles |
| `FiveMClientWebViewBridge` | NUI communication with focus/cursor control |
| `FiveMClientHasher` | Model hash utilities |

---

## FiveM-Specific Features

### NUI Integration

The FiveM adapter provides full NUI (Native UI) support:

```typescript
import { WebView, SetNuiFocus } from '@open-core/framework/client'

// Create NUI page
WebView.create('nui://my-ui/index.html', {
  visible: true,
  focused: true,
  cursor: true,
})

// Send data to NUI
WebView.send('updateData', { items: myItems })

// Focus control
SetNuiFocus(true, false) // cursor=true, input=false
```

### State Bags

FiveM's state bag system is used for reactive state synchronization:

```typescript
// Server sets state
SetEntityHeading(playerPed, heading)
SetAuthValue(source, 'rank', 'admin')

// Client observes state changes
AddStateBagChangeHandler('rank', null, (bagName, key, value) => {
  console.log(`Player ${bagName} rank: ${value}`)
})
```

### Transport Protocol

Uses FiveM events for RPC and events:
- `__oc:rpc:req:*` — RPC requests
- `__oc:rpc:res:*` — RPC responses
- `__oc:events:*` — Event broadcasting

---

## Configuration

### FiveM Manifest

The CLI generates `fxmanifest.lua` with FiveM-specific data:

```lua
fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'OpenCore Server'
version '1.0.0'

server_scripts {
  'server.js'
}

client_scripts {
  'client.js'
}

dependencies {
  'opencore-core'
}
```

### OpenCore Config

```typescript
import { defineConfig } from '@open-core/cli'
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'

export default defineConfig({
  name: 'my-server',
  destination: '/path/to/fxserver/resources',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
  core: {
    path: './core',
    resourceName: 'core',
  },
})
```

---

## Platform Capabilities

| Capability | Value |
|------------|-------|
| Max Players | 1024 |
| Game Profile | GTA5 |
| Default Spawn Model | `mp_m_freemode_01` |
| Default Vehicle Type | `automobile` |
| Server Vehicle Creation | Supported |
| State Bags | Full support |
| NUI/Native UI | Full support |
| Ped Appearance (Server) | Supported |
| WebView Focus Control | Supported |

---

## Client Setup

```typescript
import { Client } from '@open-core/framework/client'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'

Client.init({
  mode: 'CORE',
  adapter: FiveMClientAdapter(),
})
```

The adapter automatically:
- Registers NUI callback handlers
- Sets up WebView message routing
- Configures local player bridges
- Initializes spawn and appearance services
