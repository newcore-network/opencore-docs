---
title: Libraries Overview
---

## Overview

OpenCore provides a set of official libraries designed to solve common problems in multiplayer game server development. These libraries integrate directly with the framework’s dependency injection system and follow the same architectural conventions as the core.

:::warning Current Maintenance Status
At the moment, only the OpenCore framework, adapters, and CLI are actively maintained.

External libraries are not being actively maintained right now due to limited time. This includes packages such as Identity, Characters, and other ecosystem libraries.

They may be outdated relative to the current framework API, and they are **not recommended for new production work** until maintenance resumes.
:::

If you are already working with library runtime wrappers and events, see [Library API Usage](./library-api-usage.md).
If you are integrating install-time runtime extensions, see [Plugin API Usage](./plugin-api-usage.md).

## Library API vs Plugin API

OpenCore now exposes two complementary integration layers:

- **Library API**
  Domain-level runtime helpers and event buses (`createServerLibrary`, `createClientLibrary`, `emit`, `OnLibraryEvent`, namespaced event ids).
- **Plugin API**
  Install-time runtime extensions through `init({ plugins })` / `init({ plugins })`, with DI registration and API extension hooks.

Use Library API for domain communication. Use Plugin API for bootstrapping and extending runtime surface.

## Key Libraries

### [opencore-identity](./official-libraries/opencore-identity.md)
A focused identity and authentication library for OpenCore.
`opencore-identity` is responsible for **player identity, registration, and authentication flows**, independent of gameplay systems such as characters, inventories, or roles. It provides the foundation on which higher-level systems can be built.

**Responsibilities:**
- **Identity Management**: Defines and manages a persistent identity linked to a player.
- **Registration Flow**: Handles user registration and initial identity creation.
- **Authentication Strategies**: Supports multiple authentication mechanisms through pluggable providers.
- **Persistence Contracts**: Exposes clear contracts for storing and retrieving identity data.
- **Framework Integration**: Designed to work seamlessly with OpenCore’s DI, decorators, and lifecycle.

### [opencore-characters](./official-libraries/opencore-characters.md)
Character domain library for account-owned characters, active selection state, policies, and events.

**Responsibilities:**
- **Character Lifecycle**: Create, update, delete, and select characters with ownership checks.
- **Policy-Driven Rules**: Slot and deletion logic through explicit contracts.
- **Event Integration**: Internal domain events via OpenCore Library API, with optional external bridge.
- **Plugin-First Server Setup**: Install through OpenCore Plugin API (`init({ plugins })`).
- **Minimal Client Surface**: Transport helpers only, no UI layer bundled.

## Why use official libraries?
- **Clear Scope**: Each library solves one problem well.
- **Seamless Integration**: Built specifically for OpenCore’s architecture.
- **Version awareness required**: Check maintenance status and compatibility before adopting a library.
- **Composable**: Designed to be combined with other libraries without tight coupling.

---

:::info Community Libraries
OpenCore grows through its ecosystem. If you are building a library on top of the framework and think it could help others, let us know—we are happy to showcase community-driven projects.
:::
