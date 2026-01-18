---
title: The Compiler
---

## Overview

The **OpenCore Compiler** is the technical core of the OpenCore CLI.  
It is not just a transpiler or a bundler: it is a **monorepo-aware build orchestrator** designed specifically for FiveM and similar GTA runtimes.

Its job is to:
- Understand **what each environment can and cannot do**
- Compile **server, client, and UI (NUI)** code correctly
- Coordinate **multiple resources in parallel**
- Produce **drop-in ready artifacts** for FiveM

All of this is done with **performance, safety, and predictability** as first-class goals ⚙️

---

## The Compiler as a Monorepo Orchestrator 🧠

An OpenCore project is effectively a **monorepo of runtime units**:

```

workspace/
├─ core/
│  ├─ server/
│  ├─ client/
│  └─ views/
├─ resources/
│  ├─ inventory/
│  │  ├─ server/
│  │  ├─ client/
│  │  └─ views/
│  ├─ jobs/
│  └─ chat/
└─ shared/

````

The compiler:
- Discovers **all resources automatically**
- Detects **entrypoints per environment**
- Builds **each unit independently**
- Runs them **in parallel** when possible
- Resolves **cross-resource framework contracts** (CORE ↔ RESOURCE)

Think of it less as “`tsc` for FiveM” and more as:

> **A coordinator that understands the topology of your server**

---

## FiveM Runtime Environments

FiveM runs JavaScript in **three fundamentally different environments**.  
The compiler enforces **hard boundaries** between them.

### Runtime Matrix

| Environment | Target | Purpose | What you can use | What will break |
|------------|--------|--------|------------------|----------------|
| **Server** | Node.js | Backend logic | Node APIs, DBs, filesystem | DOM, Web APIs, GTA natives |
| **Client** | Neutral JS | Gameplay logic | GTA natives, FiveM events | Node APIs, browser APIs |
| **Views (NUI)** | Browser | UI / HUD | DOM, fetch, UI frameworks | Node APIs, natives |

---

## Server Environment (Node.js)

The **server** runs on FiveM’s Node runtime.

- Default: **Node 16**
- Optional: **Node 22** (via `fxmanifest.lua`)

### Intended responsibilities
- Authentication & persistence
- Command handling
- Business logic
- External APIs
- Background jobs

### Examples

**✅ Allowed**
```ts
import fs from 'fs'
import crypto from 'crypto'
import pg from 'pg'
````

**❌ Forbidden**

```ts
window
document
GetEntityCoords(...)
```

The compiler:

* Targets Node explicitly
* Keeps `node_modules`
* Preserves Node globals

---

## Client Environment (Neutral JS / V8)

Client code runs inside the GTA V client, **not Node, not a browser**.

This environment is intentionally minimal.

### Intended responsibilities

* Player input
* Game state
* Entity interaction
* Natives and events

### Examples

**✅ Allowed**

```ts
onNet('event', ...)
GetEntityCoords(PlayerPedId())
Math.random()
```

**❌ Forbidden**

```ts
fs
process
fetch
window
require('some-lib')
```

The compiler:

* Bundles everything into a **single file**
* Strips Node & browser globals
* Fails fast on incompatible imports

This is one of the **main reasons a generic bundler is not enough**.

---

## Views (NUI / Browser)

Views run in an **embedded Chromium instance**.

This is a browser-like environment, but **not guaranteed to be modern Chrome**.

### Intended responsibilities

* UI / HUD
* Menus
* Web-based interactions
* Styling & animations

### Examples

**✅ Allowed**

```ts
fetch('/api')
window.postMessage(...)
React / Vue / Svelte
```

**❌ Forbidden**

```ts
fs
path
process
GTA natives
```

The compiler:

* Detects the UI framework automatically
* Injects the correct esbuild plugins
* Builds optimized browser bundles
* Copies static assets (HTML, CSS, fonts, images)

---

## Automatic Environment Discovery 🔍

The compiler does **zero-config discovery**.

It scans for:

* `server.ts`, `client.ts`, `index.ts`, `main.ts`
* View entrypoints (`views/`, `ui/`, `nui/`)
* Resource boundaries

Diagram:

```
Resource
 ├─ server → Node build
 ├─ client → Neutral JS build
 └─ views  → Browser build
```

If an environment does not exist, it is simply skipped.

---

## Technology Stack

The compiler is a **hybrid system**, each tool doing exactly what it’s best at:

* **Go** → orchestration, parallelism, filesystem, process control
* **SWC (Rust)** → TypeScript, decorators, metadata reflection
* **esbuild** → ultra-fast bundling and linking
* **Custom plugins** → FiveM-specific constraints

This separation is deliberate:

* Go handles **scale**
* Rust handles **syntax & speed**
* JS tooling handles **ecosystem compatibility**

---

## Parallel Build Model ⚡

Traditional FiveM builds are sequential.

OpenCore is not.

```
┌────────────┐
│ Resource A │──┐
├────────────┤  ├─ parallel workers
│ Resource B │──┤
├────────────┤  │
│ Resource C │──┘
└────────────┘
```

Each resource:

* Is built in isolation
* Has its own dependency graph
* Does not block others

Typical results:

* 8–12 resources → **< 1 second build**
* CPU-bound, not IO-bound

---

## Why this Matters

The compiler guarantees that:

* Server code **cannot accidentally leak into client**
* Client code **cannot rely on Node**
* UI code **stays browser-safe**
* CORE and RESOURCE builds stay **contract-correct**
* Large projects remain **maintainable and fast**

In short:

> The compiler encodes the rules of the FiveM universe so you don’t have to remember them.

---

## Final Mental Model

```
CLI
 └─ Compiler
     ├─ Discovers project structure
     ├─ Orchestrates monorepo builds
     ├─ Enforces runtime boundaries
     ├─ Runs parallel workers
     └─ Emits ready-to-run resources
```

This is what enables OpenCore to scale from:

* a single script
  to
* a full modular server architecture 🚀