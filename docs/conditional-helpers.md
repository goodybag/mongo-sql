# Conditional Helpers

Conditional helpers are used within the [where](./query-helpers.md#helper-where) query helper. They allow the use of operators like ```>, <=, in, not in, etc.```. Helpers can be arranged pretty much anyway you want to and it will work. I'll try and show all the different ways you can do it

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