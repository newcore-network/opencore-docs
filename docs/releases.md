---
title: Releases
---

## v1.0.0-beta.1

### Highlights

- Major runtime evolution with channels, RPC/events transport, plugins, and library APIs.
- Large architecture and cleanup pass across the codebase.
- Expanded benchmark coverage and refreshed benchmark results for this beta cycle.
- Clearer separation between public API surface and runtime implementations (ports/contracts vs local/remote implementations).
- Core runtime primitives are now more explicit and reusable (`BaseEntity`, `Spatial`, `World`, library core).

### New Features

- **Channels and chat API ecosystem**
  - Added a comprehensive channel system (radio, phone, team, admin, proximity).
  - Added communication controller examples and extensive JSDoc for channel APIs.
  - Exported channel API ports and removed legacy channel implementation paths.
- **Messaging transport and RPC/events**
  - Introduced a unified messaging transport architecture with `EventsAPI` and `RpcAPI`.
  - Added stronger typed runtime contexts for server/client events and RPC.
  - Added/expanded RPC decorator and handler support (`@OnRPC`) with integration tests.
- **Runtime surface expansion**
  - Consolidated core concepts around reusable runtime primitives (`BaseEntity`, `Spatial`, `World`) exported from runtime core.
  - Added Appearance API wrapper for validation/apply/reset flows.
  - Added Camera and Cinematic services, cinematic builder, and typed lifecycle payloads.
  - Added ped abstractions (Cfx + Node implementations) and server-side NPC lifecycle APIs.
  - Added first-class runtime library factories (`createServerLibrary`, `createClientLibrary`) and dedicated library event bus/processors.
- **Public API boundary and port model**
  - Server public API now explicitly exports API ports (`players.api-port`, `authorization.api-port`, `channel.api-port`) through `runtime/server/api`.
  - Internal runtime ports were isolated under `ports/internal` (`command-execution`, `player-session-lifecycle`) to mark non-public contracts.
  - Runtime services were moved toward explicit local/remote implementations under `runtime/server/implementations/*`.
- **Security and validation flow**
  - Principal/authorization and command/net validation paths were tightened through contract-based security handlers and observers.
  - Runtime config and validation behavior were expanded and benchmarked (including validation-heavy and error-path scenarios).
- **Plugin model**
  - Added server plugin kernel MVP with extensible API hooks.
  - Added client-side plugin system and plugin lifecycle hook after server initialization.
- **Autoload and developer experience**
  - Added autoload for user server controllers.
  - Improved client controller autoloading and metadata scanning error handling.
- **Benchmark system**
  - Added broad benchmark suites for BinaryService, SchemaGenerator, EntitySystem, AppearanceValidation, EventInterceptor, RuntimeConfig.
  - Added load benchmarks for RPC concurrency, validation, and request lifecycle.

### Performance Snapshot (26/02/2026)

- Core (Tinybench):
  - `EventInterceptor.getStatistics` ~17.78M ops/sec (mean ~0.056 us)
  - `RuntimeConfig.resolve(CORE)` ~10.49M ops/sec (mean ~0.095 us)
  - `@Command` metadata definition ~6.92M ops/sec (mean ~0.145 us)
- Load (Vitest):
  - Commands (500 players, simple): ~80.14K ops/sec, p95 ~0.226 ms
  - Pipeline (500 players, simple): ~92.04K ops/sec, p95 ~0.205 ms
  - RPC (500 parallel): ~251.10K ops/sec, p95 ~1.83 ms, p99 ~1.97 ms

### Breaking Changes

- Service-to-API/implementation migration in multiple modules (notably `*Service` naming changes).
- Channel/chat APIs were renamed and moved (`ChannelService` -> `Channels`, `ChatService` -> `Chat`, moved to `apis/`).
- Transport contracts changed from legacy net transport shape to MessagingTransport + Events/RPC APIs.
- Port/file naming was normalized (`player-directory` -> `players.api-port`, `principal.port` -> `authorization.api-port`, plus related API file renames).
- Public vs internal contracts are stricter: `api-port` exports are public surface, while `ports/internal/*` are runtime internals and should not be consumed directly.
- Deprecated methods, stale docs, and obsolete examples were removed.
- Import paths and shared types were normalized/centralized (including parallel compute types and decorator/binary file naming updates).

### CLI Context

- OpenCore CLI now supports cleaner non-interactive build output for CI environments (for example `opencore build --output=plain`).

### Notes

This beta is a major milestone for OpenCore: cleaner runtime boundaries, stronger extension points, and richer communication primitives while keeping decorator-driven DX.

v1.0.0-beta.x is still in active development. Additional polish, API refinements, and documentation improvements are ongoing.

Compatibility with **RedM** remains under active review and validation.

---

## v0.3.x

v0.3.x remains the stability foundation that led into the v1 beta line:

- explicit server/client runtime entrypoints
- strict runtime boundaries
- setup/provider model with fail-fast behavior
- security-first defaults and decorator pipeline
