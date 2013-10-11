# Action Helpers

Action helpers are used in the [alter-table](./query-types.md#type-alter-table) query type to specify how various alter table actions work. Take a look at the Postgres documentation alter table:

```
ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    action [, ... ]
ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    RENAME [ COLUMN ] column_name TO new_column_name
ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    RENAME CONSTRAINT constraint_name TO new_constraint_name
ALTER TABLE [ IF EXISTS ] name
    RENAME TO new_name
ALTER TABLE [ IF EXISTS ] name
    SET SCHEMA new_schema

where action is one of:

    ADD [ COLUMN ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
    DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
    ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
    ALTER [ COLUMN ] column_name SET DEFAULT expression
    ALTER [ COLUMN ] column_name DROP DEFAULT
    ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
    ALTER [ COLUMN ] column_name SET STATISTICS integer
    ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
    ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
    ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
    ADD table_constraint [ NOT VALID ]
    ADD table_constraint_using_index
    VALIDATE CONSTRAINT constraint_name
    DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
    DISABLE TRIGGER [ trigger_name | ALL | USER ]
    ENABLE TRIGGER [ trigger_name | ALL | USER ]
    ENABLE REPLICA TRIGGER trigger_name
    ENABLE ALWAYS TRIGGER trigger_name
    DISABLE RULE rewrite_rule_name
    ENABLE RULE rewrite_rule_name
    ENABLE REPLICA RULE rewrite_rule_name
    ENABLE ALWAYS RULE rewrite_rule_name
    CLUSTER ON index_name
    SET WITHOUT CLUSTER
    SET WITH OIDS
    SET WITHOUT OIDS
    SET ( storage_parameter = value [, ... ] )
    RESET ( storage_parameter [, ... ] )
    INHERIT parent_table
    NO INHERIT parent_table
    OF type_name
    NOT OF
    OWNER TO new_owner
    SET TABLESPACE new_tablespace

and table_constraint_using_index is:

    [ CONSTRAINT constraint_name ]
    { UNIQUE | PRIMARY KEY } USING INDEX index_name
    [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]
```

See the part that says, "where action is one of:" and then lists a crap-load of stuff. That's why there are action-helpers. So there are helpers like ```addColumn, dropColumn, alterColumn``` etc.

### Helper: 'renameTable'

___Format:___ ```rename table to "value"```

__Expects:__ ```string```

Rename a table.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'consumers'
, action: {
    renameTable: 'stupid_heads'
  }
}
```

```sql
alter table "consumers" rename table to "stupid_heads"
```

### Helper: 'rename'

Alias for 'renameTable'.

### Helper: 'renameConstraint'

___Format:___ ```rename constraint constraint.from to constraint.to```

__Expects:__ ```object```

Rename a column constraint.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    renameConstraint: {
      from: 'id_idx'
    , to:   'uid_idx'
    }
  }
}
```

```sql
alter table "users" rename constraint "id_idx" to "uid_idx"
```

### Helper: 'renameColumn'

___Format:___ ```rename column column.from to column.to```

__Expects:__ ```object```

Rename a column.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    renameColumn: {
      from: 'firstName'
    , to:   'name'
    }
  }
}
```

```sql
alter table "users" rename column "firstName" to "name"
```