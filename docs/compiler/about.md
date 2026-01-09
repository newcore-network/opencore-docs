---
title: The Compiler
---

## Overview

The OpenCore Compiler is the heart of the CLI. It is a high-performance build engine specifically designed to handle the complexities of FiveM's three distinct runtime environments (Server, Client, and NUI).

## Technology Stack

The compiler is built using a hybrid approach for maximum efficiency:

- **Go (Core Engine)**: Handles the orchestration, file system watching, and parallel worker pool.
- **SWC (Transformation)**: A super-fast TypeScript/JavaScript transformer written in Rust. We use it to handle **Decorators** and **Metadata Reflection**.
- **esbuild (Bundling)**: The fastest JavaScript bundler available, used to link all dependencies into a single FiveM-compatible file.

## Why it's different

Most FiveM build systems use standard Webpack or Rollup configurations which are slow and don't understand FiveM's unique constraints. The OpenCore compiler provides:

### 1. Multi-Core Parallelism
While standard tools compile resources one by one, our Go engine distributes the work across all available CPU cores. This reduces build times from several seconds to **milliseconds**.

### 2. FiveM-Specific Targeting
The compiler automatically applies different rules depending on the target:
- **Server**: Optimized for Node.js runtime.
- **Client**: Strips all Node.js and Web APIs, ensuring the code is compatible with FiveM's restricted "neutral" JS environment.
- **NUI**: Standard browser bundling.

### 3. Automated Asset Management
Beyond code, the compiler manages your `fxmanifest.lua` generation, copies static assets, and ensures that the final `dist/` folder is ready to be dropped into your server without manual tweaks.

## Performance Metrics
On a typical project with 10 resources:
- **Sequential Build**: ~2.3 seconds
- **Parallel Build (8 cores)**: **~0.5 seconds**
