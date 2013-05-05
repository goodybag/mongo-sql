var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, collection    = new QueryBuilder('collection')
, other         = new QueryBuilder('other')
;

describe('Query Builder', function(){
  describe('collection.find', function(){

    it('5', function(){
      var result = collection.find(5);

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" = $1)'
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
      , 'select "collection".* from "collection" where ("collection"."id" = $1)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ $gt: { id: 5, other: 10, another: 6 } }', function(){
      var result = collection.find({ $gt: { id: 5, other: 10, another: 6 } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" > $1 and "collection"."other" > $2 and "collection"."another" > $3)'
      );

      assert.deepEqual(
        result.values
      , [5, 10, 6]
      );
    });

    it('{ some_value: 7, other_value: 8, createdAt: { $gt: 5 } }', function(){
      var result = collection.find({ some_value: 1, other_value: 2, another_value: { $gt: 3 } });
      
      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."some_value" = $1 and "collection"."other_value" = $2) and ("collection"."another_value" > $3)'
      );

      assert.deepEqual(
        result.values
      , [1, 2, 3]
      );
    });

    it('{ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] }', function(){
      var result = collection.find({ $or: [{ a: 5, b: 6 }, { c: 7, d: 8 }] });
      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."a" = $1 and "collection"."b" = $2) or ("collection"."c" = $3 and "collection"."d" = $4)'
      );

      assert.deepEqual(
        result.values
      , [5, 6, 7, 8]
      );
    });

    it('{ $or: [{ a: { $gt: 1 } }, { c: 2, d: 3 }] }', function(){
      var result = collection.find({ $or: [{ a: { $gt: 1 } }, { c: 2, d: 3 }] });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."c" = $1 and "collection"."d" = $2) or ("collection"."a" > $3)'
      );

      assert.deepEqual(
        result.values
      , [2,3,1]
      );
    });

    it("{ id: { $in: collection.find({ id: { $gt: 5 } }, { fields: ['id'] }) } }", function(){
      var result = collection.find({
        id: {
          $in: other.find(
            { id: { $gt: 5 } }
          , { fields: ['id'], defer: true }
          )
        , $gt: 10
        }
      });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" in (select id from "other" where ("other"."id" > $1)) and "collection"."id" > $2)'
      );

      assert.deepEqual(
        result.values
      , [5, 10]
      );
    });

    it('should join', function(){
      var result  = collection.find({}, {
        join: {
          other: { collectionId: 'collection.id' }
        }
      });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" join "other" on ("other"."collectionId" = "collection"."id")'
      );

      assert.deepEqual(
        result.values
      , []
      );
    });

    it('should left join', function(){
      var result  = collection.find({}, {
        leftJoin: {
          other: { collectionId: 'collection.id' }
        }
      });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" left join "other" on ("other"."collectionId" = "collection"."id")'
      );

      assert.deepEqual(
        result.values
      , []
      );
    });

    it('should inner join', function(){
      var result  = collection.find({}, {
        innerJoin: {
          other: { collectionId: 'collection.id' }
        }
      });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" inner join "other" on ("other"."collectionId" = "collection"."id")'
      );

      assert.deepEqual(
        result.values
      , []
      );
    });

    it('should full outer join', function(){
      var result  = collection.find({}, {
        fullOuterJoin: {
          other: { collectionId: 'collection.id' }
        }
      });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" full outer join "other" on ("other"."collectionId" = "collection"."id")'
      );

      assert.deepEqual(
        result.values
      , []
      );
    });
  });
});