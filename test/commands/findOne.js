var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

describe('Query Builder', function(){
  describe('collection.findOne', function(){

    it('5', function(){
      var result = collection.findOne(5);

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("id" = $1) limit 1'
      );

      assert.equal(
        result.values
      , [5]
      );
    });

    it('{ id: 5 }', function(){
      var result = collection.findOne({ id: 5 });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("id" = $1) limit 1'
      );

      assert.equal(
        result.values
      , [5]
      );
    });

    it('{ $gt: { id: 5, other: 10 } }', function(){
      var result = collection.findOne({ $gt: { id: 5, other: 10 } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where (("id" > $1 and "other" > $2)) limit 1'
      );

      assert.equal(
        result.values
      , [5, 10]
      );
    });

    it('{ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] }', function(){
      var result = collection.findOne({ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ((("a" = $1 and "b" = $2) or ("c" = $3 and "d" = $4))) limit 1'
      );

      assert.equal(
        result.values
      , [5, 6, 7, 8]
      );
    });

    it('{ $or: [{ a: { $gt: 7 } }, { c: 7, d: 8 }] }', function(){
      var result = collection.findOne({ $or: [{ a: { $gt: 7 } }, { c: 7, d: 8 }] });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where (((("a" > $1)) or ("c" = $2 and "d" = $3))) limit 1'
      );

      assert.equal(
        result.values
      , [7, 7, 8]
      );
    });

    it("{ id: { $in: collection.find({ id: { $gt: 5 } }, { fields: ['id'] }) } }", function(){
      var result = collection.findOne({ id: { $in: collection.find({ id: { $gt: 5 } }, { fields: ['id'] }) } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where (("id" in (select id from "collection" where (("id" > $1))))) limit 1'
      );

      assert.equal(
        result.values
      , [5]
      );
    });
    
  });
});