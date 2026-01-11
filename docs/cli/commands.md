---
title: Commands
---

## Project Structure

OpenCore projects follow a standardized structure enforced by the CLI:
- **Resources**: Framework-connected modules in the `resources/` folder. They have access to the Dependency Injection (DI) container, shared services, and the core runtime.
- **Standalones**: Independent scripts in the `standalones/` folder. These are self-contained and have no framework dependencies, making them ideal for simple utilities or legacy logic.

## Command Reference

### `opencore init [name]`
Initializes a new OpenCore project with a guided wizard. 
- Creates the base directory structure.
- Generates `package.json` and `opencore.config.ts`.
- Prepares the workspace for your favorite package manager.

#### Flags 
- `--dir, -d <path>`: Directory where the project folder will be created.
  - Example: `opencore init my-server -d "D:/dev/servers"` creates `D:/dev/servers/my-server`
- `--architecture <domain-driven|layer-based|feature-based|hybrid>`: Preselects the project architecture (also usable in non-interactive mode).
- `--minify`: Enables minification in the generated config.
- `--module <name>` (repeatable): Installs/declares official modules during init.
  - Example: `--module @open-core/identity`
- `--destination <path>`: Sets the build output directory (usually your FiveM `resources` folder).
  - **Note:** This is the **final build output** (what gets produced by `opencore build`).
- `--skip-destination`: Do not set `destination` during init (you can edit ``opencore.config.ts`` later).
- `--non-interactive`: Do not run the wizard; use flags/defaults. Requires `project-name`.

### `opencore dev`
Starts the development mode with high-productivity features:
- **Hot Reload**: Automatically reloads modified modules in the FiveM server without restarting the entire resource.
- **Incremental Watching**: Only recompiles the files you change, keeping the feedback loop under 500ms.
- **Live Logging**: Captures framework events and logs directly in your terminal.

### `opencore build`
Prepares all resources for production deployment.
- **Parallel Compilation**: Distributes the workload across all CPU cores using the Go engine.
- **Dependency Linking**: Automatically handles `node_modules` symlinking for server-side resources to prevent duplication.
- **Native Package Detection**: Scans your dependencies for C++ bindings (like `bcrypt` or `sqlite3`) and warns you if they are incompatible with the FiveM runtime.
- **Optimization**: Applies minification and strips development-only reflection data.

### `opencore create <type> [name]`
Generates standardized boilerplate for different project components.

#### Sub-commands:
- `feature [name]`: Creates a new feature module in the core (or a specific resource using `-r`).
- `resource [name]`: Creates a new satellite resource in the `resources/` folder.
- `standalone [name]`: Creates an independent script in the `standalones/` folder.

#### Flags:
- `-r, --resource <name>`: Specify a target resource for a new feature.
- `--with-client`: Include a client-side entry point.
- `--with-nui`: Include NUI (web) scaffolding.

### `opencore clone <template>`
Downloads official templates from the [opencore-templates](https://github.com/newcore-network/opencore-templates) repository.
- `-l, --list`: Lists all available templates (e.g., `xchat`, `identity-base`).
- `--api`: Forces the use of the GitHub API if `git` is not available on the system.

### `opencore doctor`
Validates your environment and project health. It checks for:
- Required Node.js and Go versions.
- Correct project structure.
- Missing or invalid configuration fields.

### `opencore update`
Checks for and installs the latest version of the OpenCore CLI.

#### Flags:
- `-f, --force`: Forces an update check by ignoring the local version cache. Use this if you know a new version is out but the CLI says it's up to date.
---

## Global Flags
- `-v, --version`: Display the current version of the CLI.
- `-h, --help`: Show help for any command.