var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: create table', function(){

    it('it should create a table', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: 'jobs'
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

    it('it should create a table if it does not exist', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: 'jobs'
      , ifNotExists: true
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
      , [ 'create if not exists table "jobs" ('
        , '"id" serial primary key, '
        , '"name" text, '
        , '"createdAt" timestamp'
        , ')'
        ].join('')
      );
    });

    it('it should create a table that references another', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: 'usersGroups'
      , ifNotExists: true
      , definition: {
          id: {
            type: 'serial'
          , primaryKey: true
          }

        , uid: {
            type: 'int'
          , references: 'users'
          }

        , gid: {
            type: 'int'
          , references: 'groups'
          }

        , createdAt: {
            type: 'timestamp'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create if not exists table "usersGroups" ('
        , '"id" serial primary key, '
        , '"uid" int references users, '
        , '"gid" int references groups, '
        , '"createdAt" timestamp'
        , ')'
        ].join('')
      );
    });
  });
});