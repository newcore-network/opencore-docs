# OpenCore Docs

Official documentation for the OpenCore ecosystem, built with [Docusaurus](https://docusaurus.io/).

## Prerequisites

- **Node.js**: v20.0 or higher.
- **pnpm**: Recommended for dependency management.

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
pnpm build
```

Generates static content into the `build/` directory which can be served by any static hosting service.

## Other Commands

- `pnpm serve`: Locally serve the production build generated in `build/`.
- `pnpm typecheck`: Run TypeScript type checking.
- `pnpm clear`: Clear the Docusaurus cache.

## Deployment

Deployment can be performed by configuring the `deploy` script in the corresponding environment.

```bash
pnpm deploy
```
