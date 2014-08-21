var assert  = require('assert');
var builder = require('../');

describe('Helpers', function(){

  describe('Types', function(){
    it('should add a query type', function(){
      builder.registerQueryType('users', 'select * from users {where}');

      var query = builder.sql({
        type: 'users'
      , table: 'users'
      , where: { id: { $gt: 7 } }
      });

      assert.equal(
        query.toString()
      , 'select * from users where "users"."id" > $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should return all registerd types', function(){
      var list = builder.queryTypes.list;
      assert.ok(Array.isArray(list));
    });
  });

  describe('Query Helpers', function(){
    it('should add a query type', function(){
      builder.registerQueryType(
        'findOne'
      , 'select {columns} from {table} {whereId}'
      );

      builder.registerQueryHelper('whereId', function(id, values, query){
        return 'where "' + query.__defaultTable + '".id = $' + values.push(id);
      });

      var query = builder.sql({
        type: 'findOne'
      , columns: ['*']
      , table: 'users'
      , whereId: 8
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users".id = $1'
      );

      assert.deepEqual(
        query.values
      , [8]
      );
    });
  });

  describe('Conditional Helpers', function(){
    it('should add a query helper', function(){
      builder.registerConditionalHelper('$similarTo', function(column, value){
        return column + ' similar to ' + value;
      });

      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          name: { $similarTo: 'Bob' }
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."name" similar to $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      );
    });
  });

});