---
title: Overview
---

## Overview

OpenCore provides a set of official libraries designed to solve common problems in FiveM development. These libraries integrate directly with the framework’s dependency injection system and follow the same architectural conventions as the core.

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

## Why use official libraries?
- **Clear Scope**: Each library solves one problem well.
- **Seamless Integration**: Built specifically for OpenCore’s architecture.
- **Maintained**: Kept in sync with framework evolution.
- **Composable**: Designed to be combined with other libraries without tight coupling.

---

:::info Community Libraries
OpenCore grows through its ecosystem. If you are building a library on top of the framework and think it could help others, let us know—we are happy to showcase community-driven projects.
:::