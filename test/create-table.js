var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: create table', function(){
    var query = builder.sql({
      type: 'create'
    , table: 'jobs'
    , ifDoesNotExist: true
    , definition: {
        id: {
          type: 'serial'
        , primaryKey: true
        }

      , name: {
          type: 'text'
        }

      , createdAt: {
          type: 'timestamp'
        }
      }
    });

    assert.equal(
      query.toString()
    , [ 'create table "jobs" ('
      , '"id" serial primary key, '
      , '"name" text, '
      , '"createdAt" timestamp'
      , ')'
      ].join('')
    );
  });
});