---
title: Overview
description: Remote Procedure Calls between server and client in OpenCore.
---

## Overview

The RPC system in OpenCore provides a **structured request–response communication model**
between **server and client**.

RPC is used when one side needs to:

- Invoke logic on the other side
- Receive a response
- Handle errors deterministically
- Apply timeouts and correlation

Unlike network events, RPC calls are **directional, correlated, and explicit**.

---

## What RPC Is (and Is Not)

RPC in OpenCore is:

- A request–response mechanism
- Asynchronous and promise-based
- Built on top of FiveM network events
- Explicit about targets and direction

RPC is **not**:

- A broadcast system
- A fire-and-forget mechanism
- A streaming protocol
- A replacement for authoritative server logic

If you need a value back, use RPC.  
If you only need to notify, use network events.

---

## Communication Direction

RPC is **bidirectional**, but the meaning of direction depends on context.

### Server Context

From the server, RPC is typically used to:

- Call logic on a specific client
- Call logic on multiple clients (fan-out)
- Notify clients without waiting for a result

### Client Context

From the client, RPC is typically used to:

- Call authoritative server logic
- Request validation or data
- Trigger server-side actions

The framework automatically resolves context (`server` vs `client`) at runtime.

---

## Core Concepts

### Call vs Notify

RPC supports two interaction types:

#### Call

- Expects a response
- Returns a `Promise<T>`
- Uses request–response correlation
- Subject to timeout

#### Notify

- Does not expect a response
- Fire-and-forget
- No promise resolution
- No timeout tracking

Both use the same transport layer.

---

### Targets

RPC calls can be targeted.

On the **server**:

- A specific player
- Multiple players
- All players

On the **client**:

- The server (implicit)

Target resolution is handled by the transport adapter.

---

## Message Flow (High-Level)

1. Caller sends an RPC request
2. Request is assigned a unique `id`
3. Target receives the request
4. Registered handler executes
5. Response (or error) is sent back
6. Pending promise is resolved or rejected

This flow is enforced by the framework.

---

## Error Model

RPC errors are explicit.

Errors can originate from:

- The handler throwing
- Validation failures
- Timeouts
- Transport-level issues

When an error occurs:

- The response is marked as failed
- The promise is rejected
- The caller receives structured error information

Errors never crash the runtime.

---

## Timeouts

Every RPC call is executed with a timeout.

If no response is received:

- The call fails
- The pending promise is rejected
- The handler result is discarded if it arrives late

Timeouts prevent:

- Stalled gameplay logic
- Memory leaks
- Zombie promises

---

## RPC vs Network Events

| Aspect | RPC | Network Events |
|-----|-----|----------------|
| Response | Required (call) | None |
| Correlation | Yes | No |
| Timeout | Yes | No |
| Direction | Explicit | Broadcast-like |
| Use case | Queries, actions | Notifications |

A common rule:

> If you expect a result, use RPC.  
> If you expect a reaction, use events.

---

## Relation to Decorators

This overview describes the **transport and execution model**.

The following decorators build on top of it:

- **`@Server.OnRPC()`** – server-side RPC handlers
- **`@Client.OnRPC()`** – client-side RPC handlers

They do not change the model, only how handlers are declared.

---

## Design Philosophy

The RPC system prioritizes:

- Explicitness over convenience
- Determinism over magic
- Safety over performance shortcuts

It is intentionally stricter than raw FiveM events.

---

## Summary

RPC in OpenCore provides:

- Deterministic request–response communication
- Clear separation between notify and call
- Built-in timeout and error handling
- A stable foundation for client–server logic

If your logic needs answers, RPC is the correct tool.
