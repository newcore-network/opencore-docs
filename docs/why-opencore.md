---
title: Why OpenCore?
---

## The Vision

OpenCore is designed to solve the structural problems that have plagued FiveM development for years: **spaghetti code, lack of testability, and tight coupling between resources.**

By bringing modern software engineering patterns (Inversion of Control, Hexagonal Architecture, and Type-Safety) to the world of GTA V modding, we enable developers to build complex, maintainable, and high-performance game servers.

## Key Pillars

### 1. Architectural Integrity
Stop writing global variables and nested callbacks. OpenCore enforces a clean separation between your business logic (Services), your entry points (Controllers), and the underlying game engine (Adapters/Ports).

### 2. True Modularity
In FiveM, resources usually talk to each other via raw strings and events. OpenCore uses **Ports and Adapters** to provide type-safe, compiled interfaces across resources. If you change a method name in the Core, your other resources will fail at compile time, not runtime.

### 3. Developer Productivity
- **Dependency Injection**: Focus on logic, let the framework handle object instantiation.
- **Declarative Programming**: Use decorators (`@Server.Command`, `@Server.Guard`) to describe *what* your code should do, not *how* to wire it up.
- **Dev Mode**: Real-time feedback loops with Hot Reload and Player Simulation.

### 4. Scalability
OpenCore is built for large-scale servers. From the built-in rate limiter to the optimized parallel processing service, the framework is designed to handle hundreds of players and complex interactions without breaking a sweat.

## Is it for me?
If you are tired of debugging `nil` values in Lua, fighting with inconsistent exports, or maintaining thousands of lines of unorganized code, OpenCore is for you. It's not just a library; it's a foundation for the next generation of FiveM servers.
