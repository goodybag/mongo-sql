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

  it('expressions should allow for nested values', function(){
    var query = builder.sql({
      type: 'select',
      table: 'blah',
      where: { foo: 'bar', bar: 'baz', $custom: ['$1 = $2 or $2 = $1', 21, 22] },
      with: [
        { type: 'expression',
          name: 'something',
          expression: {
            expression: 'select $1, $2, $2, $1',
            values: [11, 12]
          }
        },
        { type: 'expression',
          name: 'something_else',
          expression: {
            expression: 'select $4, $3, $2, $1',
            values: [13, 14, 15, 16]
          }
        }
      ],
      groupBy: ['foo', {
        expression: {
          expression: 'bar $1 $2',
          values: [123, 234]
        }
      }]
    });

    assert.equal(
      query.toString()
    , 'with "something" as (select $1, $2, $2, $1), ' +
      '"something_else" as (select $3, $4, $5, $6) ' +
      'select "blah".* from "blah" ' +
      'where "blah"."foo" = $7 and "blah"."bar" = $8 and $9 = $10 or $10 = $9 ' +
      'group by "blah"."foo", bar $11 $12'
    );

    assert.deepEqual(
      query.values
    , [11, 12, 16, 15, 14, 13, 'bar', 'baz', 21, 22, 123, 234]
    );
  });
});
