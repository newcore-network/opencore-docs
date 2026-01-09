---
title: Parallel Compute Service
---

## Description
The `ParallelComputeService` is OpenCore's solution for handling CPU-intensive tasks without blocking the main GTA/FiveM thread. It utilizes a **Worker Pool** system to execute TypeScript code in background threads.

This is critical for maintaining high server FPS when performing heavy operations like complex pathfinding, data processing, or large-scale mathematical simulations.

## How it Works

### 1. Worker Pool
The service manages a pool of background workers (Native Workers). When you submit a task, it is queued and picked up by the first available worker.

### 2. Task Execution
Tasks must be defined in a way that they can be serialized and sent to a worker. The service handles the communication and returns a `Promise` that resolves when the worker completes the task.

## API Methods

### `run()`
Executes a task in a background worker.

```ts
async run<T, R>(taskName: string, data: T): Promise<R>
```

---

### `getStats()`
Returns information about the current state of the pool:
- Active workers.
- Pending tasks in queue.
- Completed task count.

## Why use Parallelism?
FiveM runs the main script logic on a single thread. If you perform a calculation that takes 50ms, the entire server "freezes" for 50ms, causing lag and dropped frames. 

By offloading that calculation:
1. The main thread stays free to process networking and game logic.
2. The calculation runs at full speed on a separate CPU core.
3. You receive the result via a Promise when it's ready.

## Example Use Cases
- **Pathfinding**: Calculating routes for complex AI.
- **JSON Processing**: Parsing extremely large data structures.
- **Cryptography**: Generating hashes or encrypted tokens.
- **Image/Data Compression**: Processing assets on the fly.

## Notes
- **Isolation**: Workers do not have access to the global scope of your resource. You must pass all required data via the task arguments.
- **Natives**: FiveM Natives are generally **not available** inside worker threads. Parallelism is for pure TypeScript/JavaScript logic.
- **Overhead**: Moving data between threads has a small cost. Only use this service for tasks that take significant time (>1ms).
