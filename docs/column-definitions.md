# Column Definitions

Column definitions are used to describe columns in [create-table](./query-types.md#type-create-table) and [alter-table](./query-types.md#type-alter-table) query types.

### Helper: 'type'

___Format:___ ```type```

__Expects:__ 'string'

Simply returns the value passed into the helper. Used for defining column types.

### Helper: 'primaryKey'

___Format:___ ```primary key```

__Expects:__ 'boolean'

Just returns the string 'primary key' if the value passed in to the helper is truthy.

### Helper: 'references'

___Format:___ ```references "table_name"("column_name") on update set null on delete cascade match full```

__Expects:__ 'object'

Column references another tables column.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    addColumn: {
      name: 'groupId'
    , type: 'int'
    , references: 'groups'
    , onDelete: 'cascade'
    , onUpdate: 'set null'
    , match: 'full'
    }
  }
}
```

```sql
alter table "users" add column "groupId" int references "groups"
  on delete cascade on update set null match full
```

### Helper: 'null'

___Format:___ ```null | not null```

__Expects:__ 'boolean'

If true, returns null. Otherwisee, return not null.

### Helper: 'notNull'

___Format:___ ```not null | null```

__Expects:__ 'boolean'

Inverse of ```null```. If true, returns not null. Otherwisee, returns null.