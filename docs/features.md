---
title: Features & Comparative
---

Here you can find the most important features of OpenCore, and a healthy comparison with other frameworks.

## Features List

- TypeScript-first runtime framework for FiveM (via adapters). Not a gamemode.
- Clear Client / Server entry points (`@open-core/framework/{client|server|shared}`).
- Hexagonal architecture (Ports & Adapters):
  - Kernel: DI, logging, metadata scanning
  - Runtime: processors, lifecycle, feature toggles
  - Adapters: FiveM + Node (mock/testing)
- Runtime modes:
  - CORE: authoritative provider (exports + broadcasts readiness)
  - RESOURCE: satellite resource (can delegate features to CORE)
  - STANDALONE: self-contained runtime (no CORE dependency)
- Decorator-based programming model (metadata + processors):
  - Server: ``Controllers``, ``Commands``, ``OnNet``, ``Exports``, ``Ticks``, ``Framework/Runtime`` ``Events``
  - Client: ``Controllers``, ``OnNet``, ``Game Events``, ``Ticks/Intervals/Keys``, ``Local Events``, ``Resource Start/Stop``, ``Exports``, ``NUI``
- Cross-resource discovery & coordination (CORE ↔ RESOURCE):
  - CORE signals readiness via engine events and net broadcast (`core:ready`)
  - RESOURCE waits for CORE using multiple mechanisms (event + export polling + request-ready)
  - Optional dependency hooks (`onDependency.waitFor`, `onDependency.onReady`)
- Commands & chat integration:
  - Commands can be declared in any resource
  - In RESOURCE mode, command execution can be delegated to CORE (single authority, no duplicates)
- Security primitives (opt-in per feature):
  - schema-based input validation
  - guards / principals (pluggable PrincipalProvider)
  - throttling
  - state requirements
- Type-safe NUI bridge (typed UI ↔ runtime messaging).
- Binary Services (external native processes):
  - persistent process managed by OpenCore
  - JSON-RPC over stdin/stdout
  - timeouts + safe registration
- Session lifecycle support:
  - optional session tracking
  - recovery on restart (useful for hot-reload/dev)
- DevMode tooling *(optional)*:
  - CLI bridge (telemetry/log streaming)
  - event interception + history
  - state inspection
  - player simulation (virtual players)
- Testing & benchmarks included (Vitest + benchmark suite).
- CLI support for project workflows: [OpenCore CLI](./cli/introduction.md).

## Healthy Comparison (Scope & Trade-offs)

This comparison is intentionally neutral: it focuses on **scope, built-in systems, and development model**.  
OpenCore is **infrastructure-first** (a framework runtime), while ESX/ND/QBCore/Qbox are **gameplay frameworks** (they ship roleplay building blocks).

| Area | OpenCore | ESX | ND Framework | QBCore | Qbox |
|---|---|---|---|---|---|
| **Primary goal** | Runtime & architecture to build custom systems and modules | Economy-driven RP framework | Multipurpose RP framework with official addon pack | RP framework ecosystem centered around a shared Core Object | Modern RP framework built on QBCore foundations |
| **Target audience** | Developers who want full control and long-term architecture | Server owners wanting fast RP setup | Server owners wanting a structured RP stack | Server owners using a large RP ecosystem | Server owners wanting QBCore compatibility with modern defaults |
| **“Batteries included” gameplay** | No (items, economy, factions are external libraries/resources) | Yes (jobs, money, banking, society systems, UI, addons) | Yes (core + official resources like police, inventory, phone, banking) | Partial (core API + large ecosystem of gameplay resources) | Yes (qbx_core ships multicharacter, multijob, queue, etc.) |
| **Programming model** | TypeScript + DI + decorators (metadata → processors) | Lua + ESX API (events, callbacks, exports) | Lua + ND API + ox ecosystem | Lua + Core Object API | Lua + qbx_core exports + ox ecosystem |
| **Architecture emphasis** | Explicit architecture (Ports & Adapters, runtime modes, providers) | Practical and resource-oriented | Pack-oriented with strong defaults | Ecosystem-driven modularity | QBCore-compatible, with focus on performance and security |
| **Type safety** | Strong (TypeScript, contracts, typed NUI) | Tooling-dependent (Lua) | Tooling-dependent (Lua) | Tooling-dependent (Lua) | Tooling-dependent (Lua) |
| **Database expectations** | Database-agnostic (via adapters) | Typical RP stack (MySQL/MariaDB) | oxmysql + MariaDB by default | oxmysql commonly used | MariaDB required (installation stack) |
| **Permissions & security** | Guards, principals, throttling, state requirements (opt-in) | Varies by resource | Groups + ACE / Discord role integration | Core-based permissions | Security-focused defaults |
| **Migration / compatibility** | Clean break by design | Very large legacy ecosystem | Compatibility modes available | Very large script ecosystem | Backwards-compatible with most QBCore scripts |
| **Engine support** | FiveM and RedM (via adapters) | FiveM | FiveM | FiveM | FiveM |

### Why OpenCore exists

OpenCore exists to solve problems **below gameplay level**:

* Provide a **strongly typed, explicit runtime** instead of global APIs.
* Make complex servers maintainable over time through **architecture and contracts**.
* Allow gameplay systems (items, economy, factions) to evolve independently as libraries.
* Enable testing, external tooling, and native binaries outside the game runtime.
* Support both **FiveM and RedM** with the same architectural model.

OpenCore is a good choice if you:

* want to design your own systems instead of adopting predefined RP rules
* Large projects, Large teams
* care about long-term maintainability and refactoring
* prefer TypeScript, structure and explicit boundaries
* treat your server like a software project, not just a collection of scripts

**In short**:
Other frameworks give you **a ready roleplay game**.
OpenCore gives you **the tools to build your own**.

Neither approach is better — they simply solve **different problems**.
