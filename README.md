# MongoSQL - To be renamed

Put value and _semantic meaning_ back into your queries by writing your SQL as JSON:

```javascript
var builder = require('mongo-sql');

var usersQuery = {
  type: 'select'
, table: 'users'
, where: { $or: { id: 5, name: 'Bob' } }
};


builder.sql(usersQuery);
```

___Result:___

```sql
select "users".* from "users" where "users.id" = $1 or "users"."name" = $2
```

Notice the ```$1``` and ```$2```. The outputted SQL is meant to be used in a parameterized query, like [node-pg]() performs by default.

## Why JSON?

This library strives to make query composition more native to JavaScript. Using a first-class language construct means that you can easily compose and combine queries and syntax high-lighting is much more meaningful.

```javascript
var builder = require('mongo-sql');

var someGroup = {
  type:     'select'
, table:    'groups'
, columns:  ['userId']
, where:    { "groupId": 5 }
}

var query = {
  type:   'select'
, table:  'users'
, where:  { id: $nin: someGroup }
};

builder.sql(query);
```

___Result:___

```sql
select "users".* from "users" where "users"."id" not in (
  select "groups"."userId" from "groups" where  "groups"."groupId" = $1
)
```