# MongoSQL

A mongo-like interface for generating SQL for Postgres aimed for use with node postgres and in conjunction with [MongoPG](https://github.com/goodybag/mongo-pg). The goal of this project is to build queries by creating documents. Advantages to a document-based approach to building SQL queries vs string building:

* You don't have to worry about the order you add values
* The query is represented as a _semantic value_ that is easily manipulated by javascript
* Automatically parameterizes values

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

__Join:__ _supports any type of join just camel-case it_

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

### Helpers

There are two types of helpers:

* Conditionals
* Values

All conditionals and value types are implemented as helpers. Things like ```$gt, $lt, $equals``` are all conditionals. They are helpers that construct the parts of queries that have conditions. Values are what's on the right-hand side of a condition. If you needed to do something like:

```sql
select * from users where last_visited > ( now() - interval '5' hour );
```

Then you could register a value helper to help format hate right-hand value in parenthesis.

```javascript
var QueryBuilder = require('mongo-sql');

// Optionally pass in an options object as the second parameter
QueryBuilder.helpers.value.add('$hours_ago', function(column, value, values, collection){
  return "now() - interval $" + values.push(value.value) + " hour";
});

var users = new QueryBuilder('users');

users.find({
  'last_visited':
  { $gt: { $hours_ago: 5 } }
});
```

The $hours_ago (along with minutes, days, years, etc.) helper is already implemented in mongo-sql. I realize that I've introduced two conflicting conventions. Camel-case and underscores. I'll fix it soon.

All helpers, conditional or otherwise, are passed 4 arguments to their implementation function

```javascript
/**
 * Helper functions are passed
 * @param column      {String}  - Column name either table.column or column
 * @param value       {Mixed}   - What the column should be equal to
 * @param values      {Array}   - The values for the query
 * @param collection  {String}  - The main table for the query
 */
```

The value parameter can be anything. By default, if the query evaluation loop comes across a helper, it will chunk the value of the helper in the document to the function as the "value". However, if when registering the helper, you pass in:

```javascript
{ customValues: false }
```

Then the evaluation loop will assume you want the pre-parameterized value of the key. This is particularly useful for single-value or simple-value helpers like ```$gt``` or ```$equals```:

```javascript
helpers.add('$equals', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' = ' + value;
});

helpers.add('$gt', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' > ' + value;
});
```

#### Helper Cascading

By default, helpers do not cascade. But what is cascading? Cascading is useful for swapping the order in which you apply conditionals or values. For instance, when performing a greater than query, there are multiple ways to order it:

```javascript
db.users.find({ id: { $gt: 1 } });
db.users.find({ $gt: { id: 1 } });
```

The way you write depends on the query. In the above example, if you need to perform multiple conditions on ```id``` then it would be useful to write it the first way:

```javascript
db.users.find({ id: { $gt: 1, $lt: 100, $or: { $gt: 100 } } });
```

On the other hand, if you were performing greater than conditionals to multiple columns, it would be beneficial to write it the second way:

```javascript
db.users.find({ $gt: { id: 1, name: 'Tom', createdAt: { $months_ago: 1 } } });
```

Most of the default conditional helpers cascade and most (if not all) of the value helpers do not. Getting the cascade right is hard. So, when writing helpers, it _may be_ beneficial to not turn cascading on.

## Oh so much more

There's a lot more to MongoSql that I just haven't really documented yet. Check out the tests and browse through the source code to get a feel for the feature-set.