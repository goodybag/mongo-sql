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

    it('it should create a table with schema', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: '"private"."jobs"'
      , schema: 'private'
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
      , [ 'create table "private"."jobs" ('
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
      , [ 'create table if not exists "jobs" ('
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
          , references: {
              table: 'users'
            , column: 'id'
            }
          }

        , gid: {
            type: 'int'
          , references: {
              table: 'groups'
            , column: 'id'
            , onDelete: 'cascade'
            }
          }

        , createdAt: {
            type: 'timestamp'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create table if not exists "usersGroups" ('
        , '"id" serial primary key, '
        , '"uid" int references "users"("id"), '
        , '"gid" int references "groups"("id") on delete cascade, '
        , '"createdAt" timestamp'
        , ')'
        ].join('')
      );
    });

    it('Should not allow nulls', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: 'jobs'
      , definition: {
          id: {
            type: 'serial'
          }

        , name: {
            type: 'text'
          , notNull: true
          }

        , createdAt: {
            type: 'timestamp'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create table "jobs" ('
        , '"id" serial, '
        , '"name" text not null, '
        , '"createdAt" timestamp'
        , ')'
        ].join('')
      );
    });

    it('Should not allow nulls', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: 'jobs'
      , definition: {
          id: {
            type: 'serial'
          }

        , name: {
            type: 'text'
          , unique: true
          }

        , createdAt: {
            type: 'timestamp'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create table "jobs" ('
        , '"id" serial, '
        , '"name" text unique, '
        , '"createdAt" timestamp'
        , ')'
        ].join('')
      );
    });

    it('Should default to now()', function(){
      var query = builder.sql({
        type: 'create-table'
      , table: 'jobs'
      , definition: {
          id: {
            type: 'serial'
          }

        , name: {
            type: 'text'
          }

        , createdAt: {
            type: 'timestamp'
          , default: 'now()'
          }
        }
      });
      
      assert.equal(
        query.toString()
      , [ 'create table "jobs" ('
        , '"id" serial, '
        , '"name" text, '
        , '"createdAt" timestamp default now()'
        , ')'
        ].join('')
      );
    });
  });
});
