---
title: Controllers and Skills
---

Use controllers to define behavior boundaries and skills to execute behavior steps.

## Controller

```ts
import {
  NpcIntelligentController,
  GoToCarDriveParkSkill,
  MoveToSkill,
  WaitSkill,
} from '@open-core/npc-agents/server'

@NpcIntelligentController({
  id: 'driver-controller',
  planner: 'ai',
  skills: [GoToCarDriveParkSkill, MoveToSkill, WaitSkill],
  tickMs: 500,
})
export class DriverController {}
```

## Skill Keys

Skill keys are derived from class names:

- `MoveToSkill` -> `moveTo`
- `GoToCarDriveParkSkill` -> `goToCarDrivePark`

You can resolve keys with `skillKey(SkillClass)` when needed.

## Custom Skill

```ts
import { NpcSkill } from '@open-core/npc-agents/server'
import type {
  NpcContext,
  SkillResult,
  NpcSkill as NpcSkillContract,
} from '@open-core/npc-agents/server'

type Args = { x: number; y: number; z: number }

@NpcSkill()
export class MoveToPointSkill implements NpcSkillContract<Args> {
  execute(ctx: NpcContext, args: Args): SkillResult {
    ctx.npc.setPosition(args)
    return { ok: true }
  }
}
```

## Runtime Hooks and Events

```ts
import {
  OnNpcHook,
  OnNpcEvent,
  type NpcContext,
} from '@open-core/npc-agents/server'

export class DriverObservability {
  @OnNpcHook('skillError')
  onSkillError(ctx: NpcContext, info: { skill?: string; error?: string }) {
    console.warn('controller', ctx.goal.id)
    console.warn('skillError', info.skill, info.error)
  }

  @OnNpcEvent('npc:state')
  onNpcState(_ctx: NpcContext, event: { npcId: string; payload: { state?: string } }) {
    console.log('npc state', event.npcId, event.payload.state)
  }
}
```

## Rule Builder (Deterministic)

```ts
await npcInt
  .rule('driver-controller')
  .for(npc)
  .name('Valentine Driver')
  .npcType('driver')
  .do(GoToCarDriveParkSkill, {
    vehicleNetId: 120,
    dest: { x: 120, y: -760, z: 26 },
  })
  .run()
```

## AI Builder (Context First)

```ts
await npcInt
  .ai('driver-controller')
  .for(npc)
  .name('Courier #4')
  .npcType('courier')
  .goal('deliver-order', 'arrive quickly but safely')
  .instruction('Use the assigned vehicle and park near the target')
  .facts({
    assignedVehicleNetId: 120,
    urgency: 'high',
  })
  .deny(WaitSkill)
  .run()
```
