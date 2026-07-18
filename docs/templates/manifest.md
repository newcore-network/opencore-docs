---
title: Template Manifests
---

# `oc.manifest.json`

OpenCore templates can publish metadata through an `oc.manifest.json` file placed at the root of the template directory.

Examples:

- `resources/xchat/oc.manifest.json`
- `standalones/utils/oc.manifest.json`
- `core/oc.manifest.json`

This manifest lets the ecosystem describe what a template is, which runtimes it supports, and what other templates it depends on.

## Why it exists

The manifest solves two problems:

- It gives template authors a clear place to declare compatibility.
- It lets the CLI make smarter decisions when listing or cloning templates.

With manifests in place:

- `opencore clone --list` can show compatibility information.
- `opencore clone <template>` can warn or block when the current project runtime does not match.
- editors can validate manifests using the published JSON Schema.

## File location

Place the manifest in the root of the template folder:

```text
resources/
  xchat/
    oc.manifest.json
standalones/
  utils/
    oc.manifest.json
core/
  oc.manifest.json
```

## Schema URL

The public schema is available at:

```text
https://opencorejs.dev/schemas/oc-manifest.schema.json
```

You can use it directly in the manifest:

```json
{
  "$schema": "https://opencorejs.dev/schemas/oc-manifest.schema.json",
  "schemaVersion": 1,
  "name": "xchat",
  "kind": "resource"
}
```

## Current schema

`schemaVersion: 1` supports these top-level fields:

- `$schema`
- `schemaVersion`
- `name`
- `displayName`
- `kind`
- `description`
- `compatibility`
- `requires`
- `links`

## Field reference

### `schemaVersion`

Current value: `1`

This allows the manifest format to evolve later without breaking existing templates.

### `name`

The machine-friendly template name.

Rules:

- lowercase recommended
- must match `^[a-z0-9][a-z0-9-_]*$`

### `displayName`

Optional human-friendly label for CLI and docs output.

### `kind`

Allowed values:

- `resource`
- `standalone`
- `core`

For official templates, `kind` should match the folder category.

### `description`

Optional short explanation of what the template is for.

### `compatibility`

Describes where the template is expected to work.

```json
{
  "compatibility": {
    "runtimes": ["fivem", "redm"],
    "gameProfiles": ["common"]
  }
}
```

#### `compatibility.runtimes`

Allowed values:

- `fivem`
- `redm`
- `ragemp (Deprecated)`

This is the primary compatibility signal used by the CLI.

#### `compatibility.gameProfiles`

Allowed values:

- `common`
- `gta5`
- `rdr3`

Use this when the template logic is shared but still tied to a game family.

Examples:

- `fivem` + `gta5`
- `redm` + `rdr3`
- multi-runtime + `common`

### `requires`

Declares dependencies on other templates.

```json
{
  "requires": {
    "templates": ["core"]
  }
}
```

#### `requires.templates`

List of template names this template expects.

Typical example:

- framework-connected `resource` templates usually depend on `core`

### `links`

Optional documentation links.

```json
{
  "links": {
    "readme": "./README.md",
    "docs": "https://opencorejs.dev/docs/templates/manifest",
    "repository": "https://github.com/newcore-network/opencore-templates"
  }
}
```

## Example manifests

### Resource

```json
{
  "$schema": "https://opencorejs.dev/schemas/oc-manifest.schema.json",
  "schemaVersion": 1,
  "name": "xchat",
  "displayName": "xChat",
  "kind": "resource",
  "description": "Modern chat resource for OpenCore",
  "compatibility": {
    "runtimes": ["fivem", "redm"],
    "gameProfiles": ["common"]
  },
  "requires": {
    "templates": ["core"]
  },
  "links": {
    "readme": "./README.md"
  }
}
```

### Standalone

```json
{
  "$schema": "https://opencorejs.dev/schemas/oc-manifest.schema.json",
  "schemaVersion": 1,
  "name": "utils",
  "displayName": "Utility Pack",
  "kind": "standalone",
  "description": "Independent utility scripts",
  "compatibility": {
    "runtimes": ["fivem", "redm", "ragemp"],
    "gameProfiles": ["common"]
  }
}
```

### Core

```json
{
  "$schema": "https://opencorejs.dev/schemas/oc-manifest.schema.json",
  "schemaVersion": 1,
  "name": "core",
  "displayName": "Core Runtime",
  "kind": "core",
  "description": "Main OpenCore runtime resource",
  "compatibility": {
    "runtimes": ["fivem"],
    "gameProfiles": ["gta5"]
  }
}
```

## CLI integration

### Generate an example manifest

The CLI can scaffold a starter manifest for an existing target:

```bash
opencore create manifest --resource xchat
opencore create manifest --standalone utils
opencore create manifest --core
```

Use `--force` to overwrite an existing file:

```bash
opencore create manifest --resource xchat --force
```

### Clone behavior

If a template publishes `oc.manifest.json`:

- `opencore clone --list` shows compatibility labels
- `opencore clone <template>` validates runtime compatibility against the current project when `opencore.config.ts` is available
- `opencore clone --force` bypasses compatibility enforcement

Templates without a manifest remain supported and are treated as compatibility `unknown`.

## Best practices

- always set `$schema` to the public schema URL
- keep `name` stable once published
- declare only runtimes you actually support
- use `common` only when the implementation is truly shared
- add `requires.templates` when the template depends on `core` or another published template
- keep `description` short and specific

## Publishing and hosting

The canonical schema lives at `https://opencorejs.dev/schemas/oc-manifest.schema.json`.

In this docs site, that file is served from Docusaurus static assets:

- source: `static/schemas/oc-manifest.schema.json`
- public URL: `/schemas/oc-manifest.schema.json`

When the schema changes:

1. update the source copy in the CLI repository
2. sync the file into `opencore-docs/static/schemas/oc-manifest.schema.json`
3. deploy the docs site
