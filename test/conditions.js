var assert  = require('assert');
var builder = require('../');

describe('Conditions', function(){

  it ('should build a query selecting on users where id = $1', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: 5 }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" = $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('should build a query selecting on users where id = $1 and name = $2', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: 5, name: 'Bob' }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" = $1 and "users"."name" = $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Bob']
    );
  });

  it ('should use boolean syntax', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { isAwesome: true }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."isAwesome" is true'
    );

    assert.deepEqual(
      query.values
    , []
    );

    query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { isAwesome: false }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."isAwesome" is false'
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should build a query selecting on users where id = $1 or name = $2', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $or: { id: 5, name: 'Bob' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" = $1 or "users"."name" = $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Bob']
    );
  });

  it ('$gt', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $gt: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" > $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$gt multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $gt: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" > $1 and "users"."name" > $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$gte', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $gte: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" >= $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$gte multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $gte: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" >= $1 and "users"."name" >= $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$lt', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $lt: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" < $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$lt multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $lt: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" < $1 and "users"."name" < $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$lte', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $lte: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" <= $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$lte multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $lte: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" <= $1 and "users"."name" <= $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$null', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $null: true } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" is null'
    );
  });

  it ('should use $null when value is null', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: null }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" is null'
    );
  });

  it ('$notNull', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $notNull: true } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" is not null'
    );
  });

  it ('$like', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { name: { $like: 'Bobo' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" like $1'
    );

    assert.deepEqual(
      query.values
    , ['Bobo']
    );
  });

  it ('$ilike', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { name: { $ilike: 'Bobo' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" ilike $1'
    );

    assert.deepEqual(
      query.values
    , ['Bobo']
    );
  });

  it ('$in', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $in: {
            type: 'select'
          , table: 'groups'
          , columns: ['userId']
          , where: { "groupId": 5 }
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where ' +
      '"users"."id" in (' +
        'select "groups"."userId" from "groups" where ' +
          '"groups"."groupId" = $1)'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$in array', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $in: [1, 2, 3]
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where ' +
      '"users"."id" in ($1, $2, $3)'
    );

    assert.deepEqual(
      query.values
    , [1, 2, 3]
    );
  });

  it ('$nin', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $nin: {
            type: 'select'
          , table: 'groups'
          , columns: ['userId']
          , where: { "groupId": 5 }
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where ' +
      '"users"."id" not in (' +
        'select "groups"."userId" from "groups" where ' +
          '"groups"."groupId" = $1)'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$nin array', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $nin: [1, 2, 3]
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where ' +
      '"users"."id" not in ($1, $2, $3)'
    );

    assert.deepEqual(
      query.values
    , [1, 2, 3]
    );
  });

  it ('should allow an arbitrary amount of conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        name: 'Bob'
      , id: { $lt: 500 }
      , groupId: { $equals: 7 }
      , another: { $or: [1, 2, 3, 4] }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" = $1 and "users"."id" < $2 and "users"."groupId" = $3 and ("users"."another" = $4 or "users"."another" = $5 or "users"."another" = $6 or "users"."another" = $7)'
    );

    assert.deepEqual(
      query.values
    , ['Bob', 500, 7, 1, 2, 3, 4]
    );
  });

  it ('should inline custom conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        name: { $like: 'Bob' }
      , $custom: ['"users"."createdAt" > now() - interval $1 month', 5]
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" like $1 and "users"."createdAt" > now() - interval $2 month'
    );

    assert.deepEqual(
      query.values
    , ['Bob', 5]
    );
  });

  it ('should handle interpolating custom parameters', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        name: { $like: 'Bob' }
      , $custom: ['$1 $2 $3 $4', 5, 6, 7, 8]
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" like $1 and $2 $3 $4 $5'
    );

    assert.deepEqual(
      query.values
    , ['Bob', 5, 6, 7, 8]
    );
  });

  it ('$years_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $years_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 year'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$years_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $years_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 year and "users"."somethingElse" >= now() - interval $2 year'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$months_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $months_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 month'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$months_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $months_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 month and "users"."somethingElse" >= now() - interval $2 month'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$days_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $days_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 day'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$days_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $days_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 day and "users"."somethingElse" >= now() - interval $2 day'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$hours_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $hours_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 hour'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$hours_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $hours_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 hour and "users"."somethingElse" >= now() - interval $2 hour'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$minutes_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $minutes_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 minute'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$minutes_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $minutes_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 minute and "users"."somethingElse" >= now() - interval $2 minute'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$seconds_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $seconds_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 second'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$seconds_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $seconds_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 second and "users"."somethingElse" >= now() - interval $2 second'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('Should have no conditions if where is an empty object', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {}
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users"'
    );
  });

  describe('JSON Operators', function(){

    it ('Should Get JSON object field', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it ('Should Get JSON array element', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->1': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->1 = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it ('Should Get JSON array element as text', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->>5': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->>5 = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it ('Should Get JSON object field as text', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->>name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->>\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it ('Should operate on JSON text and cast the column', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data::json->name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"::json->\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it ('Should operate on JSON text and cast the column and specify table', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'other_table.data::json->name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "other_table"."data"::json->\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it ('Should operate on JSON and play nicely with other helpers', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->name': 'Bob'
        , $or: {
            id: 7
          , 'data->other_id': 'blah'
          , 'data::hstore->other_thing': { $gt: 'bill' }
          }
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"->\'name\' = $1 and '
        , '("users"."id" = $2 or "users"."data"->\'other_id\' = $3 or '
        , '"users"."data"::hstore->\'other_thing\' > $4)'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , ['Bob', 7, 'blah', 'bill']
      );
    });

    it ('Should be able to go deep', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->3->records->4->id': 27
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"->3->\'records\'->4->\'id\' = $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [27]
      );
    });

    it ('Should be able to go deep with array syntax', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data#>{3,records,4,id}': 27
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"#>\'{3,records,4,id}\' = $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [27]
      );
    });

    it ('Should not double quote things already quoted', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->\'3\'': 27
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"->\'3\' = $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [27]
      );
    });
  });

  it ('should cast', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        'my_column::some_type': 27
      }
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" where '
      , '"users"."my_column"::some_type = $1'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , [27]
    );
  });

});
