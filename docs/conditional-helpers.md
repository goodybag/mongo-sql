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