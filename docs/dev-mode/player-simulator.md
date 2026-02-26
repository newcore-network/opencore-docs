---
title: Player Simulator
---

## Purpose

Player Simulator helps test gameplay flows without requiring multiple real clients.

It is useful for:

- command flow validation
- permission/guard behavior checks
- event pipeline smoke tests

## Scenarios

- simulate join/leave lifecycle
- execute commands with controlled identities
- test role/rank-dependent handlers

## Guidelines

- Use simulator for fast local iterations.
- Still validate critical flows with real clients before release.
- Pair with Session Recovery and State Inspector for end-to-end diagnostics.
