# Access HStore and JSON fields

First off, I suggest you read [this page on JSON functions and operators](http://www.postgresql.org/docs/9.3/static/functions-json.html) for Postgres. Then you'll get a sense of why this part of the DSL is the way that it is.

In MoSQL, at least in conditiona clauses, we treat JSON and HStore operators as an entire column. This makes it easy to work within the existing helper system. There are multiple trade-offs, but ultimately, this is the syntax we went with:

```javascript
{
  type: 'select'
, table: 'users'
, where: {
    // Simple text
    'data->name': 'Bob'

    // Access array
  , 'data->5': 'Bob'

    // Access field as text
  , 'data->>name': 'Bob'
  , 'data->>1': 'Bob'

    // Casting fields
  , 'data::json->id': 7
  , 'my_column::some_other_type': 'Blah'

    // Deep object resolution
  , 'data->3->records->\'4\'->id': 27

    // Deep access with array syntax
  , 'data#>{3,records,4,id}': 27
  }
}
```

```sql
select "users".* from "users" where
    "users"."data"->'name' = 'Bob'
and "users"."data"->5 = 'Bob'
and "users"."data"->>'name' = 'Bob'
and "users"."data"->>1 = 'Bob'
and "users"."data"::json->'id' = 'Bob'
and "users"."my_column"::some_other_type = 'Blah'
and "users"."data"->3->records->'4'->id = 27
and "users"."data"data#>'{3,records,4,id}' = 27
```