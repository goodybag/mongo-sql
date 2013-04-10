var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

describe('Query Builder', function(){
  describe('collection.remove', function(){

    it('5', function(){
      var result = collection.remove(5);

      assert.equal(
        result.query
      , 'delete from "collection" where ("collection"."id" = $1)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ id: 5 }', function(){
      var result = collection.remove({ id: 5 });

      assert.equal(
        result.query
      , 'delete from "collection" where ("collection"."id" = $1)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });
  });
});