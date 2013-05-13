var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: delete', function(){

    it('should delete', function(){
      var query = builder.sql({
        type: 'delete'
      , table: 'users'
      , where: {
          id: 7
        }
      });

      assert.equal(
        query.toString()
      , 'delete from "users" where "users"."id" = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should insert and return', function(){
      var query = builder.sql({
        type: 'delete'
      , table: 'users'
      , where: {
          id: 7
        }
      , returning: ['name']
      });

      assert.equal(
        query.toString()
      , 'delete from "users" where "users"."id" = $1 returning "users"."name"'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

  });
});