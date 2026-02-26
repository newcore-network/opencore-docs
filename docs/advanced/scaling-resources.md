---
title: Scaling Resources (CORE ↔ RESOURCE)
---

## Goal

Scale by separating authoritative runtime responsibilities (`CORE`) from feature resources (`RESOURCE`) while keeping one programming model.

## Recommended Topology

- `CORE` resource:
  - player/session authority
  - security providers and observers
  - shared infrastructure APIs (players, authorization, channels)
- `RESOURCE` resources:
  - gameplay modules (jobs, economy, housing, etc.)
  - thin transport handlers + domain services

## How OpenCore Helps

- Ports provide local/remote implementations transparently.
- Same abstractions are used across modes.
- Runtime setup enforces provider requirements in `CORE`.

## Practical Rules

- Keep cross-resource APIs stable and versioned.
- Avoid direct global state coupling between resources.
- Put shared contracts/types in dedicated shared modules.
- Add explicit fallback behavior for temporary CORE unavailability.

## Deployment Checklist

1. Define which resource owns each domain boundary.
2. Keep security and identity in CORE.
3. Load CORE before dependent RESOURCE modules.
4. Validate startup with integration smoke checks.
