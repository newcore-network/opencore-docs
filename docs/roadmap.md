---
title: Roadmap
---

This roadmap describes the **evolution path of OpenCore**.  
It is intentionally concise and focused on long-term correctness rather than fast expansion.

---

## Phase 0 — Foundation (Completed)

Core architecture and mental model.

- CORE / RESOURCE / STANDALONE runtime model
- Dependency Injection container
- Decorator-based API (Controller, Command, OnNet, etc.)
- Global command system with delegation
- Centralized error handling
- Contracts & Setup API
- Safe defaults and fail-fast bootstrap
- CLI-based build system

This phase establishes OpenCore as a **framework**, not a collection of helpers.

## Phase 1 — Core Stability (Current)

Focus: **solid foundations and API confidence**.

- Finalize v0.3.x public APIs
- Stabilize CORE / RESOURCE / STANDALONE behavior
- Complete and align documentation with real runtime behavior
- Improve error reporting and logging clarity
- Reduce breaking changes

Goal: OpenCore must be safe to adopt and reason about.

---

## Phase 2 — Developer Experience (Ongoing)

Focus: **developer productivity and feedback loops**.

- Improve CLI workflows and build tooling
- Better DevMode capabilities (inspection, simulation, debugging)
- Clearer errors and diagnostics
- More examples and reference patterns

Developer experience is developed **in parallel** with core stabilization.

---

## Phase 3 — Multi-Runtime Compatibility

Focus: **secure, portable runtime abstraction**.

- Strengthen adapter layer
- Isolate FiveM-specific assumptions
- Enable safe compatibility with:
  - RedM
  - RageMP
- Unified command and event model across runtimes
- Runtime capability detection and validation

Goal: OpenCore logic should be portable without sacrificing security.

---

## Phase 4 — Ecosystem & Extensions

Focus: **controlled growth**.

- Optional official modules
- Extension guidelines
- Compatibility and versioning strategy
- Long-term maintenance guarantees

---

## Guiding Principles

- Stability before features
- Explicit configuration over hidden behavior
- Secure by default
- Runtime-agnostic core, runtime-specific adapters

---

This roadmap is **directional**, not fixed.  
It evolves based on real usage and constraints.
