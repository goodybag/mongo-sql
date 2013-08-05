var assert  = require('assert');
var builder = require('../');

describe('toQuery', function() {

    var testResult = function(result, expectedText, expectedValues) {
      it('should have correct properties', function() {
        assert(result.text, 'query result should have text property');
        assert(result.values, 'query result should have values property');
      });

      it('has correct text', function() {
        assert.equal(result.text, expectedText);
      });

      it('has correct values', function() {
        assert.equal(result.values.length, expectedValues.length);
        for(var i = 0; i < expectedValues.length; i++) {
          assert.equal(result.values[i], expectedValues[i]);
        }
      });
    };


    describe ('toQuery without values', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      }).toQuery();

      testResult(query, 'select "users".* from "users"', []);
    });

    describe('toQuery with values', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: { id: 5 }
      }).toQuery();

      var expectedText = 'select "users".* from "users" where "users"."id" = $1';
      var expectedValues = [5];
      testResult(query, expectedText, expectedValues);
    });

    describe('toQuery on builder object', function() {
      var query = builder.toQuery({
        type: 'select'
      , table: 'users'
      , where: { id: 5 }
      });
      var expectedText = 'select "users".* from "users" where "users"."id" = $1';
      var expectedValues = [5];
      testResult(query, expectedText, expectedValues);
    });
});
