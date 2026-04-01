---
title: Benchmark Strategy & Results
---

# Benchmark Strategy & Results

OpenCore benchmarks are organized around engineering value.

The goal is not to collect impressive microbenchmark numbers. The goal is to answer questions that matter to real multiplayer servers:

- What does a full command path cost?
- What does a validated net event cost?
- What happens under concurrency pressure?
- How expensive is startup as the controller graph grows?
- What tick budget is consumed as handlers and work increase?

## Benchmark Tiers

### Gold

These are the default product-facing benchmarks.

- full command execution
- full net event handling
- RPC paths
- player lifecycle churn
- tick budget impact
- binary transport paths

### Startup

These measure framework boot and registration cost.

- metadata scanning
- dependency injection setup
- schema generation
- bootstrap controller registration

### Diagnostic

These are lower-level framework internals.

- Zod validation internals
- rate limiter internals
- access control internals
- event bus internals
- metadata and decorator cost

These are useful for maintainers, but they are not the main benchmark story for production servers.

### Soak

Longer-running stress scenarios for stability and degradation checks.

## Latest Run

Source:

- Framework version: `1.0.6`
- Report timestamp: `2026-04-01T19:03:36.782Z`

## Gold Results

### Commands

| Scenario | Throughput | p95 |
| --- | --- | --- |
| `Command Full - Validated (100 players)` | `115.68K ops/sec` | `0.012ms` |
| `Command Full - End-to-End (100 players)` | `863.50K ops/sec` | `0.0027ms` |
| `Command Full - Concurrent (100 players)` | `121.71 ops/sec` | `14.42ms` |

Takeaway:

- validated command handling is cheap
- contention changes the picture much more than validation itself

### Net Events

| Scenario | Throughput | p95 |
| --- | --- | --- |
| `Net Events - Validated (10 players)` | `9.61K ops/sec` | `0.488ms` |
| `Net Events - Full Event (small, 10 players)` | `74.42K ops/sec` | `0.029ms` |
| `Net Events - Full Event (medium, 10 players)` | `44.73K ops/sec` | `0.079ms` |
| `Net Events - Full Event (large, 10 players)` | `27.68K ops/sec` | `0.113ms` |

Takeaway:

- payload size matters
- validation remains affordable

### RPC

| Scenario | Throughput | p95 |
| --- | --- | --- |
| `RPC - Schema generation simple (200 methods)` | `7.95K ops/sec` | `0.176ms` |
| `RPC - Schema generation complex (200 methods)` | `3.06K ops/sec` | `0.400ms` |

Takeaway:

- schema complexity is a real startup and registration cost

### Player Lifecycle

| Scenario | Throughput | p95 |
| --- | --- | --- |
| `Full Cycle (500 players)` | `200.55K ops/sec` | `0.0096ms` |
| `Concurrent Connections (500 players)` | `108.68K ops/sec` | `0.0046ms` |
| `Concurrent Disconnections (500 players)` | `1.83M ops/sec` | `0.00075ms` |

Takeaway:

- lifecycle churn scales well
- connect cost is meaningfully higher than disconnect cost

### Tick Budget

| Scenario | Throughput | p95 |
| --- | --- | --- |
| `Tick - Real setTick (50 handlers)` | `93.12K ops/sec` | `0.021ms` |
| `Tick - 5 Handlers (medium workload)` | `18.45K ops/sec` | `0.098ms` |
| `Tick - 5 Handlers (heavy workload)` | `2.26K ops/sec` | `0.559ms` |
| `Tick - Parallel Execution` | `243.24 ops/sec` | `8.00ms` |

Takeaway:

- small handlers are cheap
- heavy work inside ticks is dangerous
- parallel tick execution is not a free win

### BinaryService

| Scenario | Throughput | p95 |
| --- | --- | --- |
| `Parse mixed responses (500 ops)` | `1.20M ops/sec` | `0.0011ms` |
| `Full round-trip (50 calls)` | `350.12K ops/sec` | `0.0092ms` |
| `Serialize large payload (500 ops)` | `2.88K ops/sec` | `0.428ms` |

Takeaway:

- binary transport is strong for parse and round-trip
- large payload serialization is the expensive path

## Startup Results

| Scenario | Throughput | p95 / p99 |
| --- | --- | --- |
| `Bootstrap - 100 controllers` | `205.87 ops/sec` | `p95 6.37ms` |
| `MetadataScanner - 10 controllers` | `112.61K ops/sec` | `p99 21.15μs` |
| `DI - Resolve simple service` | `1.92M ops/sec` | `p99 1.36μs` |
| `SchemaGenerator - batch 50 methods` | `628 ops/sec` | `p99 14.17ms` |

Takeaway:

- startup remains healthy overall
- schema generation is the main startup hotspot in this run

## What This Means For Servers

1. The framework is fast on validated happy paths.
2. The real costs show up under contention, not in single-path microbenchmarks.
3. Tick work and large payload serialization deserve the most operational attention.
4. Startup cost is acceptable and mostly scales with schema generation and registration volume.

## Notes

- Results are hardware-dependent.
- Compare runs relatively, not absolutely.
- `gold` should be the main suite used to talk about framework performance.
- `diagnostic` is still useful, but it is not the product-facing benchmark story.
