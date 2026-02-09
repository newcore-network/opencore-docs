---
title: First project
---

## 1. The Entry Point

Create a server-side and client-side entry file (for example `server/index.ts`, `client/index.ts`).  
You must initialize the `Server` and `Client` application **once**, before any gameplay logic runs.

OpenCore follows a **zero-config initialization model**:
- Features are enabled automatically.
- Providers are inferred from the runtime mode.
- No manual feature wiring is required.
- Automatic controllers discovery and auto import.

---

### Server initialization

```ts
// server/index.ts
import { Server } from '@open-core/framework/server'

// Initialize the server runtime
Server.init({
  mode: 'CORE',
  devMode: {
    enabled: true,
  },
}).then(() => {
    console.log('OpenCore [server] initialized')
}).catch((error: unknown) => {
    console.error(error)
})
```

Important notes:

* `mode: 'CORE'` indicates that this resource acts as the core runtime.
* There is **no `features` configuration**. Only disable options if you want.
* Initialization automatically emits the internal `core:ready` lifecycle event once bootstrapping is complete.

You **do not need to emit or handle `core:ready` manually** in most cases.

---

### Client initialization

Client initialization follows the same model:

```ts
// client/index.ts
import { Client } from '@open-core/framework/client'

Client.init({
  mode: 'CORE',
}).then(() => {
    console.log('OpenCore [client] initialized')
}).catch((error: unknown) => {
    console.error(error)
})
```

Server and client runtimes are initialized independently, but follow the **same lifecycle rules**.

---

## 2. Creating Your First Controller

Controllers are the entry points for your gameplay logic.
They define commands, network events, ticks, and other runtime-bound behavior.

Controllers are discovered automatically, **You don't need to import them manually**, as each driver is discovered and imported automatically at compile time.

---

### Server controller example

```ts
// src/server/controllers/hello.controller.ts
import { z, EventsAPI } from '@open-core/framework'
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class HelloController {
  constructor(private readonly events: EventsAPI<'server'>) {}

  @Server.Public()
  @Server.Command({
    command: 'hello',
    usage: '/hello [name]',
    schema: z.tuple([z.string().optional()]),
  })
  onHelloCommand(player: Server.Player, name?: string): void {
    player.send(`Welcome ${name ?? player.name}`, 'chat')

    emitNet('bye:event', player.id, 'Bye from server 👋')
  }

  @Server.Guard({
    permission: 'use-random-event',
    rank: 5,
  })
  @Server.OnNet('random-event')
  onRandomEvent(player: Server.Player, text: string): void {
    this.events.emit('data', player, text)
  }

  @Server.Throttle(2, 2000)
  @Server.OnRPC('rpc-event')
  async onRpcEvent(player: Server.Player): Promise<string> {
    return `Yes ${player.name}, I'm here`
  }

  @Server.OnFrameworkEvent('internal:playerFullyConnected')
  onPlayerConnected(payload: Server.PlayerFullyConnectedPayload): void {
    payload.player.spawn({ x: -1257, y: -2704, z: 56 })
  }

  @Server.OnRuntimeEvent('entityCreated')
  handleRuntime(handle: number): void {
    //...
  }
}
```

Key points:

* The first parameter is always `Server.Player` for commands and network listeners.
* Argument validation happens **before** execution.
* Schema-based validation is optional but recommended.
* Commands are globally registered but executed in the defining resource. You can create commands on any resource, the core will perform the security check and delegate its functionality to the responsible resource.

Read more about commands at [](../api-reference/server-decorators.md)

---

### Client controller example

```ts
// src/client/controllers/bye.controller.ts
import { Client } from '@open-core/framework/client'
import { EventsAPI } from '@open-core/framework'
import { ByeViewPayload } from './bye.types'

@Client.Controller()
export class ByeController {
  constructor(
    private readonly nui: Client.NuiBridge,
    private readonly events: EventsAPI<'client'>,
  ) {}

  @Client.OnNet('bye:event')
  handleByeEvent(message: string): void {
    console.log('Server says:', message)

    this.nui.send('bye:show', { message })
  }

  @Client.OnView('bye:confirm')
  handleByeFromView(payload: ByeViewPayload): void {
    console.log('Bye confirmed:', payload.reason)

    // Forward to server (platform-agnostic)
    this.events.emit('random-event', payload.reason)
  }

  @Client.Key('f5', 'optional')
  toggleByeView(): void {
    this.nui.toggle(true)
  }

  @Client.OnGameEvent('CEventExplosionHeard')
  handleExplosion(): void {
    console.log('Explosion heard')
  }

  @Client.Interval(5000)
  handleInterval(): void {
    // periodic logic
  }
}
```

---

## 3. Controller discovery

From v1.x onwards, drivers are automatically discovered unless you explicitly disable this option, the OpenCore compiler will automatically generate the auto-import barrels that the framework will use.

The same rule applies to client controllers.

---

## 4. Lifecycle and `core:ready`

During initialization, OpenCore emits an internal lifecycle event once the runtime is fully ready.

* `core:ready` is emitted automatically.
* Controllers and decorators are already registered at this point.
* Most applications do **not** need to listen to this event manually.

You should only rely on `core:ready` if:

* You are integrating with low-level runtime systems
* You are bridging OpenCore with external frameworks or resources

For normal gameplay logic, decorators handle lifecycle timing for you.

---

## 5. Building & Running

OpenCore uses TypeScript and must be compiled before running in FiveM.

The recommended approach is using the OpenCore CLI, which provides:

* Parallel builds
* Runtime-aware bundling
* ESBuild + SWC under the hood

```bash
opencore build
```

You may also:

* Use your own build scripts
* Define a custom compiler per resource using `compilerCustom`

See the CLI documentation for details:
[Read more](../cli/commands.md)

---

This setup reflects the **v0.3.x execution model**:

* Zero configuration
* Explicit imports
* Clear runtime boundaries
* Automatic lifecycle handling
