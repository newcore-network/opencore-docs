---
title: Official Libraries
---

## Overview

OpenCore provides a set of official libraries designed to solve common problems in FiveM development. these libraries are built to work seamlessly with the framework's dependency injection and modular system.

## Key Libraries

### [opencore-identity](https://github.com/newcore-network/opencore-identity)
A specialized library for multi-character management and persistent player data. It acts as a domain-driven layer on top of the framework's `Player` entity.

**Features:**
- **Character Selection**: Built-in flow for selecting, creating, and deleting characters.
- **Persistent Character State**: Extends the persistence contract to handle character-specific data automatically.
- **Identity Abstraction**: Provides a rich `Character` entity that maps to the physical `Player`.
- **Pre-built Contracts**: Includes character persistence and authentication adapters ready to be implemented.

## Why use official libraries?
- **Seamless Integration**: Designed to work with OpenCore's decorators and injection system.
- **Maintenance**: Kept up to date with framework changes.
- **Standardized**: Follows the same architectural patterns as the core framework.

---

:::tip Community Libraries
OpenCore thrives on its ecosystem. If you are developing a library that solves a specific problem using our framework, let us know! We love featuring community-driven tools that help other developers.
:::
