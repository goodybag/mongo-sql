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