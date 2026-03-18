---
title: Commands
---

## Project structure 📁

OpenCore projects follow a **clear and enforced structure**, understood and validated by the CLI.

- **Resources (`resources/`)**  
  Framework-connected modules.  
  They have access to:
  - Dependency Injection (DI)
  - Core exports
  - Shared services
  - Runtime lifecycle

- **Standalones (`standalones/`)**  
  Independent scripts with **no framework dependency**.  
  Ideal for:
  - Legacy Lua/JS scripts
  - Utilities
  - Third-party integrations

The CLI uses this structure to infer **build targets, runtime rules, and dependency boundaries**.

---

## Command reference 🧭

### `opencore init [name]`

Initializes a new OpenCore project using a guided wizard.

What it does:
- Creates the base workspace
- Generates `package.json` and `opencore.config.ts`
- Prepares the project for immediate development

#### Flags

- `--dir, -d <path>`  
  Directory where the project folder will be created  
  ```bash
    opencore init my-server -d "D:/dev/servers"
  ```

* `--architecture <domain-driven|layer-based|feature-based|hybrid>`
  Preselects the project architecture (also usable in non-interactive mode)

* `--minify`
  Enables production minification in the generated config

* `--module <name>` *(repeatable)*
  Installs and declares official modules during initialization

  ```bash
  --module @open-core/identity
  ```

* `--destination <path>`
  Sets the final build output directory
  (usually your FiveM `resources` folder)

* `--skip-destination`
  Skip destination setup (can be edited later)

* `--non-interactive`
  Run without the wizard (requires `project-name`)

---

### `opencore dev`

Starts development mode with fast feedback loops ⚡

Features:

* Hot reload for resources
* Incremental recompilation
* Live logs and framework events streamed to the terminal

Designed for:

* Rapid iteration
* Gameplay tuning
* Debugging framework behavior

---

### `opencore build`

Builds all resources for production deployment.

What happens internally:

* Parallel compilation using all CPU cores
* Runtime-aware bundling (server / client / Views)
* Dependency linking to avoid duplicated `node_modules`
* Detection of native Node.js packages incompatible with FiveM
* Minification and cleanup of development metadata

This command produces **ready-to-run FiveM resources**.

---

### `opencore create <type> [name]`

Generates standardized boilerplate.

#### Sub-commands

* `feature [name]`
  Creates a new feature module
  (in Core or in a specific resource using `-r`)

* `resource [name]`
  Creates a new satellite resource under `resources/`

* `standalone [name]`
  Creates an independent script under `standalones/`

#### Flags

* `-r, --resource <name>`
  Target a specific resource

* `--with-client`
  Include a client-side entry point

* `--with-nui`
  Include Web/Views scaffolding

---

### `opencore clone <template>`

Downloads official templates from
[https://github.com/newcore-network/opencore-templates](https://github.com/newcore-network/opencore-templates)

Options:

* `-l, --list` – List available templates
* `--api` – Use GitHub API if `git` is unavailable

Useful for:

* Reference implementations
* Quick starts
* Best-practice examples

---

### `opencore doctor`

Checks project and environment health 🩺

Validates:

* Node.js and Go versions
* Project structure
* Configuration correctness
* Missing or invalid fields

Recommended to run when:

* Setting up a new machine
* Debugging unexpected behavior

---

### `opencore update`

Checks for and installs the latest version of the OpenCore CLI.

Keeps your tooling aligned with framework changes.

---

## Global flags 🌍

* `-v, --version` – Display CLI version
* `-h, --help` – Show help for any command

---

The CLI is **not optional tooling**.
It is the reference implementation for building and validating OpenCore projects.
