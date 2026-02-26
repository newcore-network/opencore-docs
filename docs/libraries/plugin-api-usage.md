---
title: Plugin API Usage
description: Install-time runtime extension model for OpenCore server and client.
---

## Overview

The Plugin API is OpenCore's install-time extension system.

It is designed for libraries that need to:

- register services into DI,
- expose runtime API extensions,
- read init configuration,
- and hook into framework bootstrap in a predictable order.

Unlike dynamic plugin ecosystems, OpenCore plugins are compile-time integrated and installed explicitly in `init()`.

## Entry Points and Boundaries

- Server plugins: `@open-core/framework/server`
- Client plugins: `@open-core/framework/client`

Plugin contracts are intentionally not exposed from `@open-core/framework` root.

## Core Contracts

### Server

```ts
import type { OpenCorePlugin } from '@open-core/framework/server'

const serverPlugin: OpenCorePlugin = {
  name: 'example-server-plugin',
  install(ctx) {
    // ctx.server, ctx.di, ctx.config
  },
}
```

### Client

```ts
import type { OpenCoreClientPlugin } from '@open-core/framework/client'

const clientPlugin: OpenCoreClientPlugin = {
  name: 'example-client-plugin',
  install(ctx) {
    // ctx.client, ctx.di, ctx.config
  },
}
```

## Installation Lifecycle

### Server

```ts
import * as Server from '@open-core/framework/server'

await init({
  mode: 'CORE',
  plugins: [serverPlugin],
})
```

### Client

```ts
import * as Client from '@open-core/framework/client'

await init({
  mode: 'CORE',
  plugins: [clientPlugin],
})
```

Plugins are installed before full runtime bootstrap, so decorators and services can rely on plugin-provided extensions.

## Extending `Server` and `Client` API

Use `registerApiExtension` to attach runtime features directly to the namespace object.

```ts
ctx.server.registerApiExtension('NPC', NPCDecorator)
ctx.client.registerApiExtension('Widget', WidgetFactory)
```

Runtime usage is flat:

- `NPC(...)`
- `Widget(...)`

Not nested usage like `ServerPluginApi.NPC(...)`.

## Type-Safe Module Augmentation

### Server augmentation

```ts
declare module '@open-core/framework/server' {
  interface ServerPluginApi {
    NPC: (name: string) => void
  }
}
```

### Client augmentation

```ts
declare module '@open-core/framework/client' {
  interface ClientPluginApi {
    Widget: (id: string) => void
  }
}
```

## Safety Guarantees

`registerApiExtension` enforces:

- non-empty extension keys,
- reserved key protection,
- duplicate key protection,
- no overwrite of existing API members.

These checks prevent plugin collisions and accidental runtime overrides.

## Plugin API vs Library API

- Use **Plugin API** for boot-time wiring and runtime extension.
- Use **Library API** for domain events and runtime communication contracts.

Most production libraries combine both: plugin install for setup, library events for domain flow.
