# Documentation

MoSQL is largely based on helper registration. Most functionality is achieved through simple single-purpose functions. As such, this documentation primarily focuses on the different types of MoSQL helpers:

* [Query Types](./query-types.md)
* [Query Helpers](./query-helpers.md)
* [Conditional Helpers](./conditional-helpers.md)
* [Update Helpers](./update-helpers.md)
* [Column Definitions](./column-definitions.md)
* [Actions](./action-helpers.md)

## Making a Query

There are two main components to building a query:

* Selecting a [query type](./query-types.md)
* Filling in the details with [query helpers](./query-helpers.md)

```javascript
{
  type: 'insert' // <- Your query type
  /* ... */
}
```

Our query type is [insert](./query-types.md#type-insert). Looking at the type definition we see the following available helpers denoted by brackets:

```
{with} insert into {table} {columns} {values} {expression} {returning}
```

Specifying a helper in your query will run the corresponding helper function and replace the `{helper}` with the result of the function.

```javascript
// => insert into "users" ("name", "hobbies") values ($1, $2)
{
  type: 'insert'
, table: 'users'
, values: {
    name: 'Bob'
  , hobbies: ['Baking', 'Skiiing', 'LARPing']
  }
}
```

Some helpers will accept sub-queries. In this way, queries can easily be composed:

```javascript
// Insert with values from a select
{
  type: 'insert'
, table: 'users'
, columns: [ 'name', 'email' ]
, expression: {
    type: 'select'
  , table: 'other_users'
  , columns: [ 'name', 'email' ]
  , where: { id: 7 }
  }
}
```

If you need to cast a column to some other type, that is also possible:

```javascript
{
  type: 'select'
, table: 'users'
, where: { 'some_id::int': 7 }
}
```

### Access JSON and HStore fields

See [this document](./access-hstore-and-json-fields.md).

## Root API

### mosql.sql( query, [values] )

Convert a mosql query object to mosql query result interface object of the structure:

```javascript
{
  query       // The resulting sql string
, values:     // The array of parameterized values
, toString(): // Function for returning the sql string
, toQuery():  // Function for returning the sql string
}
```

The two functions ```toString``` and ```toQuery``` are convenience methods for other librarlies like node-pg.

### mosql.registerQueryType( name, definition )

[See query type docs](https://github.com/goodybag/mongo-sql/blob/master/docs/query-types.md#mosqlregisterquerytype-name-definition-)

### mosql.registerQueryHelper( name, [options], callback )

[See query helper docs](https://github.com/goodybag/mongo-sql/blob/master/docs/query-helpers.md#mosqlregisterqueryhelper-name-options-callback-)

### mosql.conditionalHelpers.add( name, [options], callback )

[See conditional helper docs](https://github.com/goodybag/mongo-sql/blob/master/docs/conditional-helpers.md#mosqlconditionalhelpersadd-name-options-callback-)

### mosql.columnDefinitions.add( name, callback )

[See column definition docs](https://github.com/goodybag/mongo-sql/blob/master/docs/column-definitions.md#mosqlcolumndefinitionsadd-name-callback-)

### mosql.registerActionHelper( name, callback )

[See action helpers docs](https://github.com/goodybag/mongo-sql/blob/master/docs/action-helpers.md#mosqlregisteractionhelper-name-callback-)

### mosql.registerUpdateHelper( name, [options], callback )

[See update helpers docs](https://github.com/goodybag/mongo-sql/blob/master/docs/update-helpers.md#mosqlregisterupdatehelper-name-options-callback-)

### mosql.quoteObject( field[, table[, schema[, database]]] )

Returns sql quoted column or object string string

**Examples:**

```javascript
mosql.quoteObject('name')                             // => "users"
mosql.quoteObject('name', 'users')                    // => "users"."name"
mosql.quoteObject('name', 'users', 'person', 'my_db') // => "my_db"."person"."users"."name"
mosql.quoteObject('my_db.person.users.name')          // => "my_db"."person"."users"."name"
mosql.quoteObject('users.name')                       // => "users"."name"
mosql.quoteObject('*', 'users')                       // => "users".*
mosql.quoteObject('users.*')                          // => "users".*
mosql.quoteObject('users.data::json->id')             // => "users"."data"::json->'id'
```
