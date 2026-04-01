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

## Benchmark Strategy

OpenCore now separates benchmarks by engineering value:

- `gold`: real framework feature paths
- `startup`: boot and registration cost
- `diagnostic`: low-level internals for maintainers
- `soak`: longer-running stress checks

The full benchmark strategy and latest validated results live here:

- [Benchmark Strategy & Results](./benchmarks.md)

## Practical Summary

The current benchmark runs show a few clear rules:

- validated command and event paths are cheap
- contention is more dangerous than validation overhead
- heavy tick work is one of the easiest ways to hurt server responsiveness
- large payload serialization is a much bigger cost than small or medium payload paths
- startup cost is mostly visible in schema generation and controller registration scale
