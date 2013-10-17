# MoSQL - JSON->SQL

Put value and _semantic meaning_ back into your queries by writing your SQL as JSON:

```javascript
var builder = require('mongo-sql');

var usersQuery = {
  type: 'select'
, table: 'users'
, where: { $or: { id: 5, name: 'Bob' } }
};

var result = builder.sql(usersQuery);

result.values     // Array of values
result.toString() // Sql string value
```

___Result:___

```sql
select "users".* from "users" where "users.id" = $1 or "users"."name" = $2
```

Notice the ```$1``` and ```$2```. The outputted SQL is meant to be used in a parameterized query, like [node-pg](https://github.com/brianc/node-postgres) performs by default.

Looking for a sandbox? Check out http://mosql.j0.hn

## Docs

I'm in the process of writing _a lot_ of documentation. You can find my WIP here [https://github.com/goodybag/mongo-sql/tree/39-imprv-docs/docs](https://github.com/goodybag/mongo-sql/tree/39-imprv-docs/docs). For now though, if you want to know how to implement something, the test coverage is very high, so that's the best place to look.

## Why JSON?

__Installation:__

Node.js:

```
npm install mongo-sql
```

Require.js:

```
jam install mongo-sql
```

* [Examples](#examples)
* [Documentation](#documentation)

## What's the point?

This library helps manage the latent complexity of database queries. It accomplishes this by utilizing a powerful first-class construct built into JavaScript: Objects.

It's not about making SQL look beautiful or easier to write. It's about starting with a foundation that allows developers to build, extend, compose, and interop with. Existing SQL string building libraries do not afford the developer these features. I built MoSQL to circumvent the rigidity of SQL database interaction in JavaScript.

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
, where:  { id: { $nin: someGroup } }
};

builder.sql(query);
```

___Result:___

```sql
select "users".* from "users" where "users"."id" not in (
  select "groups"."userId" from "groups" where  "groups"."groupId" = $1
)
```

How about something crazier?

```javascript
{
  type: 'select'

, columns: [
    '*'
  , 'ext.field1'
  , 'ext.field2'
  , { type: 'array_agg', expression: 'ext.groups', as: 'groups' }
  ]

, table: [ 'users', 'extension' ]

, joins: {
    extension: {
      type: 'left'
    , alias: 'ext'
    , on: {
        id: '$extension.id$'
      }
    }
  }

, where: {
    name: { $ilike: { $or: ['bob', 'alice'] } }
  , id: {
      $nin: {
        type: 'select'
      , columns: ['id']
      , table: 'otherUsers'
      , where: { someCondition: true }
      }
    }
  }

, limit: 100

, order: { id: 'desc' }

, groupBy: ['id', 'name']
}
```

___Result:___

```sql
select
  "users".*
, "ext"."field1"
, "ext"."field2"
, array_agg( ext.groups ) as "groups"
from "users", "extension"
  left join "extension" "ext" on "ext"."id" = $1
where (
  "users"."name" ilike $2 or "users"."name" ilike $3
) and "users"."id" not in (
  select "otherUsers"."id" from "otherUsers"
  where "otherUsers"."someCondition" is true
)
limit $4
order by "users"."id" desc
group by "users"."id", "users"."name"
```

You may be asking, "why the hell would I write SQL that way?" My answer is that you shouldn't. When you're developing your database queries, don't start off in MoSQL. Test it out in your SQL console first. Develop your thoughts, and then figure out how it needs to be modeled in code. You'll find that MoSQL is up for building just about any query. Furthermore, you'll be able to programmatically construct your query and reflect upon its current state.

_Being able to easily reflect on your query state allows you to properly organize your query into logical units_. No need to create your own data structure for representing the state of your query. MoSQL is essentially a SQL ASM building technique that allows you to perform code analysis at any time during the construction of your query.

## Declarative Style and Extensibility

This library spawned from my frustrations in using popular string-building libraries for node. Other approaches require an imperative approach to string building which is just as ugly if not uglier than string concatenation and array joining.

```javascript
users.select(users.id, users.name).where(
  users.name.equals('Bob').and(
    users.createdAt.greaterThan('2013-05-05')
  )
);
```

At first this stuff seems great. But then as your queries get more complex you realize that it only solves the easy problems. It only solves the queries that you actually wouldn't mind just writing the string for. Swapping logic and overriding previously declared parts of your query become difficult because of the imperative style. Sub-queries and joins are awkward if supported at all and the general verbosity doesn't help either.

Using existing query builders, I found myself wanting to extend the behavior of the builder, but found no outlet to do so. I could fork the repo, implement the behavior myself, but that's no good. There needs to be a clear interface that allows anyone to add any behavior they want.

### Helpers

This library is completely built on top of helpers. They're registered exactly the same way as a consumer of the library would register.

#### Query Types

Query types are the base structure of a query. They provide ordering for the different components of a query. Here's a built-in query type:

```javascript
mongoSql.registerQueryType(
  // Type identifier
  'select'

  // Type specification
, 'select {columns} from {table} {tables} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin} {where} {limit} {offset} {order} {groupBy}'
);
```

When you run a query object through the evaluator, it first checks to ensure you have specified a type. So if you used ```type: 'select'```, then the evaluator will start off with the above registered query type. Each variable enclosed in ```{``` brackets ````}``` is called a query helper. If you want to utilize a query helper, then specify a key on your query object with the appropriate value for that helper. If the query object does not specify values for a query helper, then those helpers are ignored.

#### Query Helpers

Query helpers provide the strings replacements for the query helper variables in query types. In the above example, anything in ```{``` brackets ```}``` are query helpers. For example, look at the columns query helper:

```javascript
// helpers/query/columns.js

var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('columns', function(columns, values, query){
  if (typeof columns != 'object') throw new Error('Invalid columns input in query properties');

  var output = "";

  if (Array.isArray(columns)){
    for (var i = 0, l = columns.length; i < l; ++i)
      output += utils.quoteColumn(columns[i], query.__defaultTable) + ', ';
  } else {
    for (var key in columns)
      output += utils.quoteColumn(key, query.__defaultTable) + ' as "' + columns[key] + '", ';
  }

  if (output.length > 0) output = output.substring(0, output.length - 2);

  return output;
});
```

The first parameter to a query helper definition is the value to the corresponding key in the query object. For a query like the one below, the columns array is passed as the first parameter.

```javascript
{
  type: 'select'
, table: 'groups'
, columns: ['id', 'name']
}
```

The second parameter passed to query helpers is the values array for the whole sql query. This is for parameterized output.

#### Conditional Helpers

Some query helpers, like ```{where}``` and ```{joins}```, got so complex, I had to write a helper system just for theme. These helpers are called conditional helpers. The where and join helpers allow arbitrarily compex objects:

```javascript
{
  type: 'select'
, table: 'users'
, where: {
    id: {
      $gt: 100, $lte: 200
    , $nin: {
        type: 'select'
      , table: 'dumbUsers'
      }
    }
    // Immediate children of $or are OR'd
  , $or: {
      $gt: { name: 'Bob' }
      // But the sub-sequent children are AND'd
    , $ilike: {
        name: 'Pam'
      , lastName: 'Sue'
      }
    , name: { $ilike: 'Steve' }
    }
  }
}
```

Things like ```$or```, ```$lte```, ```$nin``` are all conditional helpers. 
