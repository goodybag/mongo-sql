# Query Helpers

All [Query Types](./query-types.md) are composed of Query Helpers. Each query helper denoted in ```{...}``` maps to a helper function. The following is a list of query helpers available in MoSQL out of the box.

### Helper: 'action'

Defines the action to take in an [alter-table](./query-types.md#type-alter-table) statement. The action helper was sufficiently complex to warrant its own [helper system](./actions.md).

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    renameColumn: {
      from: 'id'
    , to:   'uid'
    }
  }
}
```

```sql
alter table "users" rename column "id" to "uid"
```

[Playground](http://mosql.j0.hn/#/snippets/11)

### Helper: 'alias'

Alias a table. Used wherever the [table](#helper-table) query helper is used.

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, alias: 'u'
}
```

```sql
select "u".* from from "users" "u"
```

[Playground](http://mosql.j0.hn/#/snippets/12)

### Helper: 'orReplace'

Specifies whether or not to replace the view or function.

__Result:__ ```or replace```

```javascript
{ orReplace: true|false }
```

### Helper: 'temporary'

Specifies whether or not a function or view is temporary.

__Result:__ ```temporary```

```javascript
{ temporary: true|false }
```

### Helper: 'cascade'

Specifies cascading behavior on drop-table. If true, the string ```cascade``` will be returned, otherwise nothing is.

__Result:__ ```cascade```

```javascript
// drop table "users" cascade
{
  type: 'drop-table'
, table: 'users'
, cascade: true
}
```

[Playground](http://mosql.j0.hn/#/snippets/13)

### Helper: 'Columns'

Specifies columns to select usually in the format of ```"table_name"."column_name" as "column_alias"```.

```javascript
// select "users"."id", "users"."name"
{
  type: 'select'
, table: 'users'
, columns: ['id', 'name']
}
```

If you do not provide a value, for the columns helper, it will automatically select ```*``` on the primary table specified in the [table helper](./#helper-table).

Here's a mix-up of various kinds of things that can go in the columns helper:

```javascript
{
  type: "select"
, table: "users"
, columns: [
    'first_name'
  , { name: 'id', alias: 'user_id' }
  , { name: 'test', table: 'things' }
  , { // Sub-query in column selection
      type: 'select'
    , table: 'consumers'
    , columns: ['id']
    , as: 'u'
    }
  , { // Function in column selection
      type: 'array_agg'
    , expression: {
        type: 'select'
      , table: 'books'
      , columns: ['id']
      }
    }
  ]
}
```

[Playground](http://mosql.j0.hn/#/snippets/w)

Because column selection may have many different variations in form, it is recommended to just stick with the one format that can handle all use-cases:

```javascript
{
  type: 'select'
, table: 'users'
, columns: [
    // specifying table is not necessary here since it will use users by default
    { name: 'id', alias: 'user_id', table: 'users' }
    /* ... */
  ]
}
```

### Helper: 'definition'

Used for the [create-table](./query-types#type-create-table) query type to define the schema for a table. Definition has helpers of its own that this query helper references. You can find them in the [Column Definitions Document](./column-definitions.md)

```javascript
{
  type: 'create-table'
, table: 'jobs'
, definition: {
    id: {
      type: 'serial'
    , primaryKey: true
    }

  , gid: {
      type: 'int'
    , references: {
        table: 'groups'
      , column: 'id'
      , onDelete: 'cascade'
      }
    }

  , name: {
      type: 'text'
    }

  , createdAt: {
      type: 'timestamp'
    , default: 'now()'
    }
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/14)

### Helper: 'distinct'

Specifies whether or not to select distinct on a query. This query helper _has two possible value types:_ Boolean, Array. If it's a booleant, then it will simply return the 'distinct' keyword in the correct spot as shown in the example below:

```javascript
// select distinct "users".* from "users"
{
  type: 'select'
, table: 'users'
, distinct: true
}
```

An array allows you to specify which columns to select distinct on:

```javascript
// select distinct on ("id", "name") "users".* from "users"
{
  type: 'select'
, table: 'users'
, distinct: ['id', 'name']
}
```

[Playground](http://mosql.j0.hn/#/snippets/15)

### Helper: 'expression'

Expression is perhaps the most useful query-helper. If the input is a string, then expression simply returns the string. If the input is an array, then it will expect that each element in the array is a string and join that string on ```, ```. The more common use-case is using expression for sub-queries. If you pass in an object, expression will return the result of sending that object through the MoSQL query builder, just as if you were to call the ```sql``` function in the Root namespace

Insert values returned by a sub-query

```javascript
// insert into "users" ("name", "email") (
//   select "other_users"."name", "other_users"."email"
//   from "other_users"
//   where "other_users"."id" = $1
// )
{
  type: 'insert'
, table: 'users'
, columns: [ 'name', 'email' ]
, expression: {
    type: 'select'
  , table: 'other_users'
  , columns: [ 'name', 'email' ]
  , where: { id: 7 }
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/16)

See the [columns helper examples](#helper-columns) for more uses of expression.

### Helper: 'from'

Used in the [update](./query-types.md#type-update) query helper to specify a list of table expressions, allowing columns from other tables to appear in the WHERE condition and the update expressions. Pass a string or an array of strings.

```javascript
{
  type: 'update'
, table: 'employees'
, update: {
    sales_count: { $inc: 1 }
  }
, from: 'accounts'
, where: {
    'accounts.name': 'Acme Corporation'
  , id: '$accounts.sales_person$'
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/17)

### Helper: 'function'

Simply returns the name of the passed function.

```javascript
// row_to_json(row(1,'foo'))
{
  type: 'function'
, function: 'row_to_json'
, expression: {
    type: 'function'
  , function: 'row'
  , expression: [1, "'foo'"]
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/18)

### Helper: 'groupBy'

Adds a group by clause. GROUP BY will condense into a single row all selected rows that share the same values for the grouped expressions. Pass a string or an array of strings representing columns.

```javascript
{
  type: 'select'
, table: 'users'
, groupBy: ['id', 'name']
}
```

[Playground](http://mosql.j0.hn/#/snippets/19)

### Helper: 'ifExists'

Adds IF EXISTS condition to [drop-table](./query-types.md#type-drop-table) and [alter-table](./query-types.md#type-alter-table) query types.

```javascript
{
  type: 'alter-table'
, ifExists: true
, table: 'users'
, action: {
    renameTable: 'consumers'
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/1a)

### Helper: 'ifNotExists'

Add IF NOT EXISTS condition to [create-table](./query-types.md#type-create-table) query type.

```javascript
{
  type: 'create-table'
, table: 'users'
, ifNotExists: true
, definition: {
    id:   { type: 'serial', primaryKey: true }
  , name: { type: 'text' }
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/14)

### Helper: 'join'

__[Deprecated]__ Perform join

### Helper: 'innerJoin'

__[Deprecated]__ Perform innerJoin

### Helper: 'leftJoin'

__[Deprecated]__ Perform leftJoin

### Helper: 'leftOuterJoin'

__[Deprecated]__ Perform leftOuterJoin

### Helper: 'fullOuterJoin'

__[Deprecated]__ Perform fullOuterJoin

### Helper: 'crossOuterJoin'

__[Deprecated]__ Perform crossOuterJoin

### Helper: 'joins'

Add one or more joins of any type to the query. May pass in an array of objects or an object. If you join ordering is required, then you need to use the array syntax.

__Array Syntax:__

```javascript
{
  type: 'select'
, table: 'users'
, joins: [
    {
      type: 'left'
    , target: "books"
    , on: {
        userId: '$users.id$'
      }
    }
  ]
}
```

For a more advanced example, see the [Playground](http://mosql.j0.hn/#/snippets/1b).

__Object Syntax:__

Object syntax will automatically alias tables for you and can be a little more terse:

```javascript
// select "users".* from "users"
// left join "books" "books" on "books"."userId" = "users"."id"
{
  type: 'select'
, table: 'users'
, joins: {
    // No table or alias specified, but will use books by default
    books: { type: 'left', on: { userId: '$users.id$' } }
  }
}
```

__Sub-queries in joins:__

Like in a lot of places, joins have a property that will accept sub-queries. The ```target``` directive can either specify a string table name or it can be a sub-query like in the Playground example:

```javascript
{
  type: 'select'
, table: 'users'
, columns: [
    '*'
    // Aggregate each ubooks json row into a json array
  , {
      type: 'to_json'
    , as: 'books'
    , expression: 'ubooks.book'
    }
  ]
  
  // Where the joining magic happens!
, joins: [
    // Join on the junction table to get all users books ids
    {
      type: 'left'
    , target: "usersBooks"
    , on: { userId: '$users.id$' }
    }
    
    // Join on the users books ids with the books table
    // Do a sub-select to export the row as JSON
  , {
      type: 'left'
    , alias: 'ubooks'
      // Sub-query in join
    , target: {
        type: 'select'
      , table: 'books'
      , alias: 'b'
      , columns: [ { type: 'row_to_json', expression: 'b', as: 'book' } ]
      }
    , on: { id: '$usersBooks.bookId$' }
    }
  ]
}
```

### Helper: 'limit'

Add a limit to your select query.

```javascript
// select "users".* from "users" limit 10
{
  type: 'select'
, table: 'users'
, limit: 10
}
```

### Helper: 'offset'

Add an offset to your select query

```javascript
// select "users".* from "users" limit 10 offset 10
{
  type: 'select'
, table: 'users'
, limit: 10
, offset: 10
}
```

### Helper: 'only'

Used in the [alter-table](./query-types.md#type-alter-table) query type to remove a check constraint from one table only. If a truthy value, returns the string only.

```javascript
{
  type: 'alter-table'
, table: 'users'
, only: true
, action: {
    renameConstraint: {
      from: 'something'
    , to:   'other_thing'
    }
  }
}
```