# MongoSQL

A mongo-like interface for generating SQL for Postgres.

```javascript
// Lookup user by id
db.users.findOne(userId, function(error, result){
/* ... */
});

// Little more complex
db.users.find(
  {
    $notNull: ['email']
  , $leftJoin: { groups: { 'groups.userId': 'users.id'  }
  }
, { 
    fields: ['users.*', 'array_agg(groups.name) as groups']
  , offset: 25
  , limit:  50
  , order: 'id desc'
  }
, function(error, results){
    /* .. */
  }
);
```
