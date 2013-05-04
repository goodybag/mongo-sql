var
  assert        = require('assert')
, mongosql      = require('../')
, QueryBuilder  = require('../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

describe('Conditional Behaviors', function(){

  describe('Registration', function(){

    it('should register $between', function(){

      mongosql.conditionalHelper('$between', function(column, value, values, collection){
        
        // return column + " > $" + values.push(value[0]) + " and " + column + " < $" + values.push(value[1]);
      });

      var result = collection.find({ id: { $between: [1, 2] } });
console.log(result.query);
      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" > $1 and "collection"."id" < $2)'
      );

      assert.deepEqual(
        result.values
      , [1, 2]
      );

    });

  });

});