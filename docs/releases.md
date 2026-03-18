---
title: Releases
---

## v1.0.5-beta.2 (Framework) / v1.1.0 (CLI)

### Highlights

- **Adapter System**: Explicit server and client adapter APIs for platform-specific runtimes (FiveM, RageMP, RedM).
- Player creation and remote hydration now support adapter-owned subclasses.
- Client UI bridges for markers, blips, and notifications.
- Lifecycle services for NPC and Vehicle management.
- **CLI Changes**: Removed architecture selection, adapter-driven runtime behavior is now the default.

### Framework - New Features

- `Server.init()` and `Client.init()` now accept `adapter` to install platform adapters during bootstrap.
- Added public adapter helpers in `@open-core/framework/server` and `@open-core/framework/client`.
- Adapter-aware Player serialization hooks for CORE/RESOURCE flows.
- Client runtime bridge contracts (event processors, WebView callbacks, key mappings, ticks no longer depend on CFX globals).
- Lifecycle services and contracts for NPC and Vehicle management.
- `ISpawnActions` interface for player spawn, teleport, and respawn.
- `ClientLoggerBridge` for abstract client-side logging.
- `playerCommand` runtime event.
- RedM-specific ped appearance adapter and client services.
- Runtime platform and game profile detection.
- `useAdapter()` function to pre-set client adapter before initialization.
- WebView abstraction for client UI interactions.
- Dedicated client and server contract files with updated exports.

### Framework - Breaking Changes

- Server bootstrap now defaults to built-in Node adapter when no explicit runtime adapter is provided.
- Platform-specific Player APIs should move into adapter packages through Player subclassing.
- `ClientPlayer` is no longer exported from `@open-core/framework/client`.
- Client bootstrap no longer uses `register-client-capabilities`; use `Client.init({ adapter })` instead.
- `WebViewBridge` is now preferred; `OnView` represents WebView callbacks directly, while `NuiBridge` and `NUI` remain deprecated.

### Framework - Migration Path

For external server adapters:
1. Create adapter with `defineServerAdapter({ name, register(ctx) { ... } })`.
2. Register platform contracts inside `register(ctx)` with `bindSingleton`, `bindInstance`, or `bindMessagingTransport`.
3. If extending `Player`, provide `ctx.usePlayerAdapter({ createLocal, createRemote, serialize, hydrate })`.
4. Pass adapter to `Server.init({ mode, adapter })` in both CORE and RESOURCE resources.

For external client adapters:
1. Create adapter with `defineClientAdapter({ name, register(ctx) { ... } })`.
2. Register transport, appearance, hashing, and runtime bridge contracts inside `register(ctx)`.
3. Pass adapter to `Client.init({ mode, adapter })`.

### CLI - New Features

- Central adapter and runtime inspection for FiveM and RageMP environments.
- Runtime-aware scaffolding for `create resource` and `create standalone`.
- RedM manifest defaults in generated `fxmanifest.lua` files with `game 'rdr3'`.
- Automated coverage for adapter detection and runtime-specific template generation.

### CLI - Changes

- Standardized new project generation on single default layout with `core/src/server.ts`, `core/src/client.ts`, `core/src/features/`.
- **Removed architecture selection** and all legacy architecture-specific generators/templates.
- Documentation updated to reflect adapter-driven runtime behavior.

### CLI - Improvements

- Embedded adapter injection and runtime bootstrap handling during builds.
- Skip redundant binary downloads when `opencore-cli` is already available.

---

## v1.0.0-beta.1

### Highlights

- Major runtime evolution with channels, RPC/events transport, plugins, and library APIs.
- Clearer separation between public API surface and runtime implementations.
- Expanded benchmark coverage.

### New Features

- **Channels and chat API**: Comprehensive channel system (radio, phone, team, admin, proximity).
- **Messaging transport**: Unified architecture with `EventsAPI` and `RpcAPI`.
- **Runtime primitives**: Reusable `BaseEntity`, `Spatial`, `World`.
- **Security**: Contract-based security handlers and observers.
- **Plugin model**: Server and client plugin systems.
- **Autoload**: Automatic controller discovery.

### Breaking Changes

- Service-to-API/implementation migration in multiple modules.
- Transport contracts changed to MessagingTransport + Events/RPC.
- Public vs internal contracts are stricter.
- Import paths normalized.

### Notes

This beta introduced cleaner runtime boundaries, stronger extension points, and richer communication primitives.
