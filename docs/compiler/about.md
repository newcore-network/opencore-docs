---
title: The Compiler
---

## Overview

The OpenCore Compiler is the heart of the CLI. It is a high-performance build engine specifically designed to handle the complexities of FiveM's three distinct runtime environments (Server, Client, and NUI).

## FiveM Runtime Environments

FiveM has **three distinct runtime environments**. Understanding their differences is essential for building compatible resources.

### Quick matrix

| Environment | Platform | What you can rely on | What will break |
|------------|----------|----------------------|----------------|
| Server | `node` | Node.js APIs, `node_modules`, FiveM server APIs | Web APIs (`window`, `DOM`), GTA natives |
| Client | `neutral` | Pure JS (V8), FiveM client APIs, GTA natives | Node.js APIs, Web APIs, non-bundled deps |
| Views (NUI) | `browser` | Web APIs, UI frameworks, NUI callbacks/messages | Node.js APIs, GTA natives, direct FiveM APIs |

### Server (Node.js)

**Node version**:
- **Node 22** if you explicitly select it in the resource `fxmanifest.lua` [fivem docs](https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/)
- Otherwise **Node 16** is used by default

Examples:
- **✅ Do**: read config files, call external APIs, database access, background jobs.
- **✅ Works**: `import fs from 'fs'`, `import crypto from 'crypto'`, `await fetch(...)` (Node), `require('pg')`.
- **❌ Don’t**: use `window`, `document`, `localStorage`.
- **❌ Will break**: GTA natives (no game context).

### Client (Neutral JS / V8)

Treat client code as **neutral**: assume **no `node` and no browser**.

Examples:
- **✅ Do**: game interaction, player input, natives, minimal logic.
- **✅ Works**: FiveM client events, `GetEntityCoords(...)`, simple state, math/logic.
- **❌ Don’t**: `import fs from 'fs'`, `process.env`, `Buffer`, `require(...)`.
- **❌ Don’t**: `fetch`, `window`, `document`, `localStorage`.
- **❌ Will break**: packages that aren’t bundled (or that rely on Node/Web internals).

### Views (NUI / Browser)

NUI is **browser-like**, but not guaranteed to match modern Chrome 1:1.

Examples:
- **✅ Do**: UI (React/Vue/etc.), `fetch` to your own endpoints, local UI state.
- **✅ Works**: `window.postMessage` patterns, NUI callbacks (`RegisterNUICallback` / `SendNUIMessage`).
- **❌ Don’t**: `fs`, `path`, `process`, native Node addons.
- **❌ Don’t**: call natives / FiveM APIs directly.

**Compatibility note**: the embedded Chromium has **version limitations**. If you rely on a modern Web API, test it on real FiveM.

## Technology Stack

The compiler is built using a hybrid approach for maximum efficiency:

- **Go (Core Engine)**: Handles the orchestration, file system watching, and parallel worker pool.
- **SWC (Transformation)**: A super-fast TypeScript/JavaScript transformer written in Rust. We use it to handle **Decorators** and **Metadata Reflection**.
- **esbuild (Bundling)**: The fastest JavaScript bundler available, used to link all dependencies into a single FiveM-compatible file.

## Why it's different

Most FiveM build systems use standard Webpack or Rollup configurations which are slow and don't understand FiveM's unique constraints. The OpenCore compiler provides:

### 1. Multi-Core Parallelism
While standard tools compile resources one by one, our Go engine distributes the work across all available CPU cores. This reduces build times from several seconds to **milliseconds**.

### 2. FiveM-Specific Targeting
The compiler automatically applies different rules depending on the target:
- **Server**: Optimized for Node.js runtime.
- **Client**: Strips all Node.js and Web APIs, ensuring the code is compatible with FiveM's restricted "neutral" JS environment.
- **NUI**: Standard browser bundling.

### 3. Automated Asset Management
Beyond code, the compiler manages your `fxmanifest.lua` generation, copies static assets, and ensures that the final `dist/` folder is ready to be dropped into your server without manual tweaks.

## Performance Metrics
On a typical project with 10 resources:
- **Sequential Build**: ~2.3 seconds
- **Parallel Build (8 cores)**: **~0.5 seconds**
