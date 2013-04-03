var
  assert        = require('assert')
, utils         = require('../lib/utils')
, QueryBuilder  = require('../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

describe('Query Builder', function(){
  describe('collection.find', function(){

    it('{ id: 5 }', function(){
      assert.equal(
        collection.find({ id: 5 })
      , 'select "collection".* from "collection" where ("id" = 5)'
      );
    });

    it('5', function(){
      assert.equal(
        collection.find(5)
      , 'select "collection".* from "collection" where ("id" = 5)'
      );
    });

    it('{ $gt: { id: 5, other: 10 } }', function(){
      assert.equal(
        collection.find({ $gt: { id: 5, other: 10 } })
      , 'select "collection".* from "collection" where (("id" > 5 and "other" > 10))'
      );
    });

    it('{ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] }', function(){
      assert.equal(
        collection.find({ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] })
      , 'select "collection".* from "collection" where ((("a" = 5 and "b" = 6) or ("c" = 7 and "d" = 8)))'
      );
    });

    it('{ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] }', function(){
      assert.equal(
        collection.find({ $or: [{ a: { $gt: 7 } }, { c: 7, d: 8 }] })
      , 'select "collection".* from "collection" where (((("a" > 7)) or ("c" = 7 and "d" = 8)))'
      );
    });

    it('{ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] }', function(){
      assert.equal(
        collection.find({ id: { $in: collection.find({ id: { $gt: 5 } }, { fields: ['id'] }) } })
      , 'select "collection".* from "collection" where (("id" in (select id from "collection" where (("id" > 5)))))'
      );
    });
  });
});