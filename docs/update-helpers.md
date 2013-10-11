# Update Helpers

Update helpers are used in [updates](./query-helpers.md#helper-updates) and [values](./query-helpers.md#helper-updates). They're only used in the values helper if the query type is [update](./query-types.md#type-update).

They're a lot simpler than [conditional helpers](./conditional-helpers.md). No cascading. The amount of helpers provided for updates out of the box is currently lacking. There's a ton of cool stuff that could be done, so submit a pull request!

Check out the [Playground](http://mosql.j0.hn/#/snippets/1n).

### Helper: '$inc'

___Format:___ ```col = col + val```

Increment column by value.

__Example:__

```javascript
{
  type: 'update'
, table: 'users'
, where: {
    id: 7
  }
, updates: {
    $inc: { hp: 5 }
  }
}
```

```sql
update "users"
  set "hp" = "users"."hp" + $1
where "users"."id" = $2
```

### Helper: '$dec'

___Format:___ ```col = col - val```

Decrement column by value.

__Example:__

```javascript
{
  type: 'update'
, table: 'users'
, where: {
    id: 7
  }
, updates: {
    $dec { hp: 5 }
  }
}
```

```sql
update "users"
  set "hp" = "users"."hp" - $1
where "users"."id" = $2
```