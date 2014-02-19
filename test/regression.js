/**
 * Regression Tests
 */

var assert = require('assert');
var builder = require('../');

describe('Regression Tests', function(){

  describe('Conditional builder', function(){

    it ('should treat dates as a value', function(){
      var query = builder.sql({
        type: 'update',
        table: 'blah',
        values: {name: 'brian'},
        where: {
          id: 1,
          birthday: new Date()
        }
      });

      assert.equal(
        query.toString()
      , 'update "blah" set "name" = $1 where "blah"."id" = $2 and "blah"."birthday" = $3'
      );

      assert.deepEqual(
        query.values
      , [
          query.original.values.name
        , query.original.where.id
        , query.original.where.birthday
        ]
      );
    });

    it('should treat buffers as a value', function() {
      var query = builder.sql({
        type: 'update',
        table: 'blah',
        values: {name: 'brian'},
        where: {
          id: new Buffer('f494f262c7f843e4a50e92219a175b2a', 'hex')
        }
      });

      assert.equal(
        query.toString()
      , 'update "blah" set "name" = $1 where "blah"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [
          query.original.values.name
        , query.original.where.id
        ]
      );
    });

    it ('should not improperly quote cast', function(){
      var query = builder.sql({
        type: 'select',
        table: 'blah',
        where: {
          'data->id::integer': 7
        }
      });

      assert.equal(
        query.toString()
      , 'select "blah".* from "blah" where "blah"."data"->\'id\'::integer = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

  });

});
