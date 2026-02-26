---
title: RPC API
description: Core request–response communication API in OpenCore.
---

## Overview

The **RPC API** provides a **platform-agnostic request–response communication system**
in OpenCore.

It allows one execution context to invoke logic in another context and optionally
receive a result, with:

- Correlation
- Timeouts
- Structured error handling

All RPC-based communication in OpenCore flows through the **RpcAPI**.

---

## RpcAPI as the Core RPC Layer

The RpcAPI is the **central execution layer** for all RPC interactions.

All RPC decorators, including:

- `@OnRPC`
- `@OnRPC`

ultimately register their handlers into the **RpcAPI** during the bootstrap phase.

This means:

- There is a single RPC dispatch mechanism
- Decorators only declare handlers
- Invocation, correlation, and resolution are handled centrally

> **All RPC calls in OpenCore are executed through the RpcAPI.**

---

## Injection and Usage

The RpcAPI is accessed through **dependency injection**.

It can be injected into services, controllers, or any injectable class.

```ts
import { RpcAPI } from '@open-core/framework'

@Service()
export class UiService {
  constructor(
    private readonly rpc: RpcAPI,
  ) {}

  async confirm(message: string): Promise<boolean> {
    return this.rpc.call('ui:confirm', { message })
  }
}
````

Key properties:

* No platform-specific imports
* Same API on server and client
* Context-aware behavior
* Transport resolved automatically

---

## RPC Interaction Types

The RpcAPI supports two interaction modes:

### Call

A **call** expects a response.

```ts
rpc.call(action, payload?, target?)
```

Characteristics:

* Returns a `Promise<T>`
* Correlated with a unique request id
* Subject to timeout
* Resolves or rejects exactly once

Example:

```ts
const result = await this.rpc.call<number>(
  'player:getHealth',
  undefined,
  playerId
)
```

---

### Notify

A **notify** sends a request **without expecting a response**.

```ts
rpc.notify(action, payload?, target?)
```

Characteristics:

* Fire-and-forget
* No promise
* No timeout
* No result tracking

Example:

```ts
this.rpc.notify('ui:close', null, playerId)
```

---

## Parameters and Payloads

RPC payloads must be JSON-serializable.

```ts
rpc.call('inventory:add', {
  itemId: 'bread',
  amount: 2,
})
```

Validation is handled by the **registered RPC handler**, not by the API itself.

---

## Targets and Context

The RpcAPI is **context-aware**.

### Client Context

* Target is implicit
* Calls are directed to the server
* `target` parameter is ignored

```ts
rpc.call('bank:balance')
```

---

### Server Context

* Target must be explicit or resolvable
* Calls can be directed to:

  * A specific client
  * Multiple clients
  * All clients

```ts
rpc.call('ui:refresh', null, playerId)
rpc.notify('ui:refreshAll')
```

Target resolution is handled internally.

---

## Timeouts

Every RPC call is executed with a timeout.

If the timeout expires:

* The call is rejected
* Pending state is cleaned up
* Late responses are discarded

Timeouts protect the runtime from stalled calls.

---

## Error Handling

Errors can originate from:

* The remote handler throwing
* Validation failures
* Transport failures
* Timeouts

When an error occurs:

* The call promise is rejected
* Structured error information is propagated
* The runtime remains stable

Errors are isolated per call.

---

## Relation to Decorators

Decorators are **declarative registration tools**.

### Conceptual Flow

1. Decorator stores metadata
2. Framework bootstraps the resource
3. RPC handlers are registered into the RpcAPI
4. Incoming calls are dispatched through the same API
5. Responses are correlated and returned

From an execution perspective, there is no distinction between
handlers registered via decorators or other means.

---

## RPC vs Events

| Aspect           | RPC API           | Events API    |
| ---------------- | ----------------- | ------------- |
| Response         | Optional          | None          |
| Correlation      | Yes               | No            |
| Timeout          | Yes               | No            |
| Typical use      | Queries, commands | Notifications |
| Failure handling | Explicit          | Best-effort   |

Use the mechanism that matches your intent.

---

## Design Principles

The RpcAPI is designed around:

* Explicit request–response semantics
* Deterministic behavior
* Clear failure modes
* Strong isolation between calls

This avoids ambiguity and hidden side effects.

---

## Summary

The RpcAPI provides:

* A unified RPC execution layer
* Platform-agnostic invocation
* Call and notify semantics
* Built-in timeout and error handling

It is the **foundation of all RPC communication** in OpenCore.