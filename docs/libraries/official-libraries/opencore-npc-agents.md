---
title: 'NPC Agents'
---

# @open-core/npc-agents

Official OpenCore library for intelligent NPC behavior with rule-based and AI-driven execution.

## Installation

```bash
pnpm add @open-core/npc-agents
```

## Entry Points

- `@open-core/npc-agents/server`
- `@open-core/npc-agents/client`
- `@open-core/npc-agents/server/advanced`

## What You Get

- `npcIntelligencePlugin(...)` for server runtime setup
- `npcClient()` for client runtime setup
- `IntelligentNpcAPI` for spawn/attach/observe/run orchestration
- Decorators: `@NpcIntelligentController`, `@NpcSkill`, `@OnNpcHook`, `@OnNpcEvent`
- Built-in skills like `MoveToSkill`, `WaitSkill`, `LookAtEntitySkill`, `GoToCarDriveParkSkill`

## Quick AI Setup (OpenRouter)

```bash
export OPENROUTER_API_KEY=your_key_here
```

```ts
import { Server } from '@open-core/framework/server'
import { npcIntelligencePlugin } from '@open-core/npc-agents/server'

await Server.init({
  mode: 'CORE',
  plugins: [
    npcIntelligencePlugin({
      openRouter: {
        model: 'openai/gpt-4o-mini',
        temperature: 0.2,
        maxTokens: 220,
      },
    }),
  ],
})
```

## Guides

- [NPC Agents Overview](/docs/npc-agents/overview)
- [Getting Started](/docs/npc-agents/getting-started)
- [Controllers and Skills](/docs/npc-agents/controllers-and-skills)
- [Connected Mode](/docs/npc-agents/connected-mode)
