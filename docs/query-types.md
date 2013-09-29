# Query Types

Query Types are the base structure of a query. They are composed of various strings and query helpers. MoSQL queries themselves are objects that have a query-type. This allows for natural query combination in cases of sub-queries nd expressions.

```javascript
{
  type: 'create-table'
, table: 'users'
, ifNotExists: true
, definition: { /* ... */ }
}

// Sub-queries:
{
  type: 'select'
, with: {
    other_users: { type: 'select' /* ... */ }
  }
}
```

Listed here are the available query types out of the box with MoSQL. Use the ```type``` directive to select what type of query you want to use.

### Type: 'select'

Performs a select query.

__Definition:__

```
{with} select {distinct} {columns} {table} {alias}
{joins} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin}
{where} {groupBy} {order} {limit} {offset}
```

___Note:___ _The [where helper](./conditional-helpers.md) was sufficiently complex to warrant its own helper system._

___Note:___ _The use of join, innerJoin, leftJoin, etc is deprecated. Instead, use the [joins helper](./query-helpers.md#joins) instead._

### Type: 'insert'

Performs an insert query.

__Definition:__

```
{with} insert into {table} {columns} {values} {expression} {returning}
```

### Type: 'update'

Performs an update query

__Definition:__

```
{with} update {table} {values} {updates} {from} {where} {returning}
```

___Note:___ _The [updates helper](./update-helpers.md) was sufficiently complex to warrant its own helper system.

### Type: 'delete'

Performs a delete query.

__Definition:__

```
{with} delete from {table} {alias} {where} {returning}
```

### Type: 'remove'

Performs a delete query.

__Definition:__

```
{with} delete from {table} {alias} {where} {returning}
```

### Type: 'create-table'

Create table statement.

__Definition:__

```
{with} create table {ifNotExists} {table} ({definition})
```

___Note:___ _The [definition helper](./column-definitions.md) was sufficiently complex to warrant its own helper system._

### Type: 'drop-table'

Drop table statement.

__Definition:__

```
{with} drop table {ifExists} {table} {cascade}
```

### Type: 'alter-table'

Alter a table.

__Definition:__

```
alter table {ifExists} {only} {table} {action}
```

___Note:___ _The [action helper](./actions.md) was sufficiently complex to warrant its own helper system._

### Type: 'create-view'

Create a view.

__Definition:__

```
create {orReplace} {temporary} view {view} {columns} as {expression}
```

### Type: 'function'

Function expression.

__Definition:__

```
{function}( {expression} )
```

___Note:___ _If your query type is not defined, MoSQL assumes you meant to call a function whose name corresponds to the passed in query type._

__Example__:

```javascript
// sum( users.id )
{
  type: 'sum'
, expression: 'users.id'
}
```

## Adding Your Own Query Types

MoSQL uses the same interface as its API consumers to build functionality.

### mosql.registerQueryType( name, definition )

Alias for ```mosql.queryTypes.add```

```javascript
var mosql = require('mongo-sql');

mosql.registerQueryType(
  'select-one-user'
, 'select {columns} from users {joins} {where} limit 1'
);
```

### mosql.queryTypes.add( name, definition )

Registers a new query type.

```javascript
var mosql = require('mongo-sql');

mosql.queryTypes.add(
  'select-one-user'
, 'select {columns} from users {joins} {where} limit 1'
);

mosql.sql({
  type: 'select-one-user'
, where: { id: 7 }
});
```

### mosql.queryTypes.has( name )

Returns a boolean denoting whether or not a query type exists.

### mosql.queryTypes.get( name )

Returns the query helper definition string.
