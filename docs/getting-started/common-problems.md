---
title: Common Problems
---

## `import type { Player }` breaks decorator handlers

One common source of confusing runtime bugs is auto-fixes from Biome, ESLint, or IDEs that rewrite this:

```ts
import { Command, Controller, Player } from '@open-core/framework/server'
```

into this:

```ts
import { Command, Controller, type Player } from '@open-core/framework/server'
```

or:

```ts
import type { Player } from '@open-core/framework/server'
```

This is **not safe** for OpenCore handler signatures when the imported symbol is a runtime-backed class.

## Why this fails

`import type` is a TypeScript-only construct. It is erased from the emitted JavaScript output.

OpenCore decorators such as `@Command()` and server-side `@OnNet()` rely on runtime metadata emitted for decorated methods. For parameters like `Player`, the runtime needs the actual class value to exist when TypeScript emits `design:paramtypes` metadata.

If `Player` is imported with `import type`, the class value does not exist in the build output. That can cause metadata to degrade or point to a non-usable fallback value, which breaks the framework's ability to understand the handler signature correctly.

## Affected cases

This is especially important for handler signatures that expect framework runtime objects, for example:

```ts
@Command('heal')
heal(player: Player) {}

@OnNet('bank:deposit')
deposit(player: Player, amount: number) {}
```

The same rule applies to other complex runtime-backed classes and values that must exist at runtime, not only `Player`.

Examples include framework entities, rich payload classes, and any value used by decorator-driven metadata that depends on a real JavaScript constructor.

## Safe rule

Use normal value imports for runtime-backed framework classes in decorated signatures:

```ts
import { Command, Controller, OnNet, Player } from '@open-core/framework/server'
```

Only use `import type` for symbols that are truly type-only and are not needed at runtime.

## Recommendation

If your formatter or linter keeps applying this rewrite automatically:

- disable the auto-fix for that import
- keep `Player` as a normal import
- review similar fixes on other complex framework classes before accepting them

When in doubt, prefer a normal import in decorator-based handler signatures.
