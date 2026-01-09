---
title: Development Mode
---

## Overview

:::warning UNDER TESTING
Development Mode is currently in an experimental phase. It may be unstable, contain bugs, or produce unexpected errors. Use it with caution in development and **never** in production.
:::

OpenCore includes a robust **Dev Mode** designed to accelerate the development cycle. This mode enables inspection tools, hot reloading, and simulators that are not present in production.

## Configuration

Development mode is configured directly during server initialization via `Server.init()`.

```ts
Server.init({
  mode: 'CORE',
  devMode: {
    enabled: true,
    hotReload: {
      enabled: true,
      port: 3000,
      allowedResources: ['my-resource']
    },
    bridge: {
      url: 'ws://localhost:8080',
      autoConnect: true
    },
    interceptor: {
      enabled: true,
      recordHistory: true,
      maxHistorySize: 1000
    },
    simulator: {
      enabled: true,
      autoConnectPlayers: 2
    }
  }
});
```

### Key Features

1.  **Hot Reload**: Automatically reloads modified modules without restarting the entire resource.
    - `port`: The port for the hot reload WebSocket server.
    - `allowedResources`: Optional whitelist of resources to watch.
2.  **CLI Bridge**: Connects the framework to the OpenCore CLI for advanced orchestration.
    - `url`: WebSocket URL of the CLI bridge.
3.  **Event Interceptor**: Captures and logs all network events and executed commands.
    - `recordHistory`: Whether to keep a log of previous events.
    - `maxHistorySize`: Limits the number of stored events to prevent memory bloat.
4.  **Player Simulator**: Allows simulating player connections and network actions for local testing.
    - `autoConnectPlayers`: Number of dummy players to spawn automatically on startup.

## CLI Integration

The OpenCore CLI is the primary tool for managing development mode. it allows launching the server with active watchers that notify the framework of file changes.

## Auto-Hosted Mode

:::caution ALPHA FEATURE
**Auto-Hosted** mode is currently in **Alpha**. 
:::

It is not recommended for production environments or critical development stages. For now, we recommend using the **standard Dev Mode** managed directly by the framework and the official CLI.

## Best Practices
- **Never** enable `devMode` on production servers, as it exposes inspection tools and consumes additional resources.
- Use the player simulator to quickly test group logic or permissions.
