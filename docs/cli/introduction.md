---
title: Overview
---

## What is OpenCore CLI?

The **OpenCore CLI** is the official command-line tool designed to orchestrate the development, building, and management of FiveM projects using the OpenCore Framework. It provides a modern developer experience similar to tools like NestJS CLI or Vite, but specifically tailored for the FiveM environment.

## Key Concepts

The CLI distinguishes between three main types of components:

- **Core**: The central brain of your server. It contains the framework runtime and shared logic.
- **Satellite Resources**: Modular resources that depend on the Core. They are optimized for small bundle sizes and high performance.
- **Standalone Resources**: Independent resources that don't require the framework (e.g., legacy Lua scripts or utility JS).

## Why Go?

The CLI and its compiler are written in **Go (Golang)** for several critical reasons:

1.  **Extreme Performance**: Go's native compilation and efficient concurrency model (goroutines) allow us to run builds in parallel across all your CPU cores.
2.  **Single Binary**: No need to install complex dependencies. The CLI comes as a single executable that includes everything it needs to build your project.
3.  **Low Resource Footprint**: Building 10+ resources simultaneously consumes minimal RAM compared to Node.js-based build tools.

## CLI Syntax

When using CLI commands, you will see arguments wrapped in specific brackets. Understanding these is crucial for correct usage:

- **`<argument>`**: **Required**. You must provide this value for the command to work (e.g., `<type>` in `create`).
- **`[argument]`**: **Optional**. You can omit this value, and the CLI will either use a default or prompt you for it (e.g., `[name]` in `init`).

## Recommended Environment

### Package Manager: `pnpm`
While `npm` and `yarn` are supported, **`pnpm` is highly recommended** and is the primary choice for OpenCore projects.
- **Compatibility**: The CLI's dependency linker is optimized for `pnpm`'s content-addressable storage.
- **Performance**: Faster installations and efficient disk usage across multiple resources.
- **Strictness**: Ensures that resources only access dependencies explicitly declared in their `package.json`.

## Technical Dependencies

The CLI isn't just a wrapper; it manages a complex build pipeline that depends on your project's configuration and the UI frameworks you choose:

### NUI / Views Dependencies
The compiler (`internal/builder/embedded/views.js`) automatically detects which framework you are using and requires the corresponding adapters to be installed in your project:

- **React**: Requires `react` and `react-dom`.
- **Svelte**: Requires `svelte` and `esbuild-svelte`.
- **Vue**: Requires `vue` and `esbuild-plugin-vue3`.
- **SASS/SCSS**: Requires `sass` and `esbuild-sass-plugin`.

If the compiler detects these files but the dependencies are missing, it will provide a clear error message with the exact `pnpm add` command needed.

### Framework Adapters
The CLI's behavior changes based on how your resources interact with the **OpenCore Framework**:
- **Satellite Resources**: Depend on the Core's exports. The CLI ensures these exports are correctly mapped during the build.
- **Neutral Runtime**: For client-side code, the CLI strips all Node.js and Web APIs, as the FiveM client environment is "neutral" (JS only).
