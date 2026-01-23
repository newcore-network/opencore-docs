---
title: 'BinaryCall'
---

## Description

`@BinaryCall` marks a method as a **remote binary action** executed by a `BinaryService`.
When a method decorated with `@BinaryCall` is invoked, its implementation is **never executed locally**.
Instead, OpenCore replaces the method at runtime with an asynchronous proxy that:

1. Serializes the method arguments
2. Sends a request to the associated binary process
3. Waits for a response
4. Resolves or rejects the returned Promise

From the developer’s perspective, the method behaves like a normal async function, while the actual logic is executed externally.

---

## How it works

A method decorated with `@BinaryCall` does not contain business logic.

During server bootstrap, OpenCore:

- reads decorator metadata
- registers the method as a binary action
- replaces the method implementation with a proxy function
- routes calls through the `BinaryProcessManager`

The original method body is ignored.

---

## Arguments

```ts
@Server.BinaryCall(options?)
```

All options are optional.


### `options.action`

Defines the action name sent to the binary process.

If omitted, the method name is used as the action.

```ts
@Server.BinaryCall({ action: 'sum' })
sum(a: number, b: number): Promise<number>
```

Binary request:

```json
{
  "action": "sum"
}
```


### `options.service` (optional)

Overrides the target binary service name.

Useful when a class needs to communicate with multiple binary services.

```ts
@Server.BinaryCall({
  service: 'crypto',
  action: 'hash'
})
hash(value: string): Promise<string>
```

If not provided, the service declared by `@BinaryService` is used.


### `options.timeoutMs` (optional)

Overrides the timeout for this specific binary call.

If the binary does not respond within the specified time, the Promise is rejected.

```ts
@Server.BinaryCall({
  action: 'expensiveTask',
  timeoutMs: 5000,
})
run(): Promise<void>
```

---

## Method signature

A `BinaryCall` method must follow these rules:

* Must return a `Promise<T>`
* Arguments are sent positionally
* Parameter names are not transmitted
* Only argument values are serialized

Example:

```ts
@Server.BinaryCall({ action: 'sum' })
sum(a: number, b: number): Promise<number>
```

Binary receives:

```json
{
  "params": [a, b]
}
```

---

## Stub implementation

Because the method body is never executed, it should act as a stub.

Recommended patterns:

```ts
throw new Error('BinaryCall proxy')
```

or

```ts
return null as any
```

The error will never be thrown unless the method is executed outside of OpenCore’s lifecycle.

---

## Return value

The resolved value of the Promise corresponds to the `result` field returned by the binary.

Binary response:

```json
{
  "status": "ok",
  "result": 42
}
```

TypeScript:

```ts
const value = await service.method()
// value === 42
```

---

## Error handling

If the binary responds with:

```json
{
  "status": "error",
  "error": "invalid parameters"
}
```

The Promise is rejected with an `AppError`.

Errors can be handled normally:

```ts
try {
  await service.sum(1, 2)
} catch (err) {
  // binary-level error
}
```

Timeouts and process failures are also propagated as errors.

---

## Example

```ts
@Server.BinaryService({
  name: 'math',
  binary: 'math',
})
export class MathBinaryService {

  @Server.BinaryCall({ action: 'sum' })
  sum(a: number, b: number): Promise<number> {
    throw new Error('BinaryCall proxy')
  }
}
```

Usage:

```ts
const total = await math.sum(2, 3)
```

---

## Notes

* The method body is never executed
* Parameter names are irrelevant
* Argument order is preserved
* The method behaves as a transparent async proxy
* All execution occurs outside the FiveM runtime

`BinaryCall` enables TypeScript to interact with native processes as if they were local asynchronous functions, while maintaining strict process isolation and runtime safety.