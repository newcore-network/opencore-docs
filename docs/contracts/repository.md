---
title: Repository
---

## Description
The `Repository` contract is an abstract base class that implements the **Repository Pattern**. It provides a standardized way to perform CRUD (Create, Read, Update, Delete) operations, keeping your data access logic consistent across the entire project.

## Key Features

- **Type Safety**: Fully typed entities and primary keys.
- **Built-in CRUD**: Methods for `findById`, `findOne`, `findMany`, `save`, and `delete`.
- **Advanced Querying**: Support for pagination (`limit`, `offset`), ordering, and field selection.
- **Automatic Mapping**: Abstract `toEntity` and `toRow` methods to handle the conversion between database rows and TypeScript objects.

## API Methods

### `save()`
Inserts a new record if no ID is present, or updates the existing one if it is.

```ts
async save(entity: TEntity): Promise<TEntity>
```

### `findMany()`
Fetches multiple records with optional filters.

```ts
async findMany(where?: WhereCondition<TEntity>, options?: FindOptions<TEntity>)
```

## Example Implementation

```ts
interface User {
  id: number;
  name: string;
}

@Server.Service()
export class UserRepository extends Repository<User> {
  protected tableName = 'users';

  // Map DB row -> TS Entity
  protected toEntity(row: any): User {
    return { id: row.id, name: row.username };
  }

  // Map TS Entity -> DB row
  protected toRow(entity: User) {
    return { id: entity.id, username: entity.name };
  }
}
```

## Why use Repositories?
Instead of writing raw SQL in your services or controllers, repositories centralize the "how" of data access. This makes your code cleaner and allows you to add features like caching or logging to all database operations in one place.
