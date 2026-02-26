---
title: State Inspector
---

## Purpose

State Inspector provides visibility into runtime state snapshots for entities and sessions while developing.

Use it to inspect:

- entity metadata and state flags
- routing bucket / dimension assignments
- transient values that affect guard or gameplay behavior

## When To Use

- debugging desync between expected and actual state
- validating state transitions after commands/events
- diagnosing orphaned or stale runtime entries

## Best Practices

- Treat inspection data as development diagnostics.
- Avoid logging sensitive player data in shared environments.
- Verify findings with reproducible test cases.
