## What is a Decorator?

A TypeScript decorator is a special kind of function that can attach behavior or metadata to classes, methods, properties, accessors, or parameters. Conceptually, it is similar to “annotations” in languages like Java or “attributes” in C#. It does not change TypeScript’s type system; it runs at runtime (JavaScript execution time), not during type checking.

In practical terms, a decorator is a function that receives information about the thing it decorates (for example, a class or method) and can modify it or store metadata about it. To enable them, experimentalDecorators must be true in tsconfig.json.

OpenCore uses TypeScript decorators to declare **runtime behavior** in a way that is:

- explicit
- discoverable
- testable
- hard to misuse

## 1. What is a decorator in OpenCore?

Decorators are the primary “wiring language” of the framework. In OpenCore, a decorator is a declaration that attaches meaning to code.

Examples:
- “this class is a controller” (`@Server.Controller()`)
- “this method handles a net event” (`@Server.OnNet('event:name')`)
- “this method is a command” (`@Server.Command({ ... })`)

The important point:

- decorators describe **intent**
- the framework turns that intent into runtime bindings during bootstrap

## 2. What problem do decorators solve?

Without decorators, most FiveM codebases drift into:

- hidden globals
- ad-hoc event registration scattered across files
- implicit lifecycle assumptions
- duplicated validation/security

OpenCore decorators solve this by:

- making entry points explicit (controllers)
- centralizing binding/registration into the bootstrap phase
- making security and validation declarative

## 3. When do decorators execute?

There are two distinct moments:

### 3.1 Decorator evaluation (module load time)

Decorators execute when the module is evaluated (imported).

If a module is never imported:

- its decorators never run
- the framework cannot discover it

### 3.2 Framework binding (bootstrap scan)

Even after decorators have stored metadata, the framework becomes “live” only after bootstrap scanning.

Reference:

- see `docs/lifecycle.md` (section: “Decorator binding moment”).

## 4. Guarantees (what decorators give you)

Decorators provide a stable contract:

- **Consistent entry points**
  - handlers receive a `Server.Player` context where required
- **Centralized validation and security**
  - schemas and security decorators run before your logic
- **Explicit runtime wiring**
  - you can reason about behavior by reading the controller class

## 5. Non-guarantees (what decorators do NOT do)

Decorators do not guarantee:

- that your controller is imported
- that your handler will run before bootstrap scan completes
- that payloads are safe unless you declare a schema or rely on the built-in pipelines
- that gameplay invariants are enforced (that is your domain responsibility or domain libraries)


## 6. Practical mental model

Think of decorators as:

- “configuration attached to code”

And the bootstrap as:

- “the compiler that turns that configuration into live runtime bindings”.

If you remember only one rule:

- **If a controller is not imported before bootstrap scanning, it does not exist for the framework.**


## 7. Decorators List

### Class Decorators
| Name | Description |
| -------- | ------- |
| [@Server.Controller()](./server/controller.md) | Marks a server-side class as a Controller. Controllers are entry points for gameplay logic and can handle commands, events, and framework callbacks. The class is automatically registered and instantiated by the framework. |
| [@Client.Controller()](./client/controller.md) | Same concept as @Server.Controller, but for the client-side. Used to handle UI interactions, player input, client events, and client-only logic. |
| [@Server.Bind()](./server/bind.md) | Registers a class as injectable in the dependency container. By default, it is treated as a singleton. Useful for shared utilities, managers, adapters, or low-level services that are not Controllers. |
| [@Server.Service()](./server/service.md) | Semantic alias for @Server.Bind(). Indicates that the class contains domain or business logic. Improves readability and architectural clarity. |
| [@Server.Repo()](./server/repo.md) | Semantic alias for @Server.Bind(). Intended for data access and persistence layers (repositories, stores, database adapters). Helps enforce a clean separation of concerns. |
### Method Decorators
| Name | Description |
| -------- | ------- |
| [@Server.Command()](./server/command.md) | Registers the method as a chat/console command handler. The method is executed when the command is invoked by a player. Supports argument parsing and validation. |
| [@Server.OnNet()](./server/on-net.md) | Subscribes the method to a network event (onNet). Used for client → server or server → client communication via FiveM networking. |
| [@Server.OnTick()](./server/on-tick.md) | Executes the method on every server tick. Intended for lightweight, high-frequency logic. Heavy operations should be avoided to prevent performance issues. |
| [@Server.OnFrameworkEvent()](./server/on-framework-event.md) | Listens to internal framework events. Useful for reacting to lifecycle hooks, module events, or cross-system communication inside the framework. |
| [@Server.OnRuntimeEvent()](./server/on-runtime-event.md) | Subscribes the method to a native FiveM event (e.g. playerJoining, playerDropped). Acts as a clean abstraction over on() for FiveM events. |
| [@Server.RequiresState()](./server/requires-state.md) | Ensures the player is in a specific state before executing the method. If the requirement is not met, the method is skipped or rejected. Commonly used for gameplay state validation (logged in, spawned, etc.). |
| [@Server.Throttle()](./server/throttle.md) | Applies rate limiting to the method. Prevents spam or abuse by limiting how frequently the method can be executed per player or context. |
| [@Server.Export()](./server/export.md) | Exposes the method as a FiveM export, making it callable from other resources. Useful for inter-resource APIs and modular architectures. |
| [@Server.Guard()](./server/guard.md) | Applies access control rules to the method. Can enforce permissions, roles, ranks, or custom authorization logic before execution. |
| [@Server.Public()](./server/public.md) | Marks the method as explicitly public and callable without restrictions. Useful for APIs that should bypass guards or internal access checks. |
| [@Client.OnNet()](./client/on-net.md) | Subscribes the method to a network event (onNet) on the client. Typically used for server → client communication and synchronized gameplay events. |
| [@Client.LocalEvent()](./client/local-event.md) | Subscribes the method to a local (client-only) event. Useful for internal communication between client systems without involving networking. |
| [@Client.GameEvent()](./client/game-event.md) | Listens to a GTA V game-native event (gameEventTriggered). Allows reacting to low-level engine events such as damage, explosions, or entity interactions. |
| [@Client.OnTick()](./client/on-tick.md) | Executes the method on every client tick. Intended for lightweight, frame-based logic. Heavy computations should be avoided to prevent FPS drops. |
| [@Client.Interval()](./client/interval.md) | Executes the method at a fixed time interval (in milliseconds). Useful for periodic logic that does not need to run every tick (polling, checks, UI sync). |
| [@Client.Key()](./client/key.md) | Binds the method to a keyboard key press. Executes when the specified key is pressed by the player. Ideal for gameplay shortcuts or UI interactions. |
| [@Client.OnView()](./client/on-view.md) | Registers the method as a NUI callback handler. Executed when the UI (HTML/JS) sends a message to the client script. Acts as the bridge between UI and gameplay logic. |
| [@Client.Export()](./client/export.md) | Exposes the method as a FiveM client export, allowing other resources to call it directly. Useful for inter-resource client APIs. |
| [@Client.ResourceLifecycle()](./client/on-resource-start.md) | Subscribes the method to resource lifecycle events (start, stop, restart). Useful for initialization and cleanup logic on the client side. |

## Design Notes (Client Side)

- Client Controllers are event-driven, not request-driven.
- Prefer Interval over OnTick when possible to reduce CPU usage.
- LocalEvent is the recommended way to communicate between client systems.
- GameEvent is powerful but low-level—use it only when FiveM-native events are insufficient.
- NUI communication is explicit and isolated through @Client.Nui().
- This keeps the client runtime predictable, performant, and clean, even as UI and gameplay complexity grow.