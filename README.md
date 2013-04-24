# MongoSQL

A mongo-like interface for generating SQL for Postgres aimed for use with node postgres.

```
npm install mongo-sql
```

__Create a Query Builder:__

```javascript
var QueryBuilder = require('mongo-sql');

var collection = new QueryBuilder('collection');
```

__Lookup User by ID:__

```javascript
db.users.findOne( uid );
```

Result:

```sql
select "users".* from "users" where ("users"."id" = $1) limit 1
```

__Using $or:__

```javascript
collection.find({ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] });
```

Result:

```sql
select "collection".* from "collection" where (
  "collection"."a" = $1 and "collection"."b" = $2
) or (
  "collection"."c" = $3 and "collection"."d" = $4
);
```

__Sub-Queries!:__

```javascript
// Use defer: true to return a function to call for later use
// Useful for sub-queries. When writing your db-layer, you can
// abstract over this to call defer true when a query doesn't
// have a callback
var result = collection.find({
  id: {
    $in: other.find(
      { id: { $gt: 5 } }
    , { fields: ['id'], defer: true }
    )
  , $gt: 10
  }
});
```

Result:

```sql
select "collection".* from "collection" where (
  "collection"."id" in (
    select id from "other" where (
      "other"."id" > $1
    )
  ) and "collection"."id" > $2
);
```

__Join:__ _supports join, leftJoin, outerJoin, fullOuterJoin, innerJoin_

```javascript
var query = {
  $notNull: ['email']
};

// Joins!
var options = { 
  fields: ['users.*', 'array_agg(groups.name) as groups']
, leftJoin: { groups: { 'groups.userId': 'users.id'  } }
, offset: 25
, limit:  50
, order: 'id desc'
};

db.users.find(query, options);
```

Result:

```sql
select users.*, array_agg(groups.name) as groups from "users"
  left join "groups" on (
    "groups"."userId" = "users"."id"
  )
  where ("users"."0" is not null)
  limit 50
  order by id desc;
```
