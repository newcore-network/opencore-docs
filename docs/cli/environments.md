---
title: Environment System
---

The OpenCore environment system lets you maintain **multiple environment configurations** (development, production, staging, etc.) without modifying source files on disk. The correct environment file is resolved at **build time** via esbuild, so your git tree stays clean.

This is conceptually identical to [Angular's environment system](https://angular.dev/tools/cli/environments), adapted for the OpenCore build pipeline.

## How it works

When you run `opencore build --environment production`, the CLI:

1. Reads the `environments/environment.production.ts` file from your project root.
2. Registers an esbuild plugin that intercepts any import of `@opencore/environment` and redirects it to that file.
3. Applies any per-environment build option overrides (`minify`, `sourceMaps`, `logLevel`, `fileReplacements`).
4. Builds all resources with those settings in effect.

Source files are **never touched**. The substitution is entirely in-memory at build time.

## Project structure

Running `opencore init` generates an `environments/` directory at the project root:

```
environments/
├── environment.model.ts          # Your AppEnvironment interface
├── environment.development.ts    # Development values
└── environment.production.ts     # Production values
```

### `environment.model.ts`

Define the shape of your environment object here. This is a plain TypeScript interface — add whatever fields your project needs:

```typescript
export interface AppEnvironment {
  name: string
  production: boolean
  features: {
    debugLogs: boolean
    mockAccounts: boolean
  }
}
```

### `environment.development.ts`

```typescript
import type { AppEnvironment } from './environment.model'

export const environment: AppEnvironment = {
  name: 'development',
  production: false,
  features: {
    debugLogs: true,
    mockAccounts: true,
  },
}
```

### `environment.production.ts`

```typescript
import type { AppEnvironment } from './environment.model'

export const environment: AppEnvironment = {
  name: 'production',
  production: true,
  features: {
    debugLogs: false,
    mockAccounts: false,
  },
}
```

You can add as many environment files as you need. The naming convention is `environment.<name>.ts`. There are no reserved names — `staging`, `qa`, `local`, etc. are all valid.

## Using environments in your resources

Import `@opencore/environment` from any server or client file:

```typescript
import { environment } from '@opencore/environment'

if (environment.features.debugLogs) {
  logger.debug('Player connected:', player.name)
}
```

At build time, this import is resolved to the file that matches the active environment. In development builds it resolves to `environment.development.ts`; in production builds to `environment.production.ts`.

## CLI flags

Pass `--environment` (or `-e`) to `opencore build` and `opencore dev`:

```bash
# Build for production
opencore build --environment production

# Build for a custom environment
opencore build --environment staging

# Dev mode with explicit environment
opencore dev --environment development
```

### Priority order

When multiple sources specify an environment, the following priority applies (highest to lowest):

| Source | Example |
|---|---|
| CLI flag | `--environment production` |
| Environment variable | `OPENCORE_ENVIRONMENT=production` |
| Config file | `build.environment` in `opencore.config.ts` |
| Default | `development` |

## Per-environment build overrides

Each environment can override specific build options in `opencore.config.ts`:

```typescript
export default defineConfig({
  build: {
    logLevel: 'INFO',
    minify: false,
    sourceMaps: false,

    environments: {
      development: {
        minify: false,
        sourceMaps: true,
      },
      production: {
        minify: true,
        sourceMaps: false,
        logLevel: 'ERROR',
      },
      staging: {
        minify: true,
        sourceMaps: true,
        logLevel: 'WARN',
      },
    },
  },
})
```

Available override fields per environment:

| Field | Type | Description |
|---|---|---|
| `minify` | `boolean` | Minify output |
| `sourceMaps` | `boolean` | Emit source maps |
| `logLevel` | `LogLevel` | Build-time log verbosity (`DEBUG`, `INFO`, `WARN`, `ERROR`) |
| `fileReplacements` | `FileReplacement[]` | Replace arbitrary source files at build time |

Overrides are merged on top of the root `build` config. Fields not specified in the environment override keep their root value.

## File replacements

`fileReplacements` lets you swap any source file for an environment-specific alternative, not just the environment object itself. This is useful for API configs, feature flag modules, or any file with environment-specific values:

```typescript
build: {
  environments: {
    production: {
      minify: true,
      sourceMaps: false,
      fileReplacements: [
        { replace: './src/config/api.ts', with: './src/config/api.prod.ts' },
        { replace: './src/config/logger.ts', with: './src/config/logger.prod.ts' },
      ],
    },
  },
}
```

Paths are relative to the project root. At build time, any import of `./src/config/api.ts` (from any resource in the project) will be silently redirected to `./src/config/api.prod.ts`.

## IDE support

The `@opencore/environment` module specifier is not a real npm package — it only exists at build time. To prevent TypeScript errors in your editor, the project's root `tsconfig.json` includes a `paths` mapping pointing to the development file:

```json
{
  "compilerOptions": {
    "paths": {
      "@opencore/environment": ["./environments/environment.development.ts"]
    }
  }
}
```

This is purely an IDE hint. It does **not** affect the build — the CLI's esbuild plugin overrides it at compile time regardless of what `tsconfig.json` says.

## Build validation

If an `environments/` directory exists in your project and you request an environment that has no corresponding file, the build **fails immediately** with a clear error listing the available options:

```
error: environment "stagging" not found
available environments: development, production, staging
```

This prevents silent fallback to the wrong environment.

## Recommended scripts

Add convenience scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "opencore build",
    "build:production": "opencore build --environment production",
    "build:staging": "opencore build --environment staging",
    "dev": "opencore dev"
  }
}
```
