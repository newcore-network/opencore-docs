---
title: Session Recovery
---

## What It Solves

After resource restarts, players may remain connected while in-memory session maps are reset. Session recovery reconstructs missing runtime sessions safely.

## Recovery Flow

`SessionRecoveryService` performs:

1. read connected player sources from runtime
2. check which players already have an active session
3. recreate missing sessions via lifecycle port binding
4. emit internal recovery event for downstream hooks

## Current Behavior

- Recovers basic identity/session structure.
- Does not magically restore every domain state.
- Designed for runtime continuity during restarts and development reloads.

## Operational Guidance

- Run recovery at startup for CORE resources.
- Keep persistence and auth flows idempotent.
- Treat recovered sessions as rehydrated runtime state, not full domain replay.

## Observability

Track at least:

- total connected players
- recovered session count
- already-existing session count
- recovery errors/warnings
