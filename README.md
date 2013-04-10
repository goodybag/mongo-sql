# MongoSQL

A mongo-like interface for generating SQL for Postgres aimed for use with node postgres.

```javascript
// Lookup user by id
db.users.findOne(userId);
```

__Result:__

```sql
select "users".* from "users" where ("users"."id" = $1) limit 1
```


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
