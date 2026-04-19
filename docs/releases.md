---
title: Releases
---

## v1.0.5 (Framework) / v1.2.0 (CLI)

### Highlights

- The framework continues the adapter-first runtime model with cleaner client/server ports, better command handling, improved worker execution, and broader automated coverage.
- The CLI adds manifest-based templates, adapter validation tools, better dev restart options, improved RageMP support, and more reliable views/build flows.

### Recent Additions

- Added `skipLoadingScreenShutdown` to player spawn flows so FiveM resources using `loadscreen_manual_shutdown 'yes'` can control when the loading screen is dismissed.
- Added client-side `@Service()` support from `@open-core/framework/client` so client architecture matches the documented server controller/service split.

### Framework

- Added clearer client adapter ports for camera, ped, vehicle, progress, spawn, local player, runtime bridge, and WebView behavior.
- Improved command execution with validation, better schema handling, and support for default function parameters.
- Refined logger and worker internals with dynamic log domains and inline worker execution for parallel compute tasks.
- Updated tooling to TypeScript 6 and expanded tests around adapters, commands, vehicle state, and parallel compute.

### CLI

- Added `oc.manifest.json` support for official templates, including runtime compatibility, game profiles, template dependencies, and schema validation.
- Added `opencore create manifest` and `opencore adapter check` for easier template authoring and adapter package validation.
- Improved `opencore clone` with compatibility checks, `--force`, manifest-aware listing, and safer RageMP cloning behavior.
- Added configurable dev restart modes (`auto`, `process`, `txadmin`, `none`), better JSX/TSX and Vite views support, and release channel support for stable updates.

### Notes

- Older release entries were removed to keep this page focused on the current framework and CLI release line.
