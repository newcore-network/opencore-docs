---
title: RedM
---

## Overview

The **RedM adapter** connects OpenCore with Red Dead Redemption 2 servers running on CitizenFX. It provides specialized support for the RDR3 game profile.

```bash
# Currently part of @open-core/framework
# Standalone package coming soon
pnpm add @open-core/framework
```

---

## Current Status

> **In Development**: The RedM adapter is currently integrated into the framework. A standalone package will be available in a future release.

Current support:
- **Server**: Works with FiveM adapter configuration
- **Client**: Special ped appearance handling for RDR3

---

## Game Profile: RDR3

RedM uses a different game profile than standard FiveM:

| Aspect | FiveM (GTA5) | RedM (RDR3) |
|--------|--------------|-------------|
| Game Profile | `gta5` | `rdr3` |
| Ped Models | `mp_m_freemode_01` | `MP_M_MooreMafia_01` |
| Weapon System | GTA weapons | RDR weapons |
| Horse System | No | Native support |
| Native Set | GTA V natives | RDR2 natives |

---

## RedM-Specific Considerations

### Ped Appearance

RedM has different ped components and appearance options:

```typescript
// RedM-safe ped appearance
import { RedMPedAppearanceClientAdapter } from '@open-core/framework'

// Or via the framework's safe defaults
// The framework automatically uses RedM-safe appearance handling
```

### fxmanifest.lua Differences

RedM requires specific manifest settings:

```lua
fx_version 'cerulean'
game 'rdr3'

rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

server_scripts {
  'server.js'
}

client_scripts {
  'client.js'
}
```

### CLI Generation

The OpenCore CLI automatically generates the correct RedM manifest when targeting RedM:

```typescript
// opencore.config.ts
export default defineConfig({
  name: 'my-redm-server',
  destination: '/path/to/redm/resources',
  // The CLI will generate proper rdr3 fxmanifest
})
```

---

## Configuration

### Using RedM

```typescript
import { defineConfig } from '@open-core/cli'
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'

export default defineConfig({
  name: 'my-redm-server',
  destination: '/path/to/redm/resources',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
  core: {
    path: './core',
    gameProfile: 'rdr3', // Specify RDR3 profile
  },
})
```

### Game Profile Detection

The framework automatically detects the game profile:

```typescript
import { IPlatformContext } from '@open-core/framework'

// Platform context provides game profile info
const platform = container.resolve(IPlatformContext)
console.log(platform.gameProfile) // 'rdr3' | 'gta5' | 'common'
```

---

## Platform Capabilities

| Capability | Value |
|------------|-------|
| Max Players | 32 (RedM default) |
| Game Profile | RDR3 |
| Server Vehicle Creation | Supported |
| Ped Appearance | RDR3-safe implementation |
| Horse Management | Via native integration |
| RDR2 Natives | Available via adapter |

---

## Future Plans

The following are planned for the standalone RedM adapter:

- **Dedicated RedM Server Adapter** — Package with RDR3-specific platform context
- **RDR3-Specific Natives** — Horse spawning, RDR2 weapon system
- **RedM-Specific APIS** — RDR-style apis like horses
- **Enhanced Appearance** — Full RDR3 character customization

---

## Migration from GTA5

If you're migrating a FiveM project to RedM:

1. **Update Ped Models** — Use RDR3-compatible ped models
2. **Check Natives** — Replace any GTA5-specific native calls
3. **Appearance Components** — Update clothing/components for RDR3
4. **Vehicle Types** — Verify vehicle handling differences

```typescript
// FiveM (GTA5)
spawnPed('mp_m_freemode_01')

// RedM (RDR3)
spawnPed('MP_M_MooreMafia_01')
```

---

## Getting Started with RedM

1. Set up a RedM server instance
2. Configure OpenCore with `gameProfile: 'rdr3'`
3. Use FiveM adapter for now (RedM adapter coming)
4. Test gameplay features on RDR3 peds and natives

```typescript
// Current recommended setup
export default defineConfig({
  name: 'redm-server',
  destination: '../redm/resources',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
  core: {
    path: './core',
    gameProfile: 'rdr3',
  },
})
```

For questions or issues with RedM support, visit the [OpenCore Discord](https://discord.gg/99g3FgvkPs).
