---
title: RageMP
---

## Overview

The **RageMP adapter** connects OpenCore with Rage Multiplayer runtimes. It implements all framework contracts using RageMP's JavaScript API.

```bash
pnpm add @open-core/ragemp-adapter
```

[NPM](https://www.npmjs.com/package/@open-core/ragemp-adapter) | [GitHub](https://github.com/newcore-network/opencore-ragemp-adapter)

For adapter maintenance, run `opencore adapter check` inside the adapter repository to verify contract coverage against the framework baseline.

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

## Exports

OpenCore keeps `@Export()` as the public programming model and the adapter provides two layers:

- Local registry access for synchronous framework internals such as `core.isCoreReady()`
- An optional explicit remote export transport for server resource-to-resource calls

Use the framework contract instead of reaching into `exportsRegistry` directly:

```ts
import { IExports } from '@open-core/framework/contracts/server'

interface DatabaseExports {
  pingDatabase(): Promise<{ success: boolean }>
}

class ExampleService {
  constructor(private readonly exportsService: IExports) {}

  async pingDatabase() {
    const database = await this.exportsService.waitForRemoteResource<DatabaseExports>('database', {
      exportName: 'pingDatabase',
    })

    return database.pingDatabase()
  }
}
```

### API Summary

- `getResource(resourceName)`
  Use for local/synchronous resolution. This is what the framework uses internally for CORE bootstrap and provider lookups.
- `getRemoteResource(resourceName)`
  Returns an async proxy when you want explicit remote resource calls.
- `callRemoteExport(resourceName, exportName, ...args)`
  Calls one remote export explicitly.
- `waitForRemoteResource(resourceName, options)`
  Waits until a resource exposes a specific export before returning the async proxy.

### Security Notes

- Remote exports are server-side only.
- The adapter executes only methods registered through `@Export()`.
- Client-originated payload shapes are ignored by the remote export transport.
- Treat remote export helper calls as async RPC, not as direct shared-memory calls.

---

## Common Issues

### Node 14 dependency compatibility

RageMP server runtimes commonly run on Node 14. Some modern packages may declare compatible `engines` and still fail at runtime because their transitive dependencies use newer Node features such as `node:` specifiers.

This affects packages like ORMs, database drivers, file globbers, and build-time tooling that may also execute during server bootstrap.

Recommendations:

- Prefer explicit versions for critical runtime dependencies such as `typeorm`, `pg`, and similar infrastructure packages.
- Avoid loose ranges for server-critical packages in RageMP projects.
- Externalize heavy runtime dependencies in your OpenCore build config when they are intended to be resolved from the project root at runtime.

Example:

```ts
import { defineConfig } from '@open-core/cli'

export default defineConfig({
  build: {
    server: {
      target: 'node14',
      external: ['typeorm', 'pg'],
    },
  },
})
```

- Pin versions explicitly in `package.json` instead of relying on broad semver ranges.
- If a transitive dependency upgrades beyond Node 14 compatibility, use package manager overrides/resolutions as a temporary compatibility measure.

Example with `pnpm` overrides:

```json
{
  "pnpm": {
    "overrides": {
      "glob": "7.2.3"
    }
  }
}
```

### Misleading autoload errors

If you see a message like:

```txt
[Bootstrap] No server controllers autoload file found, skipping.
```

it may actually be a nested dependency failure triggered while importing the autoload module.

Check the full stack trace and verify the dependencies imported by your controllers before assuming the autoload file itself is missing.
