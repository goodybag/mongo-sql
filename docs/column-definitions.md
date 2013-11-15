# Column Definitions

Column definitions are used to describe columns in [create-table](./query-types.md#type-create-table) and [alter-table](./query-types.md#type-alter-table) query types.

### Helper: 'type'

___Format:___ ```type```

__Expects:__ 'string'

Simply returns the value passed into the helper. Used for defining column types.

### Helper: 'primaryKey'

___Format:___ ```primary key```

__Expects:__ 'boolean|string|array'

Returns ```primary key ...``` depending on the input:

```javascript
{
  // primary key
  primaryKey: true

  // primary key ("name")
, primaryKey: 'name'

  // primary key ("fname", "lname")
, priamryKey: ['fname', 'lname']
}
```

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

Inverse of ```null```. If true, returns not null. Otherwise, returns null.

### Helper: 'unique'

___Format:___ ``` unique ( col1, col2, ... )```

__Expects:__ 'boolean|string[]'

Specifies which columns to be unique. If the value passed in is a boolean, it will assume you mean to use the column in the current context to be unique and simply return the text 'unique' if the value is true. Otherwise, if it's an array, then it will do unique on all the strings in the array.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'distributors'
, action: {
    addConstraint: {
      name: 'dist_id_zipcode_key'
    , unique: ['dist_id', 'zipcode']
    }
  }
}
```

```sql
alter table "distributors" add constraint "dist_id_zipcode_key" unique (
  "dist_id", "zipcode"
)
```

```javascript
{
  type: 'create-table'
, table: 'jobs'
, definition: {
    id: {
      type: 'serial'
    }

  , name: {
      type: 'text'
    , unique: true
    }

  , createdAt: {
      type: 'timestamp'
    }
  }
}
```

```sql
create table "jobs" (
  "id" serial,
  "name" text unique,
  "createdAt" timestamp
)
```

### Helper: 'default'

___Format:___ ```default val```

__Expects:__ 'string'

Set a default value. Purposefully does not parameterize values because it is too often the case that a value is used that does not need to be parameterized. Something like ```now()```.

__Example:__

```javascript
{
  type: 'create-table'
, table: 'jobs'
, definition: {
    id: {
      type: 'serial'
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

```sql
create table "jobs" (
  "id" serial, 
  "name" text, 
  "createdAt" timestamp default now()
)
```

### Helper: 'check'

___Format:___ ```check( {where} )```

__Expects:__ ```object```

Checks whether some condition is true. Expects a valid MoSQL conditional object. See [conditional helpers](./conditional-helpers.md) for full capabilities.

__Example:__

```javascript
{
  type: 'alter-table'
, table: 'users'
, action: {
    addColumn: {
      name: 'groupId'
    , type: 'int'
    , check: { groupId: { $gt: 7 } }
    }
  }
}
```

```sql
alter table "users" add column "groupId" int check ("users"."groupId" > $1)
```

### Helper: 'noInherit'

If true, returns the string 'no inherit'.


## Registering your own Column Definitions

Column definitions uses the standard MoSQL Helper Interface, so it's very similar to the other helpers.

### mosql.columnDefinitions.add( name, callback )

Add a new column definition. Name is the name of the column definition helper, callback is the function to be called when a match is made to the helper name. Callback's arguments are:

* __Value__ - The value to be used for update.
* __Values__ - The values array. All values not escaped by surrounding '$' signs are pushed to the values array for parameterized queries.
* __Table__ - The table associated to the column
* __Query__ - This is the whole MoSQL query object passed in by the user.

### mosql.updateHelpers.has( name )

Returns a boolean denoting whether or not a update helper exists.

### mosql.updateHelpers.get( name )

Returns the update helper interface: ```{ fn, options }```.