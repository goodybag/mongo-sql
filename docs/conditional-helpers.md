# Conditional Helpers

Conditional helpers are used within the [where](./query-helpers.md#helper-where) query helper. They allow the use of operators like ```>, <=, in, not in, etc.```. Helpers can be arranged pretty much anyway you want to and it will work. I'll try and show all the different ways you can do it.

Checkout the [Conditional Playground](http://mosql.j0.hn/#/snippets/1j).

### Helper: '$or'

Strictly speaking, ```$or``` is not a conditional helper, but it is used in building conditions. Or multiple conditions together

```javascript
{
  type: 'select'
, table: 'users'
, where: {
    $or: [
      { sex: 'male',   salary: { $gt: 100000, $lt: 150000 } }
    , { sex: 'female', salary: { $gt: 120000, $lt: 150000 } }
    ]
  }
}
```

```sql
select "users".*
from "users"
where ("users"."sex" = $1
       and ("users"."salary" > $2
            and "users"."salary" < $3))
  or ("users"."sex" = $4
      and ("users"."salary" > $5
           and "users"."salary" < $6))
```

### Helper: '$equals'

___Cascades:___ _true_

__Format:__ ```col = val```

This is the default conditional helper. You do not need specify ```$equals```. It is the default operator.

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: 7 }
, where: { id: { $equals: 7 } }
, where: { $equals: { id: 7 } }
}
```

```sql
select "users".* from "users" where "users"."id" = 7
```

### Helper: '$ne'

___Cascades:___ _true_

__Format:__ ```col != val```

Does not equal helper.

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $ne: 7 } }
, where: { $ne: { id: 7 } }
}
```

```sql
select "users".* from "users" where "users"."id" != 7
```

### Helper: '$gt'

___Cascades:___ _true_

__Format:__ ```col > val```

Greater than

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $gt: 7 } }
, where: { $gt: { id: 7 } }
}
```

```sql
select "users".* from "users" where "users"."id" > 7
```

### Helper: '$gte'

___Cascades:___ _true_

__Format:__ ```col >= val```

Greater than equal to

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $gte: 7 } }
, where: { $gte: { id: 7 } }
}
```

```sql
select "users".* from "users" where "users"."id" >= 7
```

```sql
select "users".* from "users" where "users"."id" > 7
```

### Helper: '$lt'

___Cascades:___ _true_

__Format:__ ```col < val```

Less than

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $lt: 7 } }
, where: { $lt: { id: 7 } }
}
```

```sql
select "users".* from "users" where "users"."id" < 7
```

### Helper: '$lte'

___Cascades:___ _true_

__Format:__ ```col <= val```

Less than

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $lte: 7 } }
, where: { $lte: { id: 7 } }
}
```

```sql
select "users".* from "users" where "users"."id" <= 7
```

### Helper: '$null'

___Cascades:___ _true_

__Format:__ ```col is null```

Is Null

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $null: true } }
, where: { $null: { id: true } }
}
```

```sql
select "users".* from "users" where "users"."id" is null
```

### Helper: '$notNull'

___Cascades:___ _true_

__Format:__ ```col is not null```

Is not null

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $notNull: true } }
, where: { $notNull: { id: true } }
}
```

```sql
select "users".* from "users" where "users"."id" is not null
```

### Helper: '$like'

___Cascades:___ _true_

__Format:__ ```col like value```

Value likeness

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { name: { $like: 'Bob' } }
, where: { $like: { name: 'Bob' } }
}
```

```sql
select "users".* from "users" where "users"."name" like 'Bob'
```

### Helper: '$ilike'

___Cascades:___ _true_

__Format:__ ```col ilike value```

Value likeness case insensitive.

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { name: { $ilike: 'Bob' } }
, where: { $ilike: { name: 'Bob' } }
}
```

```sql
select "users".* from "users" where "users"."name" ilike 'Bob'
```

### Helper: '$in'

___Cascades:___ _false_

__Format:__ ```col in set|expression```

Value in a set or recordset.

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $in: [ 1, 2, 3 ] } }
}
```

```sql
select "users".* from "users" where "users"."id" in (1, 2, 3)
```

```javascript
{
  type: 'select'
, table: 'users'
, where: {
    id: { $in: {
      type: 'select'
    , columns: ['id']
    , table: 'consumers'
    , where: { name: 'Bob' }
    } }
  }
}
```

```sql
select "users".* from "users" where "users"."id" in (
  select "consumers"."id" from "consumers"
  where "consumers"."name" = 'Bob'
)
```

### Helper: '$nin'

___Cascades:___ _false_

__Format:__ ```col in set|expression```

Value not in a set or recordset.

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: { id: { $nin: [ 1, 2, 3 ] } }
}
```

```sql
select "users".* from "users" where "users"."id" not in (1, 2, 3)
```

```javascript
{
  type: 'select'
, table: 'users'
, where: {
    id: { $nin: {
      type: 'select'
    , columns: ['id']
    , table: 'consumers'
    , where: { name: 'Bob' }
    } }
  }
}
```

```sql
select "users".* from "users" where "users"."id" not in (
  select "consumers"."id" from "consumers"
  where "consumers"."name" = 'Bob'
)
```

### Helper: '$custom'

___Cascades:___ _false_

Define your own custom format on the fly. 

__Example:__

```javascript
{
  type: 'select'
, table: 'users'
, where: {
    id: { $notNull: true }
  , $custom: ['coalesce(something::json, $1) or $2', 'Bob', 'Alice']
  }
, where: {
    value: 'coalesce(something::json, $1) or $2'
  , values: ['Bob', 'Alice']
  }
}
```

```sql
select "users".*
from "users"
where "users"."id" is not null
  and coalesce(something::json, 'Bob') or 'Alice'
```

## Register your own helpers

Check out the source code to see how I implemented conditional helpers. You can find them in helpers/condiontal.js. The API is the standard Helper interface used throughout MoSQL.

### mosql.conditionalHelpers.add( name, [options], callback )

Registers a new query helper.

Callbacks arguments are: ```callback( column, value, values, table, query )```

__Arguments:__

__Column__ - The column associated to the operation (already quoted and assocated to table.
__Value__ - The value being operated on (already parameterized).
__Values__ - The values array. All values not escaped by surrounding '$' signs are pushed to the values array for parameterized queries.
__Table__ - The table associated to the column
__Query__ - This is the whole MoSQL query object passed in by the user.

__Example:__

```javascript
var mosql = require('mongo-sql');

mosql.condtionalHelpers.add('$years_ago', function(column, value, values, table){
  return column + " >= now() - interval " + value + " year";
});
```

### mosql.conditionalHelpers.has( name )

Returns a boolean denoting whether or not a conditional helper exists.

### mosql.conditionalHelpers.get( name )

Returns the conditional helper interface: ```{ fn, options }```.