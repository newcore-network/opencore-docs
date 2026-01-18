---
title: Releases
---

## v0.3.x – Stability and compatibility

The **v0.3.x** release line represents a major stabilization milestone for OpenCore.  
This version introduces **breaking changes** compared to `v0.2.x` and establishes the architectural foundations that future versions will build upon.

The primary goals of `v0.3` are:
- Enforce **strict runtime boundaries** (client vs server)
- Simplify the framework through a **zero-config philosophy**
- Improve **Node.js compatibility and testability**
- Reduce internal complexity and remove legacy systems

### ⚠️ Breaking changes

This release is **not backward compatible** with `v0.2.x`. Updating requires code and import adjustments.

Key breaking changes include:

- **Public API reorganization**
  - Runtime-specific APIs must now be imported explicitly:
    - `@open-core/framework/server`
    - `@open-core/framework/client`
  - The generic runtime entry points were removed.
  - The root package now exposes only kernel-level, runtime-agnostic APIs.

- **Strict client / server separation**
  - Client code can no longer accidentally bundle or reference server-only logic.
  - This prevents runtime leaks and improves security and predictability.

- **Zero-config feature system**
  - Core features (commands, events, guards, etc.) are enabled by default.
  - Providers are automatically selected based on runtime mode.
  - Manual feature configuration, export flags, and provider wiring were removed.

- **Removal of legacy modules**
  - Internal database services and `resourceGrants` were removed.
  - Deprecated modules such as `auth`, `http`, and `config` were fully eliminated.
  - Persistence and external services must now be handled explicitly by the user or external resources.

- **Decorator and naming changes**
  - Some decorators were renamed for consistency (for example, runtime-specific event decorators).
  - Internal DI container naming was unified and stabilized.

### Identity and security defaults

- The identity system is now **enabled by default**.
- A default `PrincipalProvider` is automatically registered when none is supplied.
- Guarded actions default to **deny**, improving security and reducing misconfiguration errors.

### Improved Node.js compatibility

- Core services no longer depend directly on FiveM globals.
- Server logic can be executed and tested in pure Node.js environments.
- This enables proper unit testing, simulation, and CI workflows.

### Validation and command handling improvements

- Argument and tuple schema processing was refactored.
- Commands and events now support clearer validation logic and improved parameter handling.
- This results in more predictable runtime behavior and better developer feedback.

### Migration notes

When migrating from `v0.2.x` to `v0.3.x`, you should:

1. Update all imports to use explicit `client` / `server` entry points.
2. Remove custom feature configuration from initialization.
3. Delete references to removed legacy modules.
4. Review decorator usage and update renamed decorators where applicable.

A detailed migration guide is provided in the documentation.

---

**v0.3.x is the baseline for long-term stability.**  
Future releases will focus on additive features and tooling, not architectural rewrites.
