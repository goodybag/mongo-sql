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
    { name: 'id', alias: 'user_id' }
  , 'name'
  , { name: 'test', table: 'things' }
  , {
      type: 'select'
    , table: 'consumers'
    , columns: ['id']
    , as: 'u'
    }
  , {
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

