---
title: Type Generation
---

Type generation (typegen) types the names and payloads that cross a boundary: net events, RPCs, commands, library events and WebView messages. The handlers you already write are the source of truth: the CLI reads them and generates the types that every emitting site is checked against, so there is no event catalogue to maintain by hand.

It runs as part of `opencore build` and `opencore dev`, and is enabled by default.

## How it works

For every resource, the CLI:

1. Reads its source files with the project's own TypeScript (5.x or 7.x).
2. Collects the handler decorators (`@OnNet`, `@OnRPC`, `@Command`, `@OnLibraryEvent`, `@OnView`) and the `WebView.send()` and `library.emit()` calls.
3. Writes `.opencore/opencore.gen.ts`, which registers those names and payloads with the framework.

A resource with a WebView also gets a `<view>/.opencore/opencore.gen.ts` for the UI code.

Generated files contain only types, so they never change runtime behavior. They are build output: the starter project's `.gitignore` already excludes `.opencore/`.

## What gets typed

| Source | Types |
|---|---|
| `@Server.OnNet` | `events.emit()` on the client |
| `@Client.OnNet` | `player.emit()` and `events.emit()` on the server |
| `@Server.OnRPC` / `@Client.OnRPC` | `rpc.call()` and `rpc.notify()` arguments, and the `call()` result |
| `@Server.Command` | the command map, with `description` and `usage` |
| `@Server.OnLibraryEvent` / `@Client.OnLibraryEvent` | `on()`, `once()`, `off()` and `emit()` of that library |
| `library.emit()` | library events that no handler listens to |
| `@Client.OnView` / `WebView.send()` | messages between the client and its WebViews |

A name declared in one resource is known to all of them.

## Using the generated types

No import is needed. Given this handler:

```typescript
@Controller()
export class BankController {
  @OnNet('bank:deposit')
  deposit(player: Player, amount: number) {}

  @OnRPC('bank:getBalance')
  getBalance(player: Player): number {
    return 0
  }
}
```

the emitting sites on the client are checked against it:

```typescript
events.emit('bank:deposit', 500) // ✓
events.emit('bank:deposit', '500') // ✗ amount is a number
events.emit('bank:depost', 500) // ✗ unknown name (strict mode)

const balance = await rpc.call('bank:getBalance') // balance: number
```

The generated types point at the handler signatures, so changing a handler updates its emitting sites right away, before the next build.

### Names

A name can be a string literal or any constant whose type is a string literal:

```typescript
export const BankEvents = {
  deposit: 'bank:deposit',
} as const

@OnNet(BankEvents.deposit) // ✓
```

When a name's type is plain `string`, the handler still works at runtime, but typegen skips it and reports a warning.

## Library events

Create the library with a literal name, so its events can be typed:

```typescript
export const rpLibrary = createServerLibrary('rp')
```

An event takes its payload from the first parameter of its listeners:

```typescript
@OnLibraryEvent('rp', 'character:spawned')
onSpawned(event: CharacterSpawnedEvent) {}
```

```typescript
rpLibrary.emit('character:spawned', { accountId, characterId }) // checked against CharacterSpawnedEvent
```

When several listeners share an event, only one of them defines its type, so declare the payload once and use it in all of them.

An event that no handler listens to is typed from its `emit()` calls: its payload is the union of what they pass.

## WebView messages

`@OnView` handlers type the messages a WebView sends to the client, and `WebView.send()` calls type the messages the client sends to the WebView.

The UI code imports them from the view's `.opencore/opencore.gen.ts`:

| Type | Description |
|---|---|
| `UiCanSend` | Messages the WebView may send to the client |
| `UiReceives` | Messages the client sends to the WebView |

## Strict mode

With `strict: true` (the default), a name that nothing declares is a compile error. The framework's own `opencore:*` events are always accepted.

With `strict: false`, unknown names are accepted, and known ones keep their autocomplete and payload checks. Use it when a project emits names handled outside OpenCore, such as events of a Lua resource.

:::note
A `WebView.send()` or `library.emit()` call declares the name it uses, so a typo there declares a new message instead of failing, even in strict mode.
:::

## Configuration

```typescript
export default defineConfig({
  build: {
    typecheck: true,
    typegen: {
      enabled: true,
      strict: true,
    },
  },
})
```

| Field | Default | Description |
|---|---|---|
| `typegen.enabled` | `true` | Generate the types. When `false`, generated files are deleted and every signature is loose again |
| `typegen.strict` | `true` | Reject names that nothing declares |
| `typecheck` | `false` | Run `tsc --noEmit` before bundling |

Disabling typegen requires no code changes: without generated files, the framework accepts any name and payload, as before.

## Build validation

Bundling only strips types, so a type error alone never fails a build. With `build.typecheck: true`, `opencore build` runs the project's `tsc --noEmit` before bundling and fails when there are errors. `opencore dev` reports them as warnings and keeps watching.

Handlers that cannot be typed never fail the build. They are reported once per resource:

```
typegen: 1 handler(s) in bank could not be typed
  src/server/bank.controller.ts:12 could not resolve the name eventName: its type is `string`, not a string literal; skipped by typegen
```

## IDE support

The generated files must be part of the TypeScript program. Since `**/*` skips dot-directories, the starter project's `tsconfig.json` includes them explicitly:

```json
{
  "include": [
    "**/*",
    "**/.opencore/**/*.ts"
  ]
}
```

The `ui/tsconfig.json` created by `opencore create resource --with-nui` does the same for the view.

Until the first `opencore build` or `opencore dev`, there are no generated files and the editor accepts any name.
