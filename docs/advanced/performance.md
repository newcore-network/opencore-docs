---
title: Performance & Compute
---

## Principles

OpenCore performance comes from predictable pipelines, explicit boundaries, and lightweight handlers.

Keep these priorities:

- Validate early, fail fast.
- Keep tick handlers tiny.
- Use interval/event-driven flows over per-frame logic.
- Keep heavy CPU work outside the main loop.

## Server Guidelines

- Prefer `Interval`/event handlers over continuous `OnTick` loops.
- Avoid expensive synchronous loops in command/net handlers.
- Cache immutable lookups where possible.
- Use squared-distance checks for spatial filters when feasible.

## Client Guidelines

- Minimize native calls in every frame.
- Batch UI updates and avoid chatty WebView messages.
- Use `StreamingService` and model preloading to avoid spikes.

## Parallel Compute

Use `ParallelCompute` for CPU-heavy pure JS/TS operations. It can run sync, worker, or distributed modes based on cost thresholds.

Typical candidates:

- Large list transforms
- Expensive spatial sorting/filtering
- Non-native data processing tasks

## Measure First

- Profile before optimizing.
- Track p95 latency for handlers, not only averages.
- Validate gameplay impact (server tick stability, client FPS, input responsiveness).

## Benchmark Snapshot (26/02/2026)

### Core Benchmarks (Tinybench)

| Component | Throughput | Mean | p95 |
| --- | --- | --- | --- |
| EventInterceptor - getStatistics (1000 events) | ~17.78M ops/sec | ~0.056 us | ~0.087 us |
| RuntimeConfig - resolve CORE mode | ~10.49M ops/sec | ~0.095 us | ~0.107 us |
| Decorators - define metadata (Command) | ~6.92M ops/sec | ~0.145 us | ~0.247 us |
| RateLimiter - single key check | ~3.06M ops/sec | ~0.327 us | ~0.463 us |
| EventBus - multiple event types | ~2.57M ops/sec | ~0.390 us | ~0.570 us |
| DI - resolve simple service | ~1.78M ops/sec | ~0.560 us | ~0.769 us |
| BinaryService - full round-trip (serialize + parse + classify) | ~664K ops/sec | ~1.505 us | ~1.529 us |
| SchemaGenerator - batch 50 methods | ~406 ops/sec | ~2.46 ms | ~12.86 ms |
| BinaryService - classify response type (ok/error/event) | ~18.25M ops/sec | ~0.055 us | ~0.076 us |

### Load Benchmarks (Vitest)

| Scenario | Players | Throughput | Mean | p95 | p99 | Error Rate |
| --- | --- | --- | --- | --- | --- | --- |
| Commands - 500 players (simple) | 500 | ~80.14K ops/sec | ~0.132 ms | ~0.226 ms | ~0.348 ms | 0% |
| Commands - 500 players (validated) | 500 | ~4.78M ops/sec | ~0.0037 ms | ~0.0080 ms | ~0.0113 ms | 0% |
| Commands - 500 players (concurrent) | 500 | ~6.31K ops/sec | ~41.13 ms | ~76.00 ms | ~78.47 ms | 0% |
| Pipeline - simple (500 players) | 500 | ~92.04K ops/sec | ~0.130 ms | ~0.205 ms | ~0.249 ms | 0% |
| Pipeline - validated (500 players) | 500 | ~4.79M ops/sec | ~0.0110 ms | ~0.0242 ms | ~0.0584 ms | 0% |
| Pipeline - full (500 players) | 500 | ~2.34M ops/sec | ~0.0050 ms | ~0.0106 ms | ~0.0330 ms | 0% |
| RPC - schema generation simple (500 methods) | 500 | ~29.30K ops/sec | ~0.185 ms | ~0.227 ms | ~0.482 ms | 0% |
| RPC - schema generation complex (500 methods) | 500 | ~705.37K ops/sec | ~0.195 ms | ~0.335 ms | ~0.455 ms | 0% |
| RPC - concurrent RPCs (500 parallel) | 500 | ~251.10K ops/sec | ~1.03 ms | ~1.83 ms | ~1.97 ms | 0% |
| RPC - full pipeline (500 ops) | 500 | ~42.26K ops/sec | ~0.099 ms | ~0.144 ms | ~0.206 ms | 0% |
| RPC - validation error path (500 ops) | 500 | 0.00 ops/sec | ~0.042 ms | ~0.077 ms | ~0.128 ms | 100% |
