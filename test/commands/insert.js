var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, users         = new QueryBuilder('users')
;

describe('Query Builder', function(){
  describe('users.insert', function(){

    it('by default return users.id', function(){
      var user = {
        email:      'test@test.com'
      , password:   'password'
      , firstName:  'Turd'
      , lastName:   'Ferguson'
      };

      var result = users.insert(user);
      assert.equal(
        result.query
      , 'insert into "users" ("email", "password", "firstName", "lastName") values ($1, $2, $3, $4) returning "users"."id"'
      );

      assert.deepEqual(
        result.values
      , [user.email, user.password, user.firstName, user.lastName]
      );
    });

    it('by return users.id, user.email, user.firstName without quoting or specifying collection', function(){
      var user = {
        email:      'test@test.com'
      , password:   'password'
      , firstName:  'Turd'
      , lastName:   'Ferguson'
      };

      var returning = ['id', 'email', 'firstName'];

      var result = users.insert(user, { returning: returning });
      assert.equal(
        result.query
      , 'insert into "users" ("email", "password", "firstName", "lastName") values ($1, $2, $3, $4) returning "users"."id", "users"."email", "users"."firstName"'
      );

      assert.deepEqual(
        result.values
      , [user.email, user.password, user.firstName, user.lastName]
      );
    });

    it('by return users.id, user.firstName quoting, but not specifying the collection', function(){
      var user = {
        email:      'test@test.com'
      , password:   'password'
      , firstName:  'Turd'
      , lastName:   'Ferguson'
      };

      var returning = ['"id"', '"firstName"'];

      var result = users.insert(user, { returning: returning });
      assert.equal(
        result.query
      , 'insert into "users" ("email", "password", "firstName", "lastName") values ($1, $2, $3, $4) returning "users"."id", "users"."firstName"'
      );

      assert.deepEqual(
        result.values
      , [user.email, user.password, user.firstName, user.lastName]
      );
    });
  });
});