var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

describe('Query Builder', function(){
  describe('collection.find', function(){

    it('5', function(){
      var result = collection.find(5);

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("id" = $1)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ id: 5 }', function(){
      var result = collection.find({ id: 5 });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("id" = $1)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ $gt: { id: 5, other: 10 } }', function(){
      var result = collection.find({ $gt: { id: 5, other: 10 } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where (("id" > $1 and "other" > $2))'
      );

      assert.deepEqual(
        result.values
      , [5, 10]
      );
    });

    it('{ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] }', function(){
      var result = collection.find({ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ((("a" = $1 and "b" = $2) or ("c" = $3 and "d" = $4)))'
      );

      assert.deepEqual(
        result.values
      , [5, 6, 7, 8]
      );
    });

    it('{ $or: [{ a: { $gt: 7 } }, { c: 7, d: 8 }] }', function(){
      var result = collection.find({ $or: [{ a: { $gt: 7 } }, { c: 7, d: 8 }] });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where (((("a" > $1)) or ("c" = $2 and "d" = $3)))'
      );

      assert.deepEqual(
        result.values
      , [7, 7, 8]
      );
    });

    it("{ id: { $in: collection.find({ id: { $gt: 5 } }, { fields: ['id'] }) } }", function(){
      var result = collection.find({
        id: {
          $in: collection.find(
            { id: { $gt: 5 } }
          , { fields: ['id'], defer: true }
          )
        , $gt: 10
        }
      });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where (("id" in (select id from "collection" where (("id" > $1))) and "id" > $2))'
      );

      assert.deepEqual(
        result.values
      , [5, 10]
      );
    });
  });
});