var
  assert        = require('assert')
, mongosql      = require('../')
, QueryBuilder  = require('../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

describe('Value Behavoirs', function(){

  describe('Registration', function(){

    it('should register $minus', function(){

      mongosql.valueHelper('$minus', function(column, value, values, collection){
        return value[0] + " - $" + values.push(value[1]);
      });

      var result = collection.find({ id: { $minus: ['another', 1] } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" = another - $1)'
      );

      assert.deepEqual(
        result.values
      , [1]
      );

    });

  });

  describe('$custom', function(){

    it('{ createdAt: { $gt: { $custom: ["now() - interval $1 hour", 5] } } }', function(){
      var result = collection.find({ createdAt: { $gt: { $custom: ["now() - interval $1 hour", 5] } } });
      
      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."createdAt" > now() - interval $1 hour)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ some_value: 7, other_value: 8, createdAt: { $gt: { $custom: ["now() - interval $1 hour", 5] } } }', function(){
      var result = collection.find({ some_value: 7, other_value: 8, createdAt: { $gt: { $custom: ["now() - interval $1 hour", 5] } } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."some_value" = $1 and "collection"."other_value" = $2) and ("collection"."createdAt" > now() - interval $3 hour)'
      );

      assert.deepEqual(
        result.values
      , [7, 8, 5]
      );
    });

    it('{ createdAt: { $gt: { $custom: ["now() - interval $1 hour", 5] } } }', function(){
      var result = collection.find({ createdAt: { $gt: { $custom: { value: "now() - interval $1 hour", values: [5] } } } });
      
      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."createdAt" > now() - interval $1 hour)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

  });

  describe('$time_ago', function(){

    it('{ createdAt: { $gt: { $time_ago: { type: "hour", value: 5 } } } }', function(){
      var result = collection.find({ createdAt: { $gt: { $time_ago: { type: "hour", value: 5 } } } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."createdAt" > now() - interval $1 hour)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

  });

  describe('$hours_ago', function(){

    it('{ id: { $gt: { $hours_ago: 5 }  } }', function(){
      var result = collection.find({ id: { $gt: { $hours_ago: 5 }  } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" > now() - interval $1 hour)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ $gt: { id: { $hours_ago: 5 } } }', function(){
      var result = collection.find({ $gt: { id: { $hours_ago: 5 } } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."id" > now() - interval $1 hour)'
      );

      assert.deepEqual(
        result.values
      , [5]
      );
    });

    it('{ $gt: { id: { $hours_ago: 5 }, other: 6 } }', function(){
      var result = collection.find({ $gt: { id: { $hours_ago: 5 }, other: 6 } });

      assert.equal(
        result.query
      , 'select "collection".* from "collection" where ("collection"."other" > $1) and ("collection"."id" > now() - interval $2 hour)'
      );

      assert.deepEqual(
        result.values
      , [6,5]
      );
    });

  });

});