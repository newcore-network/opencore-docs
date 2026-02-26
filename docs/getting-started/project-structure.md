---
title: Project Structure
---

## Recommended Layout

Use a clear separation between entrypoints, controllers, services, and domain modules.

```text
resources/
  my-core/
    server/
      index.ts
      controllers/
      services/
      modules/
      providers/
    client/
      index.ts
      controllers/
      services/
    shared/
      types/
      schemas/
```

## Guidelines

- Keep framework entry files small (`server/index.ts`, `client/index.ts`).
- Group gameplay by domain (`banking`, `inventory`, `garage`) not by transport.
- Put Zod schemas near handlers or in `shared/schemas`.
- Store provider implementations in a dedicated `providers/` folder.

## Server Entrypoint Pattern

```ts
import { init, setPrincipalProvider } from '@open-core/framework/server'
import './controllers'

setPrincipalProvider(MyPrincipalProvider)

await init({ mode: 'CORE' })
```
