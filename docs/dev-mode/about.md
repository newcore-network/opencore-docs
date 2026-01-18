---
title: Development Mode
---

## Overview

OpenCore includes a **Development Mode** designed to speed up iteration while preserving the same execution model used in production.

Development Mode is **stable** and actively, although it may still have flaws, it has not been possible to test everything rigorously. Used during framework and resource development, but it is **explicitly scoped to development environments**. It enables live inspection, rebuild triggers, log streaming, and safe resource restarts without changing the runtime semantics of the framework.

> ⚠️ **Important**
> Development Mode must never be enabled in production environments. It exposes inspection endpoints, in-memory state, and orchestration hooks intended strictly for local development.

---

## What Development Mode Is (and Is Not)

### ✅ What it is
- A **development-only runtime layer**
- A bridge between:
  - the OpenCore Framework
  - the OpenCore CLI watcher
- A tool for:
  - faster feedback loops
  - debugging commands, events, and state
  - rebuilding and restarting resources safely

### ❌ What it is not
- Not Hot Module Replacement (HMR)
- Not a custom runtime
- Not a production feature
- Not a CLI-controlled runtime

The framework always runs normally. Development Mode **observes and assists**, it does not alter execution rules.

---

## Configuration

Development Mode is enabled during server initialization:

```ts
Server.init({
  mode: 'CORE',
  devMode: {
    enabled: true,
    bridge: {
      url: 'ws://localhost:8080',
      autoConnect: true,
    },
    interceptor: {
      enabled: true,
      recordHistory: true,
      maxHistorySize: 1000,
    },
    simulator: {
      enabled: true,
      autoConnectPlayers: 2,
    },
  },
})
````

---

## Log Level Configuration

The **log level is not configured through DevMode**.

Instead, logging is controlled globally via `opencore.config.ts`:

```ts
export default {
  logLevel: 'debug', // trace | debug | info | warn | error | fatal
}
```

Development Mode **respects and mirrors** the active log level:

* The framework emits logs according to `logLevel`
* The CLI watcher streams those logs without filtering
* Fatal and error logs are never suppressed

This guarantees parity between development and production behavior.

---

## Core Features

### CLI Bridge 🧵

The **bridge** is a WebSocket connection used exclusively for:

* log streaming
* runtime inspection
* development telemetry

It does **not**:

* restart resources
* trigger builds
* mutate framework state

The CLI consumes the bridge passively.

---

### Event Interceptor 🧠

The interceptor captures structured runtime activity:

* command execution
* network events
* internal framework flows

Characteristics:

* in-memory only
* bounded by `maxHistorySize`
* zero persistence
* no side effects

Its purpose is **debugging and introspection**, not auditing.

---

### Player Simulator 🧍

The simulator creates **virtual Player entities** inside the framework.

It allows testing:

* guards and permissions
* command flows
* session lifecycle logic

Limitations:

* no FiveM natives
* no UI
* no real network traffic

This is intentional: the simulator validates **logic**, not rendering or input.

---

## Resource Rebuild & Restart Model 🔁

Development Mode does **not** hot-reload code.

Instead, it relies on a **safe and deterministic cycle**:

```
File change
   ↓
CLI rebuilds resource
   ↓
Resource restart
   ↓
Framework re-discovery
   ↓
Optional session recovery
```

### Session Recovery

When enabled (`sessionLifecycle.recoveryOnRestart`), the framework:

* detects already connected players
* recreates missing sessions
* restores state where possible

This is the **official alternative to hot reload** in OpenCore.

---

## Core Discovery & `core:ready`

Development Mode fully supports automatic CORE discovery.

When running in `RESOURCE` mode:

* the framework waits for CORE availability
* listens for `core:ready`
* polls `isCoreReady()` exports as fallback
* rebinds services automatically

This works:

* on fresh startup
* on late resource starts
* after CORE restarts

No manual wiring is required.

---

## Important Usage Rules ⚠️

### Do **not** use DevMode for CORE in normal development

When working on **satellite resources**, DevMode should run:

* on the resource
* **not on the CORE**

CORE is a **hard dependency**. Restarting it repeatedly:

* invalidates all dependent resources
* causes unnecessary churn

### When DevMode *is* acceptable for CORE

* When developing the CORE resource itself
* When working in isolation
* When no dependent resources are active

---

## How Restarts Are Triggered

Depending on configuration, restarts are triggered via:

* **txAdmin API** (recommended, supports CORE safely)
* Internal HTTP fallback (non-CORE only)

The framework never restarts itself directly.

---

## Best Practices

* Enable DevMode only locally
* Prefer txAdmin for CORE development
* Use session recovery instead of expecting HMR
* Keep `logLevel` explicit in `opencore.config.ts`
* Treat DevMode as an **assistant**, not a runtime

---

## Summary

Development Mode is:

* stable
* predictable
* intentionally conservative

It accelerates development **without compromising architectural guarantees**.

Boring, safe tooling beats clever runtime tricks — especially at scale 🚦
