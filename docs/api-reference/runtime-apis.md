---
title: Runtime APIs
---

## Server Runtime API

Import surface:

```ts
import * as ServerApi from '@open-core/framework/server'
```

Key groups:

- Bootstrap/setup: `init`, `setPrincipalProvider`, `setSecurityHandler`, `setPersistenceProvider`, `setNetEventSecurityObserver`, `setCommandErrorObserver`.
- Decorators: `Controller`, `Service`, `Command`, `OnNet`, `OnRPC`, `Guard`, `Throttle`, and related decorators.
- Entities/APIs: `Player`, `NPC`, `Vehicles`, `Npcs`, `Chat`, `Channels`, ports/contracts exports.

## Client Runtime API

Import surface:

```ts
import * as ClientApi from '@open-core/framework/client'
```

Key groups:

- Bootstrap: `init`.
- Decorators: `Controller`, `Service`, `OnNet`, `OnRPC`, `OnView`, `OnTick`, `Interval`, `Key`, `OnResourceStart`, `OnResourceStop`, `OnGameEvent`, `LocalEvent`.
- Services: `WebViewBridge`, `SpawnService`, `NotificationService`, `VehicleClientService`, `VehicleService`, and other client runtime services.

## Import Style

You can consume APIs with direct imports or namespace runtime objects (`Server`, `Client`). Both are supported.

```ts
import { init, Controller, OnNet } from '@open-core/framework/server'
// or
import { Server } from '@open-core/framework/server'
```
