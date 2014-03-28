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

### Helper: 'setSchema'

___Format:___ ```set schema "val"```

__Expects:__ ```string```

Set the schema

### Helper: 'addColumn'

___Format:___ ``` ADD [ COLUMN ] column_name data_type [ column_constraint [ ... ] ]```

__Expects:__ ```object```

Add a new column. Column constraints defined by the [column-constraint](./query-helpers.md#helper-column-constraint) query helper, which are in turn defined by [column-definition helpers](./column-definitions.md).

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    addColumn: {
      name: 'groupId'
    , type: 'int'
    , references: {
        table: 'groups'
      , column: 'id'
      , onUpdate: 'set null'
      }
    }
  }
}
```

```sql
alter table "users" add column "groupId" int
  references "groups"("id")
  on update set null
```

### Helper: 'dropColumn'

___Format:___ ```DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]```

__Expects:__ ```object```

Drop a column.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    dropColumn: {
      name: 'groupId'
    , ifExists: true
    , restrict: true
    , cascade: true
    }
  }
}
```

```sql
alter table "users" drop column if exists "groupId" restrict cascade
```

If you need to do multiple drop column statements, you can just pass an array of dropColumn objects:

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    dropColumn: [
      {
        name: 'groupId'
      , ifExists: true
      , restrict: true
      }
    , {
        name: 'email'
      }
    , {
        name: 'description'
      , cascade: true
      }
    ]
  }
}
```

```sql
alter table "users"
  drop column if exists "groupId" restrict,
  drop column "email",
  drop column "description" cascade;
```

### Helper: 'alterColumn'

___Format:___

```
alter column
  [type value.type]
  [collate value.collation]
  [using (value.using)]
  [set default value.default]
  [drop default]
  [notNull: set not null]
  [!notNull: drop not null]
  [set statistics value.statistics]
  [set storage value.storage]
```

__Expects:__ ```object|array```

Alter a column. Passing ```notNull: true``` will return set not null, but ```notNull: false``` return drop not null, everything else follows the format above.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    alterColumn: {
      name: 'createdAt'
    , notNull: false
    }
  }
}
```

```sql
alter table "users" alter column "createdAt" drop not null
```

If you need to do multiple alter column statements, you can just pass an array of alterColumn objects:

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    alterColumn: [
      { name: 'createdAt', storage: 'external' }
    , { name: 'createdAt', notNull: true }
    , { name: 'createdAt', default: 'now()' }
    ]
  }
}
```

```sql
alter table "users"
  alter column "createdAt" set storage external,
  alter column "createdAt" set not null,
  alter column "createdAt" set default now();
```

### Helper: 'dropConstraint'

___Format:___ ```drop constraint "value"```

__Expects:__ ```string|object```

Drops a constraint

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'stupid_heads'
, action: {
    dropConstraint: 'stupid_heads_idx'
  }
}
```

```sql
alter table "stupid_heads" drop constraint "stupid_heads_idx"
```

Or with more options

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'stupid_heads'
, action: {
    dropConstraint: {
      name: 'stupid_heads_idx'
    , ifExists: true
    , cascade: true
 // , restrict: true
    }
  }
}
```

```sql
alter table "stupid_heads" drop constraint if exists "stupid_heads_idx" cascade
```

### Helper: 'addConstraint'

___Format:___ ```add constraint "constraint.name" ...```

__Expects:__ ```object```

Uses the [column-constraint](./query-helpers.md#helper-column-constraint) query helper to add a column constraint.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'distributors'
, action: {
    addConstraint: {
      name: 'zipchk'
    , check: { $custom: ['char_length(zipcode) = $1', 5] }
    }
  }
}
```

```sql
alter table "distributors"
  add constraint "zipchk"
  check (char_length(zipcode) = $1)
```

### Single Parameter Actions

When passed the key on the left, returns the value on the right in the following format: ```text "value"```

```
 enableAlwaysTrigger : 'enable always trigger'
         disableRule : 'disable rule'
          enableRule : 'enable rule'
   enableReplicaRule : 'enable replica rule'
    enableAlwaysRule : 'enable always rule'
           clusterOn : 'cluster on'
             inherit : 'inherit'
           noInherit : 'no inherit'
                  of : 'of'
               notOf : 'not of'
             ownerTo : 'owner to'
       setTableSpace : 'set tablespace'
```

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'distributors'
, action: {
    enableRule: 'some_rule'
  }
}
```

```sql
alter table "distributors" enable rule "some_rule"
```

### Boolean Actions

When the key on the left is true, returns the text on the right:

```
 setWithoutCluster : 'set without cluster'
       setWithOids : 'set with oids'
    setWithoutOids : 'set without oids'
```

## Adding your own actions

Same as the other helper interfaces in MoSQL.

### mosql.registerActionHelper( name, callback )

Alias for ```mosql.actionHelpers.add```

### mosql.actionHelpers.add( name, callback )

Add an action helper.

Callbacks arguments are: ```callback( value, values, query )```

__Arguments:__

* __Value__ - The value to be used for update.
* __Values__ - The values array. All values not escaped by surrounding '$' signs are pushed to the values array for parameterized queries.
* __Query__ - This is the whole MoSQL query object passed in by the user.

__Example:__

```javascript
mosql.actionHelpers.add('renameTable', function(value, values, query){
    return 'rename to "' + value + '"';
  });
```

### mosql.actionHelpers.has( name )

Returns a boolean denoting whether or not a actoin helper exists.

### mosql.actionHelpers.get( name )

Returns the actoin helper interface: ```{ fn, options }```.
