---
title: Communication Overview
description: Unified communication model in OpenCore.
---

Communication in OpenCore is built around a **clear, layered model** that separates:

- **What communicates** (events, RPC, binaries)
- **How messages are transported**
- **How handlers are declared**
- **Where execution happens**

The goal is to provide a **platform-agnostic**, **explicit**, and **safe**
communication system that works consistently across server and client.

---

## Core Communication Primitives

OpenCore provides three primary communication primitives:

1. **Events**
2. **RPC (Remote Procedure Calls)**
3. **Binary Communication**

Each one serves a different purpose and has distinct guarantees.

---

## Events

Events are used to **notify** other parts of the system that something happened.

Characteristics:

- Fire-and-forget
- No response expected
- No delivery guarantee
- Low coupling

Events are ideal for:

- State updates
- Notifications
- UI updates
- Reactive behavior

Events exist at multiple levels:

- **Network events** (server ↔ client)
- **Framework events** (internal lifecycle)
- **Runtime events** (platform-level)
- **Local events** (in-process)

---

## RPC (Remote Procedure Calls)

RPC is used when one side needs to **ask the other side to execute logic and return a result**.

Characteristics:

- Request–response model
- Correlated calls
- Promise-based
- Timeout and error handling

RPC is ideal for:

- Queries
- Commands that require confirmation
- Client ↔ server interactions with results

RPC is **directional** and context-aware:

- Clients usually call server logic
- Servers may call client logic when necessary

---

## Binary Communication

Binary communication allows OpenCore to interact with **external native processes**
written in languages such as C++, Rust, Go, or Java.

Characteristics:

- Process isolation
- stdin/stdout JSON protocol
- Strong failure boundaries
- Language-agnostic

This is used for:

- CPU-intensive tasks
- Native integrations
- Security-sensitive operations
- Performance-critical logic

---

## Platform-Agnostic by Design

OpenCore separates **communication intent** from **platform implementation**.

User code interacts with:

- **EventsAPI**
- **RpcAPI**

These APIs are:

- Injected via constructor
- Independent of FiveM or any other platform
- Resolved at runtime through adapters

FiveM is just one possible transport implementation.

---

## APIs vs Decorators

OpenCore intentionally distinguishes between:

### APIs (Imperative)

Used to **emit** or **invoke** communication.

Examples:
- `events.emit(...)`
- `rpc.call(...)`
- `rpc.notify(...)`

These are typically used inside services and controllers.

---

### Decorators (Declarative)

Used to **register handlers**.

Examples:
- `@OnNet`
- `@OnRPC`
- `@OnFrameworkEvent`

Decorators describe *what should listen*, not *what should send*.

---

## Execution Contexts

Communication behaves differently depending on context:

| Context | Can Emit | Can Handle |
|------|----------|------------|
| Server | Events, RPC, Binaries | Events, RPC |
| Client | Events, RPC | Events, RPC |
| Binary | Events, RPC | Calls only |

The framework resolves the correct behavior automatically.

---

## Choosing the Right Tool

A simple rule of thumb:

- **Need to notify?** → Use Events
- **Need a result?** → Use RPC
- **Need native performance or isolation?** → Use Binaries

Avoid overloading one mechanism to behave like another.

---

## Design Philosophy

The communication system prioritizes:

- Explicitness over magic
- Determinism over convenience
- Isolation over shared state
- Clear failure modes

This makes systems easier to reason about, debug, and evolve.

---

## Summary

OpenCore communication is:

- Layered
- Explicit
- Platform-agnostic
- Safe by default

Understanding these primitives is key to building reliable systems
on top of the framework.

The following sections dive deeper into each mechanism.
