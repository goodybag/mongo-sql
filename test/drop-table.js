var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: create table', function(){

    it('it should drop a table', function(){
      var query = builder.sql({
        type: 'drop-table'
      , table: 'jobs'
      });

      assert.equal(
        query.toString()
      , 'drop table "jobs"'
      );
    });

    it('it should drop multiple tables', function(){
      var query = builder.sql({
        type: 'drop-table'
      , table: ['jobs', 'users']
      });

      assert.equal(
        query.toString()
      , 'drop table "jobs", "users"'
      );
    });

    it('it should drop a table and cascade', function(){
      var query = builder.sql({
        type: 'drop-table'
      , table: 'jobs'
      , cascade: true
      });

      assert.equal(
        query.toString()
      , 'drop table "jobs" cascade'
      );
    });

    it('it should drop a table if it exists', function(){
      var query = builder.sql({
        type: 'drop-table'
      , table: 'jobs'
      , ifExists: true
      });

      assert.equal(
        query.toString()
      , 'drop table if exists "jobs"'
      );
    });
  });
});