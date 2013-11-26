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

  });

});