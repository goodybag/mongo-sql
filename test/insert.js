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

    it('should do multi-insert with different keys', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: [
          { name: 'Bob', email: 'bob@bob.com' }
        , { name: 'Tom' }
        , { name: 'Pam', code: 'aas123' }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email", "code") values ($1, $2, DEFAULT), ($3, DEFAULT, DEFAULT), ($4, DEFAULT, $5)'
      );

      assert.deepEqual(
        query.values
      , [ query.original.values[0].name, query.original.values[0].email
        , query.original.values[1].name
        , query.original.values[2].name, query.original.values[2].code ]
      );
    });

    it('should throw an error from a blank array', function(){
      assert.throws(
        function(){
          builder.sql({
            type: 'insert'
          , table: 'users'
          , values: []
          });
        }
      , /MoSQL\.queryHelper\.values - Invalid values array length `0`$/
      );
    });

    it('should allow sub-expressions in returning', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
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
      , 'insert into "users" ("name", "email") values ($1, $2) returning "users"."id", ("orders"."datetime"::text) as datetime'
      );
    });

    it('should allow sub-expressions with alias in returning', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
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
      , 'insert into "users" ("name", "email") values ($1, $2) returning "users"."id", ("orders"."datetime"::text) as "datetime"'
      );
    });

    it('conflict', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , conflict: {
          target: {
            columns: ['email']
          }
        , action: {
            update: { name: '$excluded.name$' }
          , where: { id: { $lt: 100 } }
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'insert into "users" ("name", "email") '
        , 'values ($1, $2) '
        , 'on conflict ("email") do update '
        , 'set "name" = "excluded"."name" '
        , 'where "users"."id" < $3'
        ].join('')
      );

      // Do nothing
      query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , conflict: {
          target: {
            columns: ['email']
          }
        , action: 'nothing'
        }
      });

      assert.equal(
        query.toString()
      , [ 'insert into "users" ("name", "email") '
        , 'values ($1, $2) '
        , 'on conflict ("email") do nothing'
        ].join('')
      );

      // Specifying constraint name
      query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , conflict: {
          target: {
            constraint: 'users_pkey'
          }
        , action: {
            update: { name: '$excluded.name$' }
          , where: { id: { $lt: 100 } }
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'insert into "users" ("name", "email") '
        , 'values ($1, $2) '
        , 'on conflict on constraint "users_pkey" do update '
        , 'set "name" = "excluded"."name" '
        , 'where "users"."id" < $3'
        ].join('')
      );

      // Collation
      query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , conflict: {
          target: {
            columns: ['email']
          , collation: 'foo'
          }
        , action: {
            update: { name: '$excluded.name$' }
          , where: { id: { $lt: 100 } }
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'insert into "users" ("name", "email") '
        , 'values ($1, $2) '
        , 'on conflict ("email" collate foo) do update '
        , 'set "name" = "excluded"."name" '
        , 'where "users"."id" < $3'
        ].join('')
      );

      // Opclasses
      query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , conflict: {
          target: {
            columns: ['email']
          , collation: 'foo'
          , opclass: ['foo', 'bar']
          }
        , action: {
            update: { name: '$excluded.name$' }
          , where: { id: { $lt: 100 } }
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'insert into "users" ("name", "email") '
        , 'values ($1, $2) '
        , 'on conflict ("email" collate foo foo, bar) do update '
        , 'set "name" = "excluded"."name" '
        , 'where "users"."id" < $3'
        ].join('')
      );
    });

    it('should skip undefined in insert', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: undefined
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name") values ($1)'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });

    it('should skip undefined in multi-insert', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: [
          { name: 'Bob', email: undefined }
        , { name: undefined, email: 'tom@tom.com' }
        , { name: 'Pam' }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, DEFAULT), (DEFAULT, $2), ($3, DEFAULT)'
      );

      assert.deepEqual(
        query.values
      , [ query.original.values[0].name, query.original.values[1].email, query.original.values[2].name ]
      );
    });
  });
});
