var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: update', function(){

    it('should update', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should not do funkiness with empty updates obj', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {}
      });

      assert.equal(
        query.toString()
      , 'update "users" where "users"."id" = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should update and return', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: ['id']
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id"'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should allow sub-expressions in returning', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: [
          'id'
        , { expression: '("orders"."datetime"::text) as datetime' }
        ]
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id", ("orders"."datetime"::text) as datetime'
      );
    });

    it('should allow sub-expressions with alias in returning', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: [
          'id'
        , { expression: '("orders"."datetime"::text)'
          , alias: 'datetime'
          }
        ]
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id", ("orders"."datetime"::text) as "datetime"'
      );
    });

    it('should throw error with invalid returning input', function(){
      assert.throws(
        function(){
          builder.sql({
            type: 'update'
          , table: 'users'
          , where: {
              id: 7
            }
          , updates: {
              name: 'Bob'
            , email: 'bob@bob.com'
            }
          , returning: 'id'
          });
        }
      , Error
      );
    });

    it('$inc', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          $inc: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" + $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('$inc many columns', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          $inc: { count: 5, age: 36 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" + $1, "age" = "users"."age" + $2 where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , [5, 36, 7]
      );
    });

    it('$dec', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          $dec: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" - $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('from string', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , from: 'other'
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 from "other"');
    });

    it('from array', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , from: ['other1', 'other2']
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 from "other1", "other2"');
    });

    it('from sub-query', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , from: {
          type: 'select'
        , table: 'bar'
        }
        , alias: 'foo'
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 from (select "bar".* from "bar") "foo"');
    });

    it('should update with null value', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        , description: null
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2, "description" = null where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

  });

  describe('Type: update with values', function(){

    it('should update', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should not do funkiness with empty values obj', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {}
      });

      assert.equal(
        query.toString()
      , 'update "users" where "users"."id" = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should update and return', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: ['id']
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id"'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('$inc', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          $inc: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" + $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('$inc many columns', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          $inc: { count: 5, age: 36 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" + $1, "age" = "users"."age" + $2 where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , [5, 36, 7]
      );
    });

    it('$dec', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          $dec: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" - $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('should update with null value', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        , description: null
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2, "description" = null where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should update with expression', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: {
            type: 'select'
          , columns: ['name']
          , table: 'users'
          , limit: 1
          }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = ( select "users"."name" from "users" limit $1 ) where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [1, 7]
      );
    });

    it('should update with function expression', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: {
            type: 'lower'
          , expression: 'users.name'
          }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = ( lower( users.name ) ) where "users"."id" = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should skip undefined in update', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: undefined
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });
  });
  describe('Type: update with $custom', function(){
    it('should insert a string unchanged if $custom is used', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , values: {
          $custom: {
            number_of_images: 'jsonb_array_length(images) + 1',
          }
        }
      });
      assert.equal(
        query.toString()
      , 'update "users" set "number_of_images" = jsonb_array_length(images) + 1'
      );
      assert.deepEqual(
        query.values
      , []
      );
    });
    it('should use the first value as a template and the rest as values if $custom is used with an array', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , values: {
          $custom: {
            images: ['$1::jsonb || images', JSON.stringify(['an_image.jpg'])],
          }
        }
      });
      assert.equal(
        query.toString()
      , 'update "users" set "images" = $1::jsonb || images'
      );
      assert.deepEqual(
        query.values
      , ['["an_image.jpg"]']
      );
    });
  });
});
