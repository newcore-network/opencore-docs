---
title: Connected Mode
---

Connected mode delegates selected skill execution from server to client.

Use it for skills that depend on streamed entities or client-native task calls.

## Enable on Server

```ts
import { Server } from '@open-core/framework/server'
import { npcIntelligencePlugin } from '@open-core/npc-agents/server'

await Server.init({
  mode: 'CORE',
  plugins: [
    npcIntelligencePlugin({
      openRouter: {
        model: 'openai/gpt-4o-mini',
      },
    }),
  ],
})
```

## Enable on Client

```ts
import { Client } from '@open-core/framework/client'
import { npcClient } from '@open-core/npc-agents/client'

await Client.init({
  mode: 'CORE',
  plugins: [npcClient()],
})
```

## Transport Behavior

- Primary path: net wire transport
- Fallback path: RPC caller when available

This is automatic when connected runtime pieces are installed.

## Debug

Enable transport debug:

```cfg
setr OPENCORE_NPC_TRANSPORT_DEBUG 1
```

Useful log families:

- `DELEGATE_SEND`, `DELEGATE_OK`, `DELEGATE_FAIL`
- `WIRE_SEND`, `WIRE_RESULT`, `WIRE_TIMEOUT`, `WIRE_FAILOVER`

AI debug options on server:

```bash
export NPC_AI_DEBUG=1
export NPC_AI_DEBUG_LLM=1
```

## Common Issues

- `no_executor`: no ready client executor available
- `missing_npc_netid`: NPC has no network id for transport
- `...timeout`: request sent but no client response before timeout

If delegation works but behavior still stalls, validate observation payloads and destination values.
