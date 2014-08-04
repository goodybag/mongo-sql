# MoSQL - JSON to SQL

Put value and _semantic meaning_ back into your queries by writing your SQL as JSON:

[![NPM](https://nodei.co/npm/mongo-sql.png)](https://nodei.co/npm/mongo-sql/)

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

The reason we use standard JavaScript data structures is so everything is easily manipulated. Arrays are arrays and objects are objects. Everyone knows how to interface with them.

JSON is also a prime candidate for becoming a universally understood data representation. By using Javascript objects, we do not rule out the possibility of interoping with and porting to other languages.

It may not be as pretty as other libraries, but prettiness is not a design principle of this library. The design principles are:

__Extensibility__

If a feature is not supported, you should be able to add your own functionality to _make_ it supported.

__Semantic Value__

The query should be represented in a manner that makes sense to developer and machine. The use of standard data structures allows the developer to use standard APIs to manipulate the query.

## Examples

```javascript
{
  type: 'create-table'
, table: 'jobs'
, definition: {
    id:         { type: 'serial', primaryKey: true }
  , user_id:    { type: 'int', references: { table: 'users', column: 'id' } }
  , name:       { type: 'text' }
  , createdAt:  { type: 'timestamp', default: 'now()' }
  }
}
```

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
* [Access Fields on HStore and JSON and casting](http://mosql.j0.hn/#/snippets/2y)

For even more examples, take a look at the `./tests` directory.

## How does it work?

Every MoSQL query has a [query type](./docs/query-types.md) specified that maps to a SQL string template. Query types are composed of various strings and [query helpers](./docs/query-helpers.md) whose output maps to functions.

So ```type: 'select'``` uses the query type defined as 'select'. Every other property in the query object maps to a query helper. The 'select' query type starts off like this:

```
{with} select {columns} {table}...
```

When you have the following query:

```javascript
{ type: 'select', table: 'users' }
```

The ```table``` property is mapped to the [table query helper](./docs/query-helpers.md#helper-table).

98% of the functionality in MoSQL is defined through various helper interfaces. If the functionality you need doesn't exist, you can easily register your own behavior and keep on moving along. To see how all of the functionality was implemented, just check out the [helpers folder](./helpers). It uses the same API as library consumers to add its functionality.

## Contributing

I will happily accept pull requests. Just write a test for whatever functionality you're providing. Coding style is an evolving thing here. I'll be JSHinting this repo soon and will make the coding style consistent when I do.

## Developing

Mongo-sql development is done using [Gulp](http://gulpjs.com/). If you dont have gulp installed globally, install using ```npm install -g gulp```. Then,

1. Install all development dependencies
  ```
  npm install
  ```

2. Watch for source/spec files & run jshint/unit-test cases for changed files
  ```
  gulp watch
  ```

3. Before committing changes, run full jshinting & unit-test cases for browserified version using default gulp target
  ```
  gulp
  ```

## Upgrading from 2.4.x to 2.5.x

There are two things you need to look out for:

Do not rely on adding parenthesis to strings (like in columns or returning helpers) in order to prevent MoSQL from attempting to quote the input. Instead use the expression query type:

```javascript
// select something_custom - another_custom as "custom_result" from "users"
{
  type: 'select'
, table: 'users'
, columns: [
    { expression: 'something_custom - another_custom', alias: 'custom_result' }
  ]
}
```

If you were relying on expression objects without a type specified to be converted into a `function` type, this will no longer happen. Queries without types with `expression` specified in them will get converted to the new [expression type](./docs/query-types.md#type-expression).