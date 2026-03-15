---
title: NPC Agents Getting Started
---

This is the minimum setup for `@open-core/npc-agents` with server + client plugins.

## 1) Install

```bash
pnpm add @open-core/npc-agents
```

## 2) Server Setup

```ts
import { Server } from '@open-core/framework/server'
import { npcIntelligencePlugin } from '@open-core/npc-agents/server'

await Server.init({
  mode: 'CORE',
  plugins: [npcIntelligencePlugin()],
})
```

## 3) Client Setup

```ts
import { Client } from '@open-core/framework/client'
import { npcClient } from '@open-core/npc-agents/client'

await Client.init({
  mode: 'CORE',
  plugins: [npcClient()],
})
```

## 4) Create a Controller

```ts
import {
  NpcIntelligentController,
  MoveToSkill,
  WaitSkill,
} from '@open-core/npc-agents/server'

@NpcIntelligentController({
  id: 'patrol-controller',
  planner: 'rule',
  skills: [MoveToSkill, WaitSkill],
  tickMs: 500,
})
export class PatrolController {}
```

## 5) Spawn and Run (Rule)

```ts
import {
  IntelligentNpcAPI,
  NpcIntelligentController,
  MoveToSkill,
  WaitSkill,
} from '@open-core/npc-agents/server'

@NpcIntelligentController({
  id: 'patrol-controller',
  planner: 'rule',
  skills: [MoveToSkill, WaitSkill],
})
export class PatrolController {
  constructor(private readonly npcInt: IntelligentNpcAPI) {}

  async runPatrol() {
    const npc = await this.npcInt.spawn({
      model: 's_m_y_cop_01',
      position: { x: 0, y: 0, z: 72 },
      networked: true,
    })

    await this.npcInt
      .rule('patrol-controller')
      .for(npc)
      .name('Guard Alpha')
      .npcType('guard')
      .do(MoveToSkill, { x: 15, y: -40, z: 72 })
      .do(WaitSkill, { ms: 2000 })
      .runAll()
  }
}
```

## 6) AI Setup with OpenRouter

Set your API key:

```bash
export OPENROUTER_API_KEY=your_key_here
```

Configure plugin + AI controller:

```ts
import { Server } from '@open-core/framework/server'
import {
  npcIntelligencePlugin,
  NpcIntelligentController,
  GoToCarDriveParkSkill,
  MoveToSkill,
  WaitSkill,
} from '@open-core/npc-agents/server'

await Server.init({
  mode: 'CORE',
  plugins: [
    npcIntelligencePlugin({
      openRouter: {
        model: 'openai/gpt-4o-mini',
        temperature: 0.2,
        maxTokens: 220,
      },
      debug: {
        enabled: process.env.NPC_AI_DEBUG === '1',
        runtime: true,
        llm: process.env.NPC_AI_DEBUG_LLM === '1',
      },
    }),
  ],
})

@NpcIntelligentController({
  id: 'ai-driver',
  planner: 'ai',
  skills: [GoToCarDriveParkSkill, MoveToSkill, WaitSkill],
  ai: {
    model: 'openai/gpt-4o-mini',
    temperature: 0.25,
    perSkill: {
      goToCarDrivePark: {
        model: 'openai/gpt-4o',
        temperature: 0.1,
      },
    },
  },
})
export class AiDriverController {}
```

Run one AI decision:

```ts
await npcInt
  .ai('ai-driver')
  .for(npc)
  .name('Courier #4')
  .npcType('courier')
  .goal('deliver-order', 'arrive quickly but safely')
  .instruction('Take vehicle 120 and park near the player')
  .deny(WaitSkill)
  .run()
```
