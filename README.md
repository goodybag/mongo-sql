# MoSQL - JSON to SQL

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

Want to play around with the syntax? Check out the [playground](http://mosql.j0.hn), [documentation](./docs), and [examples](#examples).

__Installation:__

Node.js:

```
npm install mongo-sql
```

Require.js:

```
jam install mongo-sql
```

## Why JSON?

There are plenty of SQL building libraries that use a very imperative style of building SQL queries. The approach is linear and typically requires a bunch of function chaining. It removes your ability to use the query as a value and requires the library consumer to build their queries in large clumps or all at once. It's sometimes impossible with some of these libraries to reflect on the current state of the query programmatically. What columns have I added? Have I already joined against my groups table? MoSQL uses standard data structures to accomplish its query building, so you can figure out the state of the query at all times.

JSON is also a prime candidate for becoming a universally understand data representation. By using Javascript objects, we do not rule out the possibility of interoping with and porting to other languages.

It may not be as pretty as other libraries, but prettiness is not a design principle of this library. The design principles are:

__Extensibility__

If a feature is not supported, you should be able to add your own functionality to _make_ it supported.

__Semantic Value__

The query should be represented in a manner that makes sense to developer and machine. The use of standard data structures allows the developer to use standard APIs to manipulate the query.

## Examples

Sorry, these are in no particular order.

* [Simple select](http://mosql.j0.hn/#/snippets/1)
* [Simple insert](http://mosql.j0.hn/#/snippets/2)
* [Insert with values from a select](http://mosql.j0.hn/#/snippets/16)
* [Simple select with conditions](http://mosql.j0.hn/#/snippets/3)
* [Joins](http://mosql.j0.hn/#/snippets/1b)
* [Various conditional stuff](http://mosql.j0.hn/#/snippets/1j)
* [Not in sub-query](http://mosql.j0.hn/#/snippets/4)
* [Create view](http://mosql.j0.hn/#/snippets/5)
* [Multi-row inserts](http://mosql.j0.hn/#/snippets/6)
* [Ridiculous 'with' query with selecting JSON literal](http://mosql.j0.hn/#/snippets/e)
* [Various column selection methods](http://mosql.j0.hn/#/snippets/w)
* [Two different ways to specify a function](http://mosql.j0.hn/#/snippets/z)
* [Rename column](http://mosql.j0.hn/#/snippets/11)
* [Alias a table in select](http://mosql.j0.hn/#/snippets/12)
* [Drop table](http://mosql.j0.hn/#/snippets/13)
* [Create table](http://mosql.j0.hn/#/snippets/14)
* [Select distinc](http://mosql.j0.hn/#/snippets/15)
* [Update with increment](http://mosql.j0.hn/#/snippets/17)
* [Group by](http://mosql.j0.hn/#/snippets/19)
* [Various table specification methods](http://mosql.j0.hn/#/snippets/1d)
* [Insert with sub-query as second value](http://mosql.j0.hn/#/snippets/1e)
* [With sub-queries](http://mosql.j0.hn/#/snippets/1f)
* [Adding a constraint with alter table](http://mosql.j0.hn/#/snippets/1h)
* [Registering a conditional helper](http://mosql.j0.hn/#/snippets/1p)
* [Updates increment decrement](http://mosql.j0.hn/#/snippets/1n)
* [Expand foreign key array of integers to an array of JSON results](http://mosql.j0.hn/#/snippets/1t)

## Contributing

I will happily accept pull requests. Just write a test for whatever functionality you're providing. Coding style is an evolving thing here. I'll be JSHinting this repo soon and will make the coding style consistent when I do.
