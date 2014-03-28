# Update Helpers

Update helpers are used in [updates](./query-helpers.md#helper-updates) and [values](./query-helpers.md#helper-updates). They're only used in the values helper if the query type is [update](./query-types.md#type-update).

They're a lot simpler than [conditional helpers](./conditional-helpers.md). No cascading. The amount of helpers provided for updates out of the box is currently lacking. There's a ton of cool stuff that could be done, so submit a pull request!

Check out the [Playground](http://mosql.j0.hn/#/snippets/1n).

### Helper: '$inc'

___Format:___ ```col = col + val```

Increment column by value.

__Example:__

```javascript
{
  type: 'update'
, table: 'users'
, where: {
    id: 7
  }
, updates: {
    $inc: { hp: 5 }
  }
}
```

```sql
update "users"
  set "hp" = "users"."hp" + $1
where "users"."id" = $2
```

### Helper: '$dec'

___Format:___ ```col = col - val```

Decrement column by value.

__Example:__

```javascript
{
  type: 'update'
, table: 'users'
, where: {
    id: 7
  }
, updates: {
    $dec { hp: 5 }
  }
}
```

```sql
update "users"
  set "hp" = "users"."hp" - $1
where "users"."id" = $2
```

## Registering your own Update Helpers

Update helpers use the standard MoSQL helper interface, so it's just like adding other helpers.

### mosql.registerUpdateHelper( name, [options], callback )

Alias for ```mosql.updateHelpers.add```.

### mosql.updateHelpers.add( name, [options], callback )

Registers a new update helper.

Callbacks arguments are: ```callback( value, values, table, query )```

__Arguments:__

* __Value__ - The value to be used for update.
* __Values__ - The values array. All values not escaped by surrounding '$' signs are pushed to the values array for parameterized queries.
* __Table__ - The table associated to the column
* __Query__ - This is the whole MoSQL query object passed in by the user.

__Example:__

```javascript
var mosql = require('mongo-sql');

/**
 * Increment column
 * Example:
 *  { $inc: { clicks: 1 } }
 * @param  {Object} Hash whose keys are the columns to inc and values are how much it will inc
 */
mosql.registerUpdateHelper('$inc', function(value, values, collection){
  return Object.keys( value ).map( function( key ){
    return [
      // Quote the column without the table
      mosql.utils.quoteObject( key )
    , '='
      // Quote column with the table
    , mosql.utils.quoteObject( key, table )
      // Push the value into the values array
    , '+ $' + values.push( value[ key ] )
    ].join(' ');
  }).join(' ');
});
```

### mosql.updateHelpers.has( name )

Returns a boolean denoting whether or not a update helper exists.

### mosql.updateHelpers.get( name )

Returns the update helper interface: ```{ fn, options }```.
