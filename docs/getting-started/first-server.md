---
title: First Server
---

## 1. The Entry Point

Create a server-side entry file (for example `server/index.ts`).  
You must initialize the `Server` application **once**, before any gameplay logic runs.

From **v0.3.x onward**, OpenCore follows a **zero-config initialization model**:
- Features are enabled automatically.
- Providers are inferred from the runtime mode.
- No manual feature wiring is required.

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
})
  .then(() => {
    console.log('OpenCore [server] initialized')
  })
  .catch((error: unknown) => {
    console.error(error)
  })
```

Important notes:

* `mode: 'CORE'` indicates that this resource acts as the core runtime.
* There is **no `features` configuration** in v0.3.x.
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
})
  .then(() => {
    console.log('OpenCore [client] initialized')
  })
  .catch((error: unknown) => {
    console.error(error)
  })
```

Server and client runtimes are initialized independently, but follow the same lifecycle rules.

---

## 2. Creating Your First Controller

Controllers are the entry points for your gameplay logic.
They define commands, network events, ticks, and other runtime-bound behavior.

Controllers are discovered automatically **when their files are imported**.

---

### Server controller example

```ts
// src/server/controllers/hello.controller.ts
import { z } from '@open-core/framework'
import { Server } from '@open-core/framework/server'

@Server.Controller()
export class HelloController {

  @Server.Command({
    command: 'hello',
    usage: '/hello [name]',
  }, z.tuple([z.string().optional()]))
  onHelloCommand(player: Server.Player, name?: string) {
    const finalName = name ?? player.name

    console.log(`Hello command received from ${player.name}`)
    player.send(`Welcome, ${finalName}`, 'chat')

    emitNet('bye:event', player.source, 'bye!')
  }
}
```

Key points:

* The first parameter is always `Server.Player`.
* Argument validation happens **before** execution.
* Schema-based validation is optional but recommended.
* Commands are globally registered but executed in the defining resource.

---

### Client controller example

```ts
// src/client/controllers/bye.controller.ts
import { Client } from '@open-core/framework/client'

@Client.Controller()
export class ByeController {

  @Client.OnNet('bye:event')
  handleByeEvent(message: string) {
    console.log(`Server says: ${message}`)
  }
}
```

---

## 3. Controller discovery (IMPORTANT)

Controllers are **not loaded automatically** by the runtime.
You must import them in your entry file so the framework can register their metadata.

```ts
// server/index.ts
import { Server } from '@open-core/framework/server'
import './controllers/hello.controller'

Server.init({
  mode: 'CORE',
})
```

The same rule applies to client controllers.

If a controller file is not imported, it will not be registered.

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
