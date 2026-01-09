---
title: Command Execution
---

## Description
The `CommandExecutionPort` handles the registration and routing of chat commands. 

**Note**: Most developers should use the **`@Server.Command()`** decorator instead of interacting with this port directly. This port is considered an **internal infrastructure component** used by the framework to bridge commands across resources.

## Key Features

- **Global Discovery**: Commands can be registered in any resource but are collected by the Core.
- **Positional Execution**: When a command is typed, the Core finds which resource owns it and routes the execution back to that resource.

## API Methods

### `getAllCommands()`
Returns a list of all commands registered across the entire framework, including their descriptions and usage strings. Useful for building **Help Menus** or **Command Lists**.

### `execute()`
Manually triggers a command execution for a player. This is more "internal" and used when the framework needs to simulate a player typing a command.

## Decorator Integration

This port is the engine behind:
- **`@Server.Command('name', ...)`**: When you use this decorator, the framework calls `commandExecutionPort.register()` during bootstrap.

## Notes
- This port is essential for creating custom "Command List" UIs or help menus.
- It ensures that even if a command is defined in a remote resource, the Core can still "see" it for permission validation.
- **Internal vs Public**: Direct registration via this port is discouraged; prefer the declarative `@Server.Command()` approach.
