---
title: Adapters
---

## What is an Adapter?

An **Adapter** defines the target platform for your OpenCore project. It is the central configuration that controls how your code is built, structured, and executed.

They can also add special features and APIs, such as expanding those of the base framework. You should read the special documentation for each adapter to learn more about this.

Adapters abstract platform-specific details so your gameplay code remains portable across different multiplayer runtimes and is needed for Runtime-level of the framework. No optional, by default is node for tests.

---

## Why Adapters Matter

The multiplayer server ecosystem has different runtimes with distinct requirements:

| Aspect | FiveM | RageMP (Deprecated) | RedM | Node (Default) |
|--------|-------|--------|------|---------------|
| **Manifest** | `fxmanifest.lua` | `package.json` | `fxmanifest.lua` | `fxmanifest.lua` |
| **Server Runtime** | Node.js | Node.js 14 | Node.js | Node.js (any) |
| **Client Runtime** | Neutral JS | Neutral JS | Neutral JS | Neutral JS |
| **Output Structure** | Single resource folder | Split `packages/` + `client_packages/` | Single resource folder | Single resource folder |
| **NUI Environment** | Embedded browser | WebView | Embedded browser | Embedded browser |

Without adapters, you would need to manage these differences manually. Adapters let you focus on gameplay logic while the CLI handles platform compliance.

---

## Available Adapters

### FiveM Adapter

The **FiveM adapter** targets CitizenFX runtimes (FiveM).

```bash
pnpm add @open-core/fivem-adapter
```

[NPM](https://www.npmjs.com/package/@open-core/fivem-adapter) - [Github](https://github.com/newcore-network/opencore-fivem-adapter)

```typescript
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'
```

**What it configures:**

| Aspect | Value |
|--------|-------|
| Build target (server) | ES2020, CommonJS |
| Build target (client) | ES2020, IIFE, Neutral platform |
| Output layout | `resourceName/server.js`, `resourceName/client.js` |
| Manifest | Generates `fxmanifest.lua` automatically |
| Server platform | `node` |

And extra apis for this enviroment.

**When to use:**
- Production FiveM servers
- When you need `fxmanifest.lua` compatibility
- Standard FiveM resource distribution

---

### RageMP Adapter (Deprecated)

The **RageMP adapter** targets Rage Multiplayer.

```typescript
import { RageMPClientAdapter } from '@open-core/ragemp-adapter/client'
import { RageMPServerAdapter } from '@open-core/ragemp-adapter/server'
```

```bash
pnpm add @open-core/ragemp-adapter
```

[NPM](https://www.npmjs.com/package/@open-core/ragemp-adapter) - [Github](https://github.com/newcore-network/opencore-ragemp-adapter)

**What it configures:**

| Aspect | Value |
|--------|-------|
| Build target (server) | Node.js 14 compatible |
| Build target (client) | ES2020 |
| Output layout | `packages/{resource}/index.js`, `client_packages/{resource}/index.js` |
| Manifest | None (uses RageMP package structure) |
| Server platform | `node` |
| Client platform | `neutral` |

And extra apis for this enviroment.

**When to use:**
- RageMP server projects
- When you need RageMP-specific output structure
- Node 14 compatibility requirements

**Dependency guidance:**

- Prefer exact versions for critical server runtime packages.
- Externalize heavy runtime dependencies such as `typeorm` and `pg` when they should resolve from the project root at runtime.
- Be careful with transitive dependencies that may silently drop Node 14 compatibility.

---

### RedM Adapter

> **Coming Soon**

```typescript
// Not yet available
import { RedMClientAdapter } from '@open-core/redm-adapter/client'
import { RedMServerAdapter } from '@open-core/redm-adapter/server'
```

RedM-specific optimizations and configurations will be available in a future release.

---

### Node (Default)

The **Node adapter** is the framework default when no adapter is configured.

```typescript
// No imports needed - used automatically
export default defineConfig({
  name: 'my-project',
  // No adapter section = uses Node defaults
})
```

**What it provides:**

| Aspect | Value |
|--------|-------|
| Build target (server) | ES2020, CommonJS |
| Build target (client) | ES2020, IIFE, Neutral platform |
| Output layout | Standard resource folder |
| Manifest | Generates `fxmanifest.lua` |

**When to use:**
- Local development and testing
- Standalone scripts
- Prototyping without a specific platform target
- CI/CD environments

---

## Configuration

Configure your adapter in `opencore.config.ts`:

```typescript
import { defineConfig } from '@open-core/cli'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'

export default defineConfig({
  name: 'my-server',
  destination: '/path/to/server/resources',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
  core: {
    path: './core',
    resourceName: 'core',
  },
  resources: {
    include: ['./resources/*'],
  },
})
```

The adapter setting is the **runtime switch**. Change it to migrate between platforms without rewriting your gameplay code.

---

## Project Initialization

When creating a new project, specify the adapter with `--adapter`:

```bash
# Interactive wizard (prompts for adapter selection)
opencore init my-server

# Non-interactive with specific platform
opencore init my-server --adapter=fivem
opencore init my-server --adapter=ragemp

# No adapter (uses Node defaults)
opencore init my-server --adapter=none
```

---

## Validation

The CLI validates your adapter configuration automatically:

```bash
opencore doctor
```

This command checks:
- Adapter is properly configured
- Required packages are installed
- Configuration is valid for the selected runtime

Run `opencore doctor` whenever you:
- Set up a new machine
- Change adapter configuration
- Debug build issues

---

## Quick Reference

| Adapter | Package | Status | Best For |
|---------|---------|--------|----------|
| **FiveM** | `@open-core/fivem-adapter` | Stable | Production FiveM servers |
| **RageMP** | `@open-core/ragemp-adapter` | Stable | RageMP projects |
| **RedM** | Built-in | In Development | RedM servers |
| **Node** | Built-in | Default | Development, testing, standalone |

---

## Detailed Documentation

For in-depth information about each adapter, including specific features, APIs, and configuration options:

- [FiveM Adapter](../adapters/fivem) — Full FiveM implementation details
- [RageMP Adapter](../adapters/ragemp) — RageMP-specific features (native chat, WebView execute)
- [RedM Adapter](../adapters/redm) — RedM/RDR3 support and considerations
