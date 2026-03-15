---
title: NPC Agents Overview
---

`@open-core/npc-agents` adds an intelligence layer for NPCs on top of OpenCore entity lifecycle.

Use it when you want behavior orchestration through controllers, skills, and optional AI decisions.

## Install

```bash
pnpm add @open-core/npc-agents
```

## Entry Points

- `@open-core/npc-agents/server`
- `@open-core/npc-agents/client`
- `@open-core/npc-agents/server/advanced`

## Core Concepts

- **Controller**: declares a behavior scope (`@NpcIntelligentController({ id, planner, skills })`)
- **Skill**: executable unit (`@NpcSkill()` class)
- **Planner**: chooses the next skill (`rule` or `ai`)
- **Runtime API**: `IntelligentNpcAPI` to spawn, attach, observe, and run

## Rule vs AI

- **Rule**: deterministic execution, you choose exact skill and args.
- **AI**: planner chooses from allowed skills using current goal + observations.
- Both return explicit run results (`ok`, `done`, `skill`, `waitMs`, `error`).

## Built-in Skills

- `IdleSkill`
- `MoveToSkill`
- `MoveRelativeSkill`
- `SetHeadingSkill`
- `WaitSkill`
- `LookAtEntitySkill`
- `GoToCarDriveParkSkill`
