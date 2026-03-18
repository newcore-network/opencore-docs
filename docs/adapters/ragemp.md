---
title: RageMP
---

## Overview

The **RageMP adapter** connects OpenCore with Rage Multiplayer runtimes. It implements all framework contracts using RageMP's JavaScript API.

```bash
pnpm add @open-core/ragemp-adapter
```

[NPM](https://www.npmjs.com/package/@open-core/ragemp-adapter) | [GitHub](https://github.com/newcore-network/opencore-ragemp-adapter)

---

## Server Contracts

### Core Implementations

| Contract | Description |
|----------|-------------|
| `RageMPPlatformContext` | Platform info, game profile (GTA5), capabilities |
| `RageMPPlayerServer` | Player operations: drop, getPed, getName, getPing, getEndpoint |
| `RageMPVehicleServer` | Vehicle creation, deletion, retrieval |
| `RageMPPedServer` | Ped spawning and deletion |
| `RageMPNpcLifecycleServer` | NPC lifecycle management |
| `RageMPVehicleLifecycleServer` | Vehicle spawn/despawn |
| `RageMPPlayerLifecycleServer` | Player spawn, teleport, respawn actions |
| `RageMPPlayerAppearanceLifecycleServer` | Ped appearance changes |
| `RageMPPlayerStateSyncServer` | Health, armor, state synchronization |
| `RageMPEngineEvents` | Shared engine events |
| `RageMPExports` | Export registration and invocation |
| `RageMPTick` | Server tick/interval handling |
| `RageMPHasher` | Model hash computation |
| `RageMPResourceInfo` | Current resource metadata |
| `RageMPPlayerInfo` | Player identifiers and info |

### Player Identifiers

RageMP supports 3 identifier types:

| Type | Description |
|------|-------------|
| `socialClub` | Social Club name |
| `hwid` | Hardware ID |
| `ip` | IP address |

---

## Client Contracts

### Core Implementations

| Contract | Description |
|----------|-------------|
| `RageMPRuntimeBridge` | Tick, commands, WebView callbacks |
| `RageMPLocalPlayerBridge` | Local player position, heading, health |
| `RageMPClientSpawnBridge` | Player spawn management |
| `RageMPPedAppearanceClient` | Client ped appearance |
| `RageMPClientBlipBridge` | Map blip creation |
| `RageMPClientMarkerBridge` | 3D marker rendering |
| `RageMPClientNotificationBridge` | Notifications |
| `RageMPClientWebViewBridge` | WebView communication |
| `RageMPClientHasher` | Model hash utilities |
| `RageMPClientLogConsole` | Client console logging |
| `RageMPPlatformBridge` | Extended platform native access |

---

## RageMP-Specific Features

### Native Chat Integration

RageMP has a built-in native chat system accessible via `mp.gui.chat`:

```typescript
import { enableRageMPNativeChat } from '@open-core/ragemp-adapter/client'

// Enable native chat integration
enableRageMPNativeChat()

// Messages appear in RageMP's built-in chat
mp.gui.chat.push('Hello from OpenCore!')
```

### Client Log Console

Unique to RageMP, you can send logs to the client's console:

```typescript
import { installRageMPClientLogConsole } from '@open-core/ragemp-adapter/client'

// Install client-side logger
installRageMPClientLogConsole()

// Now client can receive server logs
console.log('Player spawned:', player.name)
```

### Extended WebView

RageMP's WebView has advanced features beyond standard NUI:

```typescript
import { WebView } from '@open-core/framework/client'

// Standard WebView methods
WebView.create('http://localhost:3000')
WebView.send('message', { data: 'hello' })

// RageMP-specific WebView capabilities
// (available via RageMPClientWebViewBridge)

// Execute JavaScript in WebView
WebView.execute(viewId, 'document.body.style.background = "red"')

// Call WebView function and get result
const result = await WebView.call(viewId, 'getPlayerData')

// Call server-side procedure
const data = await WebView.callProc('getPlayerInventory', playerId)

// Mark WebView as chat input
WebView.markAsChat(viewId)
```

### Key Mapping

Custom key binding system:

```typescript
import { bindKey, unbindKey } from '@open-core/ragemp-adapter/client'

// Bind key with callback
bindKey(69, 'down', 'INTERACT', () => {
  console.log('E pressed')
})

// Unbind when done
unbindKey(69, 'down', 'INTERACT')
```

---

## Configuration

### OpenCore Config

```typescript
import { defineConfig } from '@open-core/cli'
import { RageMPServerAdapter } from '@open-core/ragemp-adapter/server'
import { RageMPClientAdapter } from '@open-core/ragemp-adapter/client'

export default defineConfig({
  name: 'my-ragemp-server',
  destination: '/path/to/ragemp/server',
  adapter: {
    server: RageMPServerAdapter(),
    client: RageMPClientAdapter(),
  },
  core: {
    path: './core',
  },
  build: {
    target: 'node14', // RageMP requires Node 14 compatibility
  },
})
```

### Output Structure

RageMP uses a different output structure:

```
ragemp-server/
├── packages/
│   └── my-ragemp-server/
│       └── index.js        # Server bundle
└── client_packages/
    └── my-ragemp-server/
        └── index.js        # Client bundle
```

Unlike FiveM's single-resource folder, RageMP splits server and client into `packages/` and `client_packages/`.

---

## Platform Capabilities

| Capability | Value |
|------------|-------|
| Max Players | 5000 |
| Game Profile | GTA5 |
| Default Spawn Model | `mp_m_freemode_01` |
| Default Vehicle Type | `sultan` |
| Server Vehicle Creation | Supported |
| Native Chat | Supported |
| Client Log Console | Supported |
| Extended WebView | Supported (execute, call, markAsChat) |
| Key Mapping | Custom system |

---

## Client Setup

```typescript
import { Client } from '@open-core/framework/client'
import { RageMPClientAdapter } from '@open-core/ragemp-adapter/client'

Client.init({
  mode: 'CORE',
  adapter: RageMPClientAdapter(),
})
```

The adapter automatically:
- Sets up RageMP-specific runtime bridges
- Configures extended WebView functionality
- Enables platform detection via `mp` global
- Initializes client logging

---

## Exports Registry

RageMP uses a centralized exports system:

```typescript
import { exportsRegistry } from '@open-core/ragemp-adapter/shared'

// Access registered exports
const myExport = exportsRegistry.get('myExportName')
myExport(player, arg1, arg2)
```

This differs from FiveM's event-based exports and provides a more direct method invocation pattern.
