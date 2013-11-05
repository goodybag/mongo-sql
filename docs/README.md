# Documentation

MoSQL is largely based on helper registration. Most functionality is achieved through simple single-purpose functions. As such, this documentation primarily focuses on the different types of MoSQL helpers:

* [Query Types](./query-types.md)
* [Query Helpers](./query-helpers.md)
* [Conditional Helpers](./conditional-helpers.md)
* [Update Helpers](./update-helpers.md)
* [Column Definitions](./column-definitions.md)
* [Actions](./action-helpers.md)

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
