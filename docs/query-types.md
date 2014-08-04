# Query Types

Query Types are the base structure of a query. They are composed of various strings and query helpers. MoSQL queries themselves are objects that have a query-type. This allows for natural query combination in cases of sub-queries and expressions.

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
{with} select {expression} {distinct} {columns} {over} {table} {alias}
{joins} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin}
{where} {groupBy} {order} {limit} {offset}
```

__Helpers Used__: [with](./query-helpers.md#helper-with), [expression](./query-helpers.md#helper-expression), [distinct](./query-helpers.md#helper-distinct), [columns](./query-helpers.md#helper-columns), [over](./query-helpers.md#helper-over), [table](./query-helpers.md#helper-table), [alias](./query-helpers.md#helper-alias), [joins](./query-helpers.md#helper-joins), [join](./query-helpers.md#helper-join), [innerJoin](./query-helpers.md#helper-innerjoin), [leftJoin](./query-helpers.md#helper-leftjoin), [leftOuterJoin](./query-helpers.md#helper-leftouterjoin), [fullOuterJoin](./query-helpers.md#helper-fullouterjoin), [crossOuterJoin](./query-helpers.md#helper-crossouterjoin), [where](./query-helpers.md#helper-where), [groupBy](./query-helpers.md#helper-groupby), [order](./query-helpers.md#helper-order), [limit](./query-helpers.md#helper-limit), [offset](./query-helpers.md#helper-offset)

___Note:___ _The [where helper](./conditional-helpers.md) was sufficiently complex to warrant its own helper system._

___Note:___ _The use of join, innerJoin, leftJoin, etc is deprecated. Instead, use the [joins helper](./query-helpers.md#joins) instead._

### Type: 'insert'

Performs an insert query.

__Definition:__

```
{with} insert into {table} {columns} {values} {expression} {returning}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [table](./query-helpers.md#helper-table), [columns](./query-helpers.md#helper-columns), [values](./query-helpers.md#helper-values), [expression](./query-helpers.md#helper-expression), [returning](./query-helpers.md#helper-returning)

### Type: 'update'

Performs an update query

__Definition:__

```
{with} update {table} {values} {updates} {from} {where} {returning}
```

___Note:___ _The [updates helper](./update-helpers.md) was sufficiently complex to warrant its own helper system._

__Helpers Used:__ [with](./query-helpers.md#helper-with), [table](./query-helpers.md#helper-table), [values](./query-helpers.md#helper-values), [updates](./query-helpers.md#helper-updates), [from](./query-helpers.md#helper-from), [where](./query-helpers.md#helper-where), [returning](./query-helpers.md#helper-returning)

[Playground](http://mosql.j0.hn/#/snippets/17)

### Type: 'delete'

Performs a delete query.

__Definition:__

```
{with} delete from {table} {alias} {where} {returning}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [table](./query-helpers.md#helper-table), [alias](./query-helpers.md#helper-alias), [where](./query-helpers.md#helper-where), [returning](./query-helpers.md#helper-returning)

### Type: 'remove'

Performs a delete query.

__Definition:__

```
{with} delete from {table} {alias} {where} {returning}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [table](./query-helpers.md#helper-table), [alias](./query-helpers.md#helper-alias), [where](./query-helpers.md#helper-where), [returning](./query-helpers.md#helper-returning)

### Type: 'create-table'

Create table statement.

__Definition:__

```
{with} create table {ifNotExists} {table} ({definition})
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [ifNotExists](./query-helpers.md#helper-ifnotexists), [table](./query-helpers.md#helper-table), [definition](./query-helpers.md#helper-definition)

___Note:___ _The [definition helper](./column-definitions.md) was sufficiently complex to warrant its own helper system._

### Type: 'drop-table'

Drop table statement.

__Definition:__

```
{with} drop table {ifExists} {table} {cascade}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [ifExists](./query-helpers.md#helper-ifexists), [table](./query-helpers.md#helper-table), [cascade](./query-helpers.md#helper-cascade)

### Type: 'alter-table'

Alter a table.

__Definition:__

```
alter table {ifExists} {only} {table} {action}
```

__Helpers Used:__ [ifExists](./query-helpers.md#helper-ifexists), [only](./query-helpers.md#helper-only), [table](./query-helpers.md#helper-table), [action](./query-helpers.md#helper-action)

___Note:___ _The [action helper](./actions.md) was sufficiently complex to warrant its own helper system._

[Playground](http://mosql.j0.hn/#/snippets/1a)

### Type: 'create-view'

Create a view.

__Definition:__

```
create {orReplace} {temporary} view {view} {columns} as {expression}
```

__Helpers Used:__ [orReplace](./query-helpers.md#helper-orreplace), [temporary](./query-helpers.md#helper-temporary), [view](./query-helpers.md#helper-view), [columns](./query-helpers.md#helper-columns), [expression](./query-helpers.md#helper-expression)

### Type: 'function'

Function expression.

__Definition:__

```
{function}( {expression} )
```

__Helpers Used:__ [function](./query-helpers.md#helper-function), [expression](./query-helpers.md#helper-expression)

___Note:___ _If your query type is not defined, MoSQL assumes you meant to call a function whose name corresponds to the passed in query type._

__Example__:

```javascript
// sum( users.id )
{
  type: 'sum'
, expression: 'users.id'
}
```

[Playground](http://mosql.j0.hn/#/snippets/18)

### Type: 'expression'

Simply returns the result of the expression helper.

__Definition:__

```
{expression}
```

__Helpers Used:__ [expression](./query-helpers.md#helper-expression)

__Example__:

```javascript
// select 1
{
  expression: 'select 1'
}

// ( hello world )
{
  expression: {
    parenthesis: true
  , expression: 'hello world'
  }
}
```

### Type: 'union'

Combines multiple queries via the `union` operation. See [queries helper](./query-helpers.md#helper-queries) for more information. Works the same as the [intersect](#type-intersect) and [except](#type-except) types.

__Definition:__

```
{queries}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [queries](./query-helpers.md#helper-queries)

__Example__:

```javascript
{
  type: 'union'
, all: true
, queries: [
    { type: 'select', table: 'users' }
  , { type: 'select', table: 'other_users' }
  ]
};
```

__Result:__

```sql
select "users".* from "users" union all select "other_users".* from "other_users"
```

### Type: 'intersect'

Combines multiple queries via the `intersect` operation. See [queries helper](./query-helpers.md#helper-queries) for more information. Works the same as the [union](#type-union) and [except](#type-except) types.

__Definition:__

```
{queries}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [queries](./query-helpers.md#helper-queries)

__Example__:

```javascript
{
  type: 'intersect'
, all: true
, queries: [
    { type: 'select', table: 'users' }
  , { type: 'select', table: 'other_users' }
  ]
};
```

__Result:__

```sql
select "users".* from "users" intersect all select "other_users".* from "other_users"
```

### Type: 'except'

Combines multiple queries via the `except` operation. See [queries helper](./query-helpers.md#helper-queries) for more information. Works the same as the [intersect](#type-intersect) and [union](#type-union) types.

__Definition:__

```
{queries}
```

__Helpers Used:__ [with](./query-helpers.md#helper-with), [queries](./query-helpers.md#helper-queries)

__Example__:

```javascript
{
  type: 'except'
, all: true
, queries: [
    { type: 'select', table: 'users' }
  , { type: 'select', table: 'other_users' }
  ]
};
```

__Result:__

```sql
select "users".* from "users" except all select "other_users".* from "other_users"
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

Returns the query type definition string.

### mosql.queryTypes.list

Returns queryType names as a string array.