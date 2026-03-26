---
title: Official Templates
---

## Overview

Templates are ready-to-use resource structures that help you start new features quickly. They provide a standardized way to organize your code and assets.

## Featured Templates

### [opencore-templates](https://github.com/newcore-network/opencore-templates)
A collection of official resource boilerplates and production-ready implementations to accelerate your development.

**Included Templates:**
- **xChat**: A feature-rich chat implementation including radial menus, command suggestions, and high-performance message routing. It serves as the reference implementation for the `ChatPort`.
- **Base Resource**: A lightweight, boilerplate-free starting point for any OpenCore resource, pre-configured with TypeScript, tsyringe, and the core runtime.
- **Identity Implementation**: A template showing how to implement the `opencore-identity` library in a real project.

## Usage
You can instantiate templates using the OpenCore CLI or by cloning the official template repositories.

### Template metadata

Official templates can publish an `oc.manifest.json` file that declares:

- template kind (`resource`, `standalone`, or `core`)
- runtime compatibility (`fivem`, `redm`, `ragemp`)
- game profile compatibility (`common`, `gta5`, `rdr3`)
- dependencies on other templates through `requires.templates`

This metadata is used by the CLI to show compatibility in `opencore clone --list` and to validate `opencore clone <template>` against the current project runtime.

Read the full format here:

- [Template Manifests](./manifest)

---

:::info Community Templates
Do you have a template that follows OpenCore's best practices? We welcome community contributions! Feel free to reach out or submit your template to be featured in our official documentation.
:::
