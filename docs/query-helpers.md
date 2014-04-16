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

If you need to perform multiple actions, use an array of actions:

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: [
    { dropConstraint: { name: 'users_pkey' } }
  , { addConstraint: { name: 'users_pkey', primaryKey: [ 'id', 'name' ] } }
  , { addConstraint: { name: 'users_stuff_key', unique: 'name' } }
  , { alterColumn: { name: 'createdAt', default: 'now()' } }
  ]
}
```

```sql
alter table "users"
  drop constraint "users_pkey",
  add constraint "users_pkey" primary key ("id", "name"),
  add constraint "users_stuff_key" unique ("name"),
  alter column "createdAt" set default now()
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

In certain situations, you may want to surround your expression in parenthesis. Use sub-expressions to pass in options to your original expression:

```javascript
{
  expression: {
    parenthesis: true
  , expression: 'avg( something - another_thing )'
  }
}
```

Expressions can also be parameterized within the grander query:

```javascript
// => select $1, $2 from "tbl" where "tbl"."col" = $3
{
  type: 'select'
, table: 'tbl'
, columns: [
    { expression: { expression: '$1, $2', values: [ 3, 4 ] } }
  ]
, where: { col: 'bob' }
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
, updates: {
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

__Optional way to specify schema and database:__

As with all object selection in MoSQL, the library consumer can simply pass a string of the following format:

```
{database}.{schema}.{table}.{column}::{type}{JSON/HStore Operators}
```

However, parsing that can be a pain. The join helper offers a more semantic approach to building the target object:

```javascript
// left join "my_database"."my_schema"."books" on "books"."userId" = "users"."id"
{
  type: 'left'
, target: 'books'
, schema: 'my_schema'
, database: 'my_database'
, on: { userId: '$users.id$' }
}
````

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

### Helper: 'order'

Add an ORDER BY clause. There are many different acceptable inputs here best described by an example:

```javascript
// select "users".* from "users" order by "order"."id" desc, "order"."name" asc
{
  type:     'select'
, table:    'users'

  // Object syntax is the preferable way since it can automatically
  // quote your columns and add in the default table
, order:    { id: 'desc', name: 'asc' }
, order:    ['id desc', 'name asc']
, order:    'id desc'
}
```

### Helper: 'over'

Add an OVER clause.  Can take either a string or an object with [partition](#helper-partition) and [order](#helper-order).

```javascript
// select depname, empno, salary, avg(salary) over (partition by "empsalary"."depname" order by salary asc) from empsalary;
{
  type: 'select'
, table: 'empsalary'
, columns: ['depname', 'empno', 'salary', {type: function, function: 'avg', expression: 'salary'}]
, over: {
    partition: 'depname'
  , order: {salary: 'asc'}
  }
}
```

### Helper: 'partition'

Add an PARTITION BY clause.  Can take either a string or an array of strings.  For use with [over](#helper-over).

```javascript
// select depname, empno, salary, avg(salary) over (partition by "empsalary"."depname") from empsalary;
// select depname, empno, salary, avg(salary) over (partition by "empsalary"."depname", "empsalary"."empno") from empsalary;
{
  type: 'select'
, table: 'empsalary'
, columns: ['depname', 'empno', 'salary', {type: function, function: 'avg', expression: 'salary'}]
, over: {
    partition: 'depname'  // string syntax
    partition: ['depname', 'empno'] // array syntax
  , order: {salary: 'asc'}
  }
}
```

### Helper: 'queries'

Specifies a list of queries to joined together specified by `query.joiner`. Defaults to a single space. If the query type is [union](./query-types.md#type-union), [intersect](./query-types.md#type-intersect), or [except](./query-types.md#type-except), the joiner will be the corresponding combination operation.

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

### Helper: 'returning'

Specifies what to return an [insert](./query-types.md#type-insert) or [update](./query-types.md#type-update) query type. Valid input is the same as the [columns](#helper-columns) helper:

```javascript
{
  type: 'insert'
, table: 'users'
, values: {
    name: 'Bob'
  , email: 'bob@bob.com'
  }
, returning: [
    'id'
  , { expression: 'anything goes', alias: 'nose' }
  ]
}
```

```sql
insert into "users" ("name", "email") values ('Bob', 'bob@bob.com')
returning "users"."id", anything goes as "nose";
```

### Helper: 'table'

Specify which table to use in most all query types. May be a string, an array of strings, a MoSQL query object.

```javascipt
{
  type: 'select'
//, table: 'users'
//, table: ['users', 'consumers']
, table: {
    type: 'select'
  , table: 'users'
  , alias: 'u'
  }
}
```

[Playground](http://mosql.j0.hn/#/snippets/1d)

### Helper: 'updates'

Specifies the updates for an update statement.

```javascript
{
  type: 'update'
, table: 'employees'
, updates: {
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

___Note:___ _The [updates helper](./update-helpers.md) was sufficiently complex to warrant its own helper system._

### Helper: 'values'

Specifies values for an insert or update statement. If used in an update statement, will work as an alias for the updates helper. May pass in an object whose keys are the column names and values are the values, or an array of objects for _batch inserts_.

Each value may be a MoSQL query object for sub-queries.

```javascript
{
  type: 'insert'
, table: 'users'
, values: {
    name: 'Bob'
  , email: {
      type: 'select'
    , table: 'other_users'
    , columns: [ 'email' ]
    , where: { id: 7 }
    }
  }
}
```

__Batch Inserts:__

```javascript
// insert into "users" ("name", "email", "code") values
// ($1, $2, null), ($3, null, null), ($4, null, $5)
{
  type: 'insert'
, table: 'users'
, values: [
    { name: 'Bob', email: 'bob@bob.com' }
  , { name: 'Tom' }
  , { name: 'Pam', code: 'aas123' }
  ]
}
```

### Helper: 'view'

Used in the [create-view](./query-types.md#type-create-view) query type. Simply returns the string passed in to name the view:

```javascript
// create view "jobs_gt_10" as
//  select "jobs".* from "jobs"
//  where "jobs"."id" > $1
{
  type: 'create-view'
, view: 'jobs_gt_10'
, expression: {
    type: 'select'
  , table: 'jobs'
  , where: { id: { $gt: 10 } }
  }
}
```

### Helper: 'where'

Used to build conditional clauses in the select, update, and delete query types. The conditional builder has its own [helper system](./conditional-helpers.md).

The where helper is probably the most complex helper in all of MoSQL. Its helpers can have the option of cascading, which means its actions propagate through object levels. You'll find that mostly any combination of helpers-to-values will work because of this.

```javascript
// select "users".* from "users"
// where "users"."id" = $1 or "users"."name" = $2
{
  type: 'select'
, table: 'users'
, where: { $or: { id: 5, name: 'Bob' } }
}

// select "users".* from "users"
// where "users"."id" = $1 or "users"."name" = $2
{
  type: 'select'
, table: 'users'
, where: { $or: [ { id: 5 }, { name: 'Bob' }] }
}

// select "users".* from "users"
// where "users"."id" = $1 or "users"."id" = $2
{
  type: 'select'
, table: 'users'
, where: { id: { $or: [5, 7] } }
}
```

Notice how the placement of the conditional helper ```$or``` can change. You can pretty much put it anywhere that "looks right" and it will work.

Conditional statements are arbitrarily embeddable.

```javascript
// select "users".*
// from "users"
// where "users"."id" > 7
//   or "users"."id" < 10
{
  type: 'select'
, table: 'users'
, where: {
    id: { $gt: { $or: [7, { id: { $lt: 10 } }] } }
  }
}

// Or a much nicer way of representing that
{
  type: 'select'
, table: 'users'
, where: {
    id: { $or: { $gt: 7, $lt: 10 } }
  }
}
```

If ```$or``` is not specified at some level, then ```$and``` will be used by default. The ```$or``` and ```$and``` helpers _do not cascade_. Or rather, their effects are only one object deep:

```javascript
// select "users".*
// from "users"
// where ("users"."id" = 7
//        and "users"."id" = 8)
//   or ("users"."name" > 'Bob'
//       and "users"."name" < 'Helen')
{
  type: 'select'
, table: 'users'
, where: {
    $or: {
      id: [ 7, 8 ]
    , name: { $gt: 'Bob', $lt: 'Helen' }
    }
  }
}
```

Notice how ```id``` and ```name``` are grouped and the groups are joined by an OR clause, but the inside of the groups are joined by AND. This is because ```$or``` and ```$and``` do not cascade. However, operation like ```$lte``` and ```$gt``` do cascade:

```javascript
// select "users".*
// from "users"
// where ("users"."name" > $1
//        or "users"."id" > $2)
//   and ("users"."name" <= $3
//        or "users"."id" <= $4)
{
  type: 'select'
, table: 'users'
, where: {
    $gt:  { $or: { name: 'Bob', id: 10 } }
  , $lte: { $or: { name: 'Sam', id: 100 } }
  }
}
```

This covers the bulk of the where helper. Just try out anything with the where helper, it will probably figure out what you meant. For a list of all conditional helpers, take a look at the [conditional helper docs](./conditional-helpers.md)

### Helper: 'window'

Add a window clause:

```
WINDOW window_name AS ( window_definition ) [, ...]
```

__Example:__

```javascript
{
  type: 'select'
, table: 'foo'
, window: {
    name: 'f'
  , as: {
      partition: 'b'
    , order: { id: 'desc' }
    }
  }
}
```

__Result:__

```sql
select * from "foo"
window "f" as (
  partition by "b" order by "foo"."id" desc
)
```

The `as` object accepts the following query helpers as keys:

* [partition](#helper-partition)
* [order](#helper-order)
* [groupBy](#helper-groupBy)

__From an existing window:__

```javascript
{
  type: 'select'
, table: 'foo'
, window: {
    name: 'f'
  , as: { existing: 'b' }
  }
}
```

__Result:__

```sql
select * from "foo"
window "f" as ("b")
```

### Helper: 'with'

Add WITH sub-queries before any query type. Valid input is either an array of MoSQL query objects or an object whose keys represent the alias of the WITH sub-query, and the value is a MoSQL query object. If ordering matters for WITH queries, then you should use the array syntax.

```javascript
{
  type:     'select'
, table:    'users'
, with: {
    otherUsers: {
      type: 'select'
    , table: 'users'
    , where: { columnA: 'other' }
    }
  }
, where: {
    id: {
      $nin: {
        type: 'select'
      , table: 'otherUsers'
      , columns: ['id']
      }
    }
  }
}
```

```sql
with "otherUsers" as (
  select "users".* from "users"
  where "users"."columnA" = $1
)
select "users".* from "users" where "users"."id" not in (
  select "otherUsers"."id" from "otherUsers"
)
```

[Playground](http://mosql.j0.hn/#/snippets/1f)

__Array Syntax:__

```javascript
{
  type:     'select'
, table:    'users'
, with: [
    {
      type: 'select'
    , table: 'users'
    , name: 'otherUsers'
    , where: { columnA: 'other' }
    }
  , {
      type: 'select'
    , table: 'users'
    , name: 'otherUsers2'
    , where: { columnA: 'other2' }
    }
  , {
      type: 'select'
    , table: 'users'
    , name: 'otherUsers3'
    , where: { columnA: 'other3' }
    }
  ]
, where: {
    id: {
      $nin: {
        type: 'select'
      , table: 'otherUsers'
      , columns: ['id']
      }
    }
  }
}
```

```sql
with "otherUsers" as (
  select "users".* from "users"
  where "users"."columnA" = $1
),
"otherUsers2" as (
  select "users".* from "users"
  where "users"."columnA" = $2
),
"otherUsers3" as (
  select "users".* from "users"
  where "users"."columnA" = $3
)
select "users".* from "users"
where "users"."id" not in (
  select "otherUsers"."id" from "otherUsers"
)
```

## Registering your own helpers

When a MoSQL query object is parsed, it first looks at the `type` field on the object. It finds the matching query type:

```javascript
mosql.registerQueryType(
  'select-one-user'
, 'select {columns} from users {joins} {where} limit 1'
);
```

It then goes through the rest of the properties in the object and sees if the key is declared as a query helper in the query type definition. If it is, and the helper is currently registered in MoSQL, then it will replace the ```{helper_name}``` with the result of the query helper function called 'helper_name'. Probably best to just show an example.

```javascript
mosql.registerQueryType(
  'select-one-user'
, 'select {customColumns} from users {joins} {where} limit 1'
);

// Want to do some custom column behavior
mosql.registerQueryHelper( 'customColumns', function( cols, values, query ){
  var i = cols.indexOf('names');

  // Do some funky JSON formatting
  if ( id > -1 ){
    cols[ i ] = {
      column: "'{\"firstName\":' || users.first_name || ',\"lastName\":' || users.last_name || '}'"
    , as: 'names'
    };
  }

  return mosql.queryHelpers.get('columns').fn( cols, values, query );
});

// select "id", ('{\"firstName\":' || users.first_name || ',\"lastName\":' || users.last_name || '}') as names from users limit 1
mosql.query({
  type: 'select-one-user'
, customColumns: [ 'id', 'names' ]
});
```

That's sort of just extending the columns helper. How about I just make a simple implemetation of an existing helper:

```javascript
mosql.registerQueryType(
  'select-one-user'
, 'select {columns} from users {joins} {where} {offset} limit 1'
);

mosql.registerQueryHelper( 'offset', function( offset, values, query ){
  return 'offset $' + values.push( offset );
});
```

Notice the ```$```. That's used to parameterize your queries. It's up to the helpers to do that.  You could have just as easily concatenated the offset value to the string, but you wouldn't get paramaterization. Also, the values array is the second parameter. Just push your value to that array and concatenate the result.

### mosql.registerQueryHelper( name, [options], callback )

Alias for ```mosql.queryHelpers.add```

```javascript
var mosql = require('mongo-sql');

mosql.registerQueryHelper( 'offset', function( offset, values, query ){
  return 'offset $' + values.push( offset );
});
```

### mosql.queryHelpers.add( name, [options], callback )

Registers a new query helper.

Callbacks arguments are: ```callback( value, values, query )```

__Arguments:__

* __Value__ - The value from the passed in MoSQL query object for this particular helper.
* __Values__ - The values array. All values no escaped by surrounding '$' signs are pushed to the values array for parameterized queries.
* __Query__ - This is the whole MoSQL query object passed in by the user.

```javascript
var mosql = require('mongo-sql');

// Updates query helper for query-type: 'update'
mosql.registerQueryHelper( 'updates', function($updates, values, query){
  var output = "set ";

  var result = Object.keys( $updates ).map( function( key ){
    if (updateHelpers.has(key))
      return updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
    if ($updates[key] === null)
      return utils.quoteObject(key) + ' = null';
    return utils.quoteObject(key) + ' = $' + values.push($updates[key]);
  });

  return result.length > 0 ? ('set ' + result.join(', ')) : '';
});
```

### mosql.queryHelpers.has( name )

Returns a boolean denoting whether or not a query helper exists.

### mosql.queryHelpers.get( name )

Returns the query helper interface: ```{ fn, options }```.
