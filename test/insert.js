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

    it('should insert with values from a subquery', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , columns: [ 'name', 'email' ]
      , expression: {
          type: 'select'
        , table: 'other_users'
        , columns: [ 'name', 'email' ]
        , where: { id: 7 }
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") (select "other_users"."name", "other_users"."email" from "other_users" where "other_users"."id" = $1)'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should insert with a value from a subquery', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: {
            type: 'select'
          , table: 'other_users'
          , columns: [ 'email' ]
          , where: { id: 7 }
          }
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, (select "other_users"."email" from "other_users" where "other_users"."id" = $2))'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 7]
      );
    });

    it('should insert with a null value', function() {
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        , description: null
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email", "description") values ($1, $2, null)'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com']
      );
    });

    it('should do multi-insert', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: [
          { name: 'Bob', email: 'bob@bob.com' }
        , { name: 'Tom', email: 'tom@tom.com' }
        , { name: 'Pam', email: 'pam@pam.com' }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2), ($3, $4), ($5, $6)'
      );

      assert.deepEqual(
        query.values
      , [ query.original.values[0].name, query.original.values[0].email
        , query.original.values[1].name, query.original.values[1].email
        , query.original.values[2].name, query.original.values[2].email ]
      );
    });

  });
});
