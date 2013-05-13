var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: insert', function(){

    it('should insert', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2)'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com']
      );
    });

    it('should insert and return', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: ['id']
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2) returning "users"."id"'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com']
      );
    });

  });
});