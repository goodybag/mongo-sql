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