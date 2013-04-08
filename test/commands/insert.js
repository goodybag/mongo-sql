var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, users         = new QueryBuilder('users')
;

describe('Query Builder', function(){
  describe('users.insert', function(){

    it('insert user', function(){
      var user = {
        email:      'test@test.com'
      , password:   'password'
      , firstName:  'Turd'
      , lastName:   'Ferguson'
      };

      var result = users.insert(user);

      assert.equal(
        result.query
      , 'insert into "users" ("email", "password", "firstName", "lastName") values ($1, $2, $3, $4) returning "collection"."id"'
      );

      assert.deepEqual(
        result.values
      , [user.email, user.password, user.firstName, user.lastName]
      );
    });
  });
});