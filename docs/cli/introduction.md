---
title: Overview
---

## What is OpenCore CLI?

The **OpenCore CLI** is the official command-line tool used to **build, validate, and orchestrate OpenCore-based projects**.

It is not a generic TypeScript compiler.  
It understands **FiveM/RedM runtimes**, **OpenCore architecture**, and the constraints of each execution environment.

Conceptually, it plays a role similar to:
- NestJS CLI (project orchestration)
- Vite (fast, opinionated builds)

…but designed **specifically** for FiveM and RedM and OpenCore.

---

## What problem does it solve? 🧠

FiveM/RedM is not a single runtime.

You are dealing with:
- Node.js (server)
- Neutral JS runtimes (client)
- Browsers (NUI / Views)

Each with **different rules**, APIs, and limitations.

The OpenCore CLI:
- Detects what you are building
- Validates what is allowed
- Produces **runtime-safe artifacts**
- Fails early when something is invalid

This removes an entire class of hard-to-debug runtime errors.

---

## Core concepts

The CLI understands three types of components:

### 🧠 Core
The central brain of your server.

- Hosts the OpenCore runtime
- Exposes exports to other resources
- Owns global systems (commands, players, identity)

There is usually **one Core** per server.

---

### 🛰️ Satellite Resources
Modular resources that **depend on the Core**.

- Contain gameplay logic
- Register commands and events
- Delegate shared systems to Core
- Built for **small bundles and fast iteration**

This is the recommended way to scale a server.

---

### 📦 Standalone Resources
Independent resources that do **not** rely on OpenCore.

- Legacy Lua scripts
- Utility JS resources
- Third-party tools

The CLI supports them, but does not enforce framework rules.

---

## High-level build flow 🔁

```

Source Code
↓
Discovery (server / client / views)
↓
Runtime validation
↓
Adapter selection
↓
Parallel compilation
↓
FiveM-ready artifacts

````

You do not configure this manually.  
The CLI infers it from structure and intent.

---

## Why Go? ⚙️

The CLI and compiler are written in **Go (Golang)** by design.

Key reasons:

- **Performance**: Parallel builds using goroutines
- **Single binary**: No Node.js dependency for the tool itself
- **Low memory usage**: Stable even with many resources
- **Fast startup**: Near-instant command execution

This makes the CLI reliable in both development and CI environments.

---

## CLI syntax basics 🧪

Command arguments follow a simple convention:

- **`<argument>`** → required  
- **`[argument]`** → optional  

Example:
```bash
opencore create <type> [name]
````

This mirrors standard CLI conventions and avoids ambiguity.

---

## Automatic discovery 🔍

The CLI performs **automatic project analysis**:

* Detects server entrypoints:

  * `main.ts`, `index.ts`, `server.ts`
* Detects client entrypoints:

  * `client.ts`, `index.ts`
* Discovers NUI / view entrypoints
* Infers runtime targets per file

No explicit configuration is required.

---

## Recommended environment 🧰

### Package manager: `pnpm` (recommended)

While `npm` and `yarn` are supported, **`pnpm` is strongly recommended**.

Reasons:

* Faster installs
* Lower disk usage
* Strict dependency isolation
* Optimized integration with the CLI linker

The CLI is designed around `pnpm`’s dependency model.

---

## NUI / Views support 🖥️

The compiler automatically detects your UI framework and expects the correct adapters to be installed.

Supported setups include:

* **React** → `react`, `react-dom`
* **Vue** → `vue`, `esbuild-plugin-vue3`
* **Svelte** → `svelte`, `esbuild-svelte`
* **SASS / SCSS** → `sass`, `esbuild-sass-plugin`

If required dependencies are missing:

* The build fails
* A clear error is shown
* The exact `pnpm add` command is suggested

No guessing, no silent failures.

---

## Runtime adapters 🧠

The CLI adapts its behavior based on runtime context:

* **Server (Node.js)**
  Full Node APIs allowed

* **Client (Neutral runtime)**
  Node.js and Web APIs are stripped

* **NUI (Browser)**
  Standard web environment

This ensures:

* Correct bundling
* No invalid imports
* Predictable runtime behavior

---

## Philosophy ✨

The OpenCore CLI is opinionated by design.

Its goals are:

* Safety over flexibility
* Correctness over convenience
* Explicit failures instead of silent bugs

You can build your own tooling —
but the CLI is the **reference implementation** for OpenCore projects.

---

This overview defines *what* the CLI is.
The following sections explain *how* to use it.
