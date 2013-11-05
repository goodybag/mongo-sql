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
}
```
