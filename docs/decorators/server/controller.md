---
title: Controller
---
## Description

`@Server.Controller()` is a class decorator used to declare a class as a server-side controller.
A server controller represents a logical entry point in the server layer. It groups commands, events, and handlers that react to player actions or engine events.

When applied, the decorator enables dependency injection, attaches controller metadata, and automatically registers the class under the current FiveM resource. This allows the framework to discover and initialize controllers without manual configuration.

The controllers operate in resources, core, and standalones; they are the main component of the framework.

**!! Controllers should always be imported in the project's index/main/init !!**

## Arguments
This decorator does not accept any arguments.

## Example

```ts
import { Server } from '@open-core/framework/server'
import { PlayerDirectoryPort } from '../services/player.service'

@Server.Controller()
export class PlayerController {
  constructor(
    private readonly playerDirectory: PlayerDirectoryPort
  ) {}

  // Commands, event handlers and all will be defined here
}
```
- In this example, PlayerController is marked as a server controller.
- The constructor dependency `PlayerDirectoryPort` is injected automatically through the DI container.
- The controller is registered under the current resource and will be discovered during server startup.

Now you import it into the entry point (index server)
```ts
import { Server } from '@open-core/framework/server'

// Controllers
import './controllers/player.controller'

Server.init({
    mode: 'CORE',
    //...
    })

```


## Notes
- The decorator only registers and describes the class; it does not instantiate it.
- Controllers are scoped to the current FiveM resource.
- The class is automatically marked as injectable using tsyringe.
- This decorator is intended for server-side usage only.