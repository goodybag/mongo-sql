var
  assert        = require('assert')
, QueryBuilder  = require('../../lib/query-builder')
, users         = new QueryBuilder('users')
;

describe('Query Builder', function(){
  describe('users.update', function(){

    it('update where email is null by default return users.id', function(){
      var $query = { email: { $null: true } };

      var $update = { email: false };

      var options = { returning: ['id'] };

      var result = users.update($query, $update, options);

      assert.equal(
        result.query
      , 'update "users" set "email" = $1 where (("users"."email" is null)) returning "users"."id"'
      );

      assert.deepEqual(
        result.values
      , [false]
      );
    });
  });
});