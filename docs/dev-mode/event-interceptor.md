---
title: Event Interceptor
---

## Purpose

Event Interceptor is a development-mode tool to observe and inspect runtime event flow without changing gameplay handlers.

Use it to debug:

- event names and payload shape
- unexpected event volume/spam
- event ordering issues

## Typical Workflow

1. enable dev mode in your runtime setup
2. trigger gameplay scenario
3. inspect intercepted events and payloads
4. refine schemas, guards, and handler logic

## Best Practices

- Avoid enabling interception in production.
- Redact sensitive payload fields in logs.
- Combine with rate-limit/security observer logs for full traceability.
