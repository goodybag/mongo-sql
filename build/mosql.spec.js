(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (Buffer){

// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     action [, ... ]
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME [ COLUMN ] column_name TO new_column_name
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME CONSTRAINT constraint_name TO new_constraint_name
// ALTER TABLE [ IF EXISTS ] name
//     RENAME TO new_name
// ALTER TABLE [ IF EXISTS ] name
//     SET SCHEMA new_schema

// where action is one of:

//     ADD [ COLUMN ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
//     DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
//     ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
//     ALTER [ COLUMN ] column_name SET DEFAULT expression
//     ALTER [ COLUMN ] column_name DROP DEFAULT
//     ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
//     ALTER [ COLUMN ] column_name SET STATISTICS integer
//     ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
//     ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
//     ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
//     ADD table_constraint [ NOT VALID ]
//     ADD table_constraint_using_index
//     VALIDATE CONSTRAINT constraint_name
//     DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
//     DISABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE REPLICA TRIGGER trigger_name
//     ENABLE ALWAYS TRIGGER trigger_name
//     DISABLE RULE rewrite_rule_name
//     ENABLE RULE rewrite_rule_name
//     ENABLE REPLICA RULE rewrite_rule_name
//     ENABLE ALWAYS RULE rewrite_rule_name
//     CLUSTER ON index_name
//     SET WITHOUT CLUSTER
//     SET WITH OIDS
//     SET WITHOUT OIDS
//     SET ( storage_parameter = value [, ... ] )
//     RESET ( storage_parameter [, ... ] )
//     INHERIT parent_table
//     NO INHERIT parent_table
//     OF type_name
//     NOT OF
//     OWNER TO new_owner
//     SET TABLESPACE new_tablespace

// and table_constraint_using_index is:

//     [ CONSTRAINT constraint_name ]
//     { UNIQUE | PRIMARY KEY } USING INDEX index_name
//     [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: alter table', function(){

    it('should alter a table', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users"'
        ].join('')
      );
    });

    it('should alter a table if it exists', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , ifExists: true
      });

      assert.equal(
        query.toString()
      , [ 'alter table if exists "users"'
        ].join('')
      );
    });

    it('should alter a table only', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , only: true
      });

      assert.equal(
        query.toString()
      , [ 'alter table only "users"'
        ].join('')
      );
    });

    it('should rename a table', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          rename: 'consumers'
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" rename to "consumers"'
        ].join('')
      );
    });

    it('should rename a column', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          renameColumn: {
            from: 'id'
          , to:   'uid'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" rename column "id" to "uid"'
        ].join('')
      );
    });

    it('should rename a constraint', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          renameConstraint: {
            from: 'id_idx'
          , to:   'uid_idx'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" rename constraint "id_idx" to "uid_idx"'
        ].join('')
      );
    });

    it('should set schema', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          setSchema: 'newSchema'
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" set schema "newSchema"'
        ].join('')
      );
    });

    it('should perform multiple actions', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: [
          { dropConstraint: { name: 'users_pkey' } }
        , { addConstraint: { name: 'users_pkey', primaryKey: [ 'id', 'name' ] } }
        , { addConstraint: { name: 'users_stuff_key', unique: 'name' } }
        , { alterColumn: { name: 'createdAt', default: 'now()' } }
        ]
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" '
        , 'drop constraint "users_pkey", '
        , 'add constraint "users_pkey" primary key ("id", "name"), '
        , 'add constraint "users_stuff_key" unique ("name"), '
        , 'alter column "createdAt" set default now()'
        ].join('')
      );
    });

    /**
     * Add Column
     ******************
     ******************
     */
    describe('Add Column', function(){

      it('should add a new column', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int'
          ].join('')
        );
      });

      it('should add a new column not null', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , notNull: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int not null'
          ].join('')
        );
      });

      it('should add a new column null', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , null: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int null'
          ].join('')
        );
      });

      it('should add a new column as primary key', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , primaryKey: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int primary key'
          ].join('')
        );
      });

      it('should add a new column with unique constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , unique: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int unique'
          ].join('')
        );
      });

      it('should add a new column with a check', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , check: { groupId: { $gt: 7 } }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int check ("users"."groupId" > $1)'
          ].join('')
        );
      });

      it('should add a new column with a default', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , default: 'now()'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int default now()'
          ].join('')
        );
      });

      it('should add a new column with a reference', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: 'groups'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"'
          ].join('')
        );
      });

      it('should add a new column with a column specific reference', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id")'
          ].join('')
        );
      });

      it('should add a new column with a reference with delete behavior', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              , onDelete: 'cascade'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id") on delete cascade'
          ].join('')
        );
      });

      it('should add a new column with a reference with update behavior', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              , onUpdate: 'set null'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id") on update set null'
          ].join('')
        );
      });

      it('should add a new column with a reference with match behavior', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              , match: 'full'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id") match full'
          ].join('')
        );
      });

      it('should add a new column with all restraints', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , notNull: true
            , check: {
                groupId: { $gt: 100 }
              }
            , default: 'now()'
            , unique: true
            , primaryKey: true
            , references: {
                table: 'groups'
              , column: 'id'
              , match: 'partial'
              }
            , deferrable: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" '
          , 'int '
          , 'not null '
          , 'check ("users"."groupId" > $1) '
          , 'default now() '
          , 'unique '
          , 'primary key '
          , 'references "groups"("id") '
          , 'match partial '
          , 'deferrable'
          ].join('')
        );
      });
    });

    /**
     * Alter Column
     ******************
     ******************
     */
    describe('Alter Column', function(){

      it('should alter a column changing the type', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'groupId'
            , type: 'text'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "groupId" type text'
          ].join('')
        );
      });

      it('should alter a column changing the type adding a using expression', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'groupId'
            , type: 'text'
            , using: 'null'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "groupId" type text using (null)'
          ].join('')
        );
      });

      it('should alter a column changing the default', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , default: 'now()'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set default now()'
          ].join('')
        );
      });

      it('should alter a column dropping the default', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , dropDefault: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" drop default'
          ].join('')
        );
      });

      it('should alter a column adding not null constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , notNull: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set not null'
          ].join('')
        );
      });

      it('should alter a column dropping not null constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , notNull: false
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" drop not null'
          ].join('')
        );
      });

      it('should alter a column setting statistics', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , statistics: 5
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set statistics $1'
          ].join('')
        );
      });

      it('should alter a column setting storage', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , storage: 'external'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set storage external'
          ].join('')
        );
      });

      it('should perform multiple alter columns', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: [
              { name: 'createdAt', storage: 'external' }
            , { name: 'createdAt', notNull: true }
            , { name: 'createdAt', default: 'now()' }
            ]
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'alter column "createdAt" set storage external, '
          , 'alter column "createdAt" set not null, '
          , 'alter column "createdAt" set default now()'
          ].join('')
        );
      });
    });

    describe('add/drop constraint', function(){

      it('should drop a constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            dropConstraint: 'zipchk'
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'drop constraint "zipchk"'
          ].join('')
        );
      });

      it('should drop a constraint with all options', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            dropConstraint: {
              name: "zipchk"
            , ifExists: true
            , cascade: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'drop constraint if exists "zipchk" cascade'
          ].join('')
        );
      });

      it('should add a check constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            addConstraint: {
              name: 'zipchk'
            , check: { $custom: ['char_length(zipcode) = $1', 5] }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'add constraint "zipchk" '
          , 'check (char_length(zipcode) = $1)'
          ].join('')
        );

        assert.deepEqual(
          query.values
        , [5]
        );
      });

      it('should add a foreign key constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            addConstraint: {
              name: 'distfk'
            , foreignKey: {
                column: 'address'
              , references: {
                  table: 'addresses'
                , column: 'address'
                }
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'add constraint "distfk" foreign key ("address") '
          , 'references "addresses"("address")'
          ].join('')
        );
      });

      it('should add a unique constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            addConstraint: {
              name: 'dist_id_zipcode_key'
            , unique: ['dist_id', 'zipcode']
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'add constraint "dist_id_zipcode_key" '
          , 'unique ("dist_id", "zipcode")'
          ].join('')
        );
      });
    });

    describe('drop column', function(){
      it('should drop a column', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: {
              name: 'groupId'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column "groupId"'
          ].join('')
        );
      });

      it('should if exists drop a column restrict', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: {
              name: 'groupId'
            , ifExists: true
            , restrict: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column if exists "groupId" '
          , 'restrict'
          ].join('')
        );
      });

      it('should drop a column cascade', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: {
              name: 'groupId'
            , cascade: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column "groupId" '
          , 'cascade'
          ].join('')
        );
      });

      it('should drop multiple columns', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: [
              { name: 'groupId'
              , ifExists: true
              , restrict: true
              }
            , { name: 'itemId'
              , cascade: true
              }
            , { name: 'horseId' }
            ]
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column if exists "groupId" restrict, '
          , 'drop column "itemId" cascade, '
          , 'drop column "horseId"'
          ].join('')
        );
      });

    });

  });
});

var assert  = require('assert');
var builder = require('../');

describe ('Combining Queries', function(){
  it ('should union', function(){
    var query = builder.sql({
      type: 'union'
    , queries: [
        { type: 'select', table: 'users' }
      , { type: 'select', table: 'other_users' }
      , { type: 'select', table: 'other_users2' }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users"'
      , 'select "other_users".* from "other_users"'
      , 'select "other_users2".* from "other_users2"'
      ].join(' union ')
    );
  });

  it ('should union all', function(){
    var query = builder.sql({
      type: 'union'
    , all: true
    , queries: [
        { type: 'select', table: 'users' }
      , { type: 'select', table: 'other_users' }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users"'
      , 'select "other_users".* from "other_users"'
      ].join(' union all ')
    );
  });

  it ('should intersect', function(){
    var query = builder.sql({
      type: 'intersect'
    , queries: [
        { type: 'select', table: 'users' }
      , { type: 'select', table: 'other_users' }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users"'
      , 'select "other_users".* from "other_users"'
      ].join(' intersect ')
    );
  });

  it ('should except', function(){
    var query = builder.sql({
      type: 'except'
    , queries: [
        { type: 'select', table: 'users' }
      , { type: 'select', table: 'other_users' }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users"'
      , 'select "other_users".* from "other_users"'
      ].join(' except ')
    );
  });

  it ('should union with a CTE', function(){
    var query = builder.sql({
      type: 'union'
    , with: [
        { type: 'select', table: 'users', name: 'other_users2' }
      ]
    , queries: [
        { type: 'select', table: 'users' }
      , { type: 'select', table: 'other_users' }
      , { type: 'select', table: 'other_users2' }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'with "other_users2" as (select "users".* from "users") '
      + 'select "users".* from "users"'
      , 'select "other_users".* from "other_users"'
      , 'select "other_users2".* from "other_users2"'
      ].join(' union ')
    );
  });
});
var assert  = require('assert');
var builder = require('../');

describe('Conditions', function(){

  it ('should build a query selecting on users where id = $1', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: 5 }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" = $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('should build a query selecting on users where id = $1 and name = $2', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: 5, name: 'Bob' }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" = $1 and "users"."name" = $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Bob']
    );
  });

  it ('should use boolean syntax', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { isAwesome: true }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."isAwesome" is true'
    );

    assert.deepEqual(
      query.values
    , []
    );

    query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { isAwesome: false }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."isAwesome" is false'
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should build a query selecting on users where id = $1 or name = $2', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $or: { id: 5, name: 'Bob' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" = $1 or "users"."name" = $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Bob']
    );
  });

  it ('$gt', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $gt: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" > $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$gt multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $gt: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" > $1 and "users"."name" > $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$gte', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $gte: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" >= $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$gte multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $gte: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" >= $1 and "users"."name" >= $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$lt', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $lt: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" < $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$lt multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $lt: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" < $1 and "users"."name" < $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$lte', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $lte: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" <= $1'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$lte multi', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { $lte: { id: 5, name: 'Tobias' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" <= $1 and "users"."name" <= $2'
    );

    assert.deepEqual(
      query.values
    , [5, 'Tobias']
    );
  });

  it ('$null', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $null: true } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" is null'
    );
  });

  it ('should use $null when value is null', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: null }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" is null'
    );
  });

  it ('$notNull', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $notNull: true } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."id" is not null'
    );
  });

  it ('$like', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { name: { $like: 'Bobo' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" like $1'
    );

    assert.deepEqual(
      query.values
    , ['Bobo']
    );
  });

  it ('$ilike', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { name: { $ilike: 'Bobo' } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" ilike $1'
    );

    assert.deepEqual(
      query.values
    , ['Bobo']
    );
  });

  it ('$in', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $in: {
            type: 'select'
          , table: 'groups'
          , columns: ['userId']
          , where: { "groupId": 5 }
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where '
      + '"users"."id" in ('
        + 'select "groups"."userId" from "groups" where '
          + '"groups"."groupId" = $1)'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$in array', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $in: [1, 2, 3]
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where '
      + '"users"."id" in ($1, $2, $3)'
    );

    assert.deepEqual(
      query.values
    , [1, 2, 3]
    );
  });

  it ('$nin', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $nin: {
            type: 'select'
          , table: 'groups'
          , columns: ['userId']
          , where: { "groupId": 5 }
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where '
      + '"users"."id" not in ('
        + 'select "groups"."userId" from "groups" where '
          + '"groups"."groupId" = $1)'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('$nin array', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        id: {
          $nin: [1, 2, 3]
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where '
      + '"users"."id" not in ($1, $2, $3)'
    );

    assert.deepEqual(
      query.values
    , [1, 2, 3]
    );
  });

  it ('should allow an arbitrary amount of conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        name: 'Bob'
      , id: { $lt: 500 }
      , groupId: { $equals: 7 }
      , another: { $or: [1, 2, 3, 4] }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" = $1 and "users"."id" < $2 and "users"."groupId" = $3 and ("users"."another" = $4 or "users"."another" = $5 or "users"."another" = $6 or "users"."another" = $7)'
    );

    assert.deepEqual(
      query.values
    , ['Bob', 500, 7, 1, 2, 3, 4]
    );
  });

  it ('should inline custom conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        name: { $like: 'Bob' }
      , $custom: ['"users"."createdAt" > now() - interval $1 month', 5]
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."name" like $1 and "users"."createdAt" > now() - interval $2 month'
    );

    assert.deepEqual(
      query.values
    , ['Bob', 5]
    );
  });

  it ('$years_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $years_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 year'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$years_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $years_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 year and "users"."somethingElse" >= now() - interval $2 year'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$months_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $months_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 month'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$months_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $months_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 month and "users"."somethingElse" >= now() - interval $2 month'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$days_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $days_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 day'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$days_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $days_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 day and "users"."somethingElse" >= now() - interval $2 day'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$hours_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $hours_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 hour'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$hours_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $hours_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 hour and "users"."somethingElse" >= now() - interval $2 hour'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$minutes_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $minutes_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 minute'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$minutes_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $minutes_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 minute and "users"."somethingElse" >= now() - interval $2 minute'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('$seconds_ago', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        createdAt: { $seconds_ago: 2 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 second'
    );

    assert.deepEqual(
      query.values
    , [2]
    );
  });

  it ('$seconds_ago inverse', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        $seconds_ago: { createdAt: 2, somethingElse: 3 }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where "users"."createdAt" >= now() - interval $1 second and "users"."somethingElse" >= now() - interval $2 second'
    );

    assert.deepEqual(
      query.values
    , [2, 3]
    );
  });

  it ('Should have no conditions if where is an empty object', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {}
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users"'
    );
  });

  describe('JSON Operators', function(){

    it ('Should Get JSON object field', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      )
    });

    it ('Should Get JSON array element', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->1': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->1 = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      )
    });

    it ('Should Get JSON array element as text', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->>5': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->>5 = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      )
    });

    it ('Should Get JSON object field as text', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->>name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"->>\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      )
    });

    it ('Should operate on JSON text and cast the column', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data::json->name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "users"."data"::json->\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      )
    });

    it ('Should operate on JSON text and cast the column and specify table', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'other_table.data::json->name': 'Bob'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where "other_table"."data"::json->\'name\' = $1'
      );

      assert.deepEqual(
        query.values
      , ['Bob']
      )
    });

    it ('Should operate on JSON and play nicely with other helpers', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->name': 'Bob'
        , $or: {
            id: 7
          , 'data->other_id': 'blah'
          , 'data::hstore->other_thing': { $gt: 'bill' }
          }
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"->\'name\' = $1 and '
        , '("users"."id" = $2 or "users"."data"->\'other_id\' = $3 or '
        , '"users"."data"::hstore->\'other_thing\' > $4)'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , ['Bob', 7, 'blah', 'bill']
      )
    });

    it ('Should be able to go deep', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->3->records->4->id': 27
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"->3->\'records\'->4->\'id\' = $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [27]
      )
    });

    it ('Should be able to go deep with array syntax', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data#>{3,records,4,id}': 27
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"#>\'{3,records,4,id}\' = $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [27]
      )
    });

    it ('Should not double quote things already quoted', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: {
          'data->\'3\'': 27
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "users".* from "users" where '
        , '"users"."data"->\'3\' = $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [27]
      )
    });
  });

  it ('should cast', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        'my_column::some_type': 27
      }
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" where '
      , '"users"."my_column"::some_type = $1'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , [27]
    );
  });

});
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

var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: create view', function(){

    it('it should create a view', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create view "jobs_gt_10" as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it('it should create or replace a view', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , orReplace: true
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create or replace view "jobs_gt_10" as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it('it should create a temporary view', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , temporary: true
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create temporary view "jobs_gt_10" as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it('it should create view with a specific column list', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , columns: ['id', 'name']
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create view "jobs_gt_10" ("id", "name") as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });
  });
});
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
var assert  = require('assert');
var builder = require('../');

describe('Functions', function(){
  it('should be able to use a function as a column', function(){
    var query = {
      type: 'select'
    , table: 'users'
    , columns: {
        books: {
          type: 'array_agg'
        , expression: {
            type: 'select'
          , table: 'books'
          , columns: ['id']
          }
        }
      , name: 'userName'
      }
    };

    var result = builder.sql(query);

    assert.equal(
      result.toString()
    , [ 'select '
      , 'array_agg( select "books"."id" from "books" ) as "books", '
      , '"users"."name" as "userName" '
      , 'from "users"'
      ].join('')
    );

    assert.deepEqual(
      result.values
    , []
    );
  });

  it('should be able to use a function as a column using the array syntax', function(){
    var query = {
      type: 'select'
    , table: 'users'
    , columns: [
        {
          type: 'array_agg'
        , expression: {
            type: 'select'
          , table: 'books'
          , columns: ['id']
          }
        }
      , 'name'
      ]
    };

    var result = builder.sql(query);

    assert.equal(
      result.toString()
    , [ 'select '
      , 'array_agg( select "books"."id" from "books" ), '
      , '"users"."name" '
      , 'from "users"'
      ].join('')
    );

    assert.deepEqual(
      result.values
    , []
    );
  });

  it('should be able to embed functions', function(){
    var query = {
      type: 'select'
    , table: 'users'
    , columns: {
        books: {
          type: 'array_to_json'
        , expression: {
            type: 'array_agg'
          , expression: 'bks.book'
          }
        }
      , name: 'userName'
      }

    , with: {
        bks: {
          type: 'select'
        , table: 'books'
        , alias: 'b'
        , columns: {
            book: {
              type: 'row_to_json'
            , expression: 'b'
            }
          }
        }
      }
    };

    var result = builder.sql(query);

    assert.equal(
      result.toString()
    , [ 'with '
      , '"bks" as ('
      , 'select row_to_json( b ) as "book" from "books" "b"'
      , ') select '
      , 'array_to_json( array_agg( bks.book ) ) as "books", '
      , '"users"."name" as "userName" '
      , 'from "users"'
      ].join('')
    );

    assert.deepEqual(
      result.values
    , []
    );
  });
});
var assert  = require('assert');
var builder = require('../');

describe('Helpers', function(){

  describe('Types', function(){
    it('should add a query type', function(){
      builder.registerQueryType('users', 'select * from users {where}')

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
var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: insert', function(){

    it('should insert', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2)'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com']
      );
    });

    it('should insert and return', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: ['id']
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2) returning "users"."id"'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com']
      );
    });

    it('should insert with values from a subquery', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , columns: [ 'name', 'email' ]
      , expression: {
          type: 'select'
        , table: 'other_users'
        , columns: [ 'name', 'email' ]
        , where: { id: 7 }
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") (select "other_users"."name", "other_users"."email" from "other_users" where "other_users"."id" = $1)'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should insert with a value from a subquery', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: {
            type: 'select'
          , table: 'other_users'
          , columns: [ 'email' ]
          , where: { id: 7 }
          }
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, (select "other_users"."email" from "other_users" where "other_users"."id" = $2))'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 7]
      );
    });

    it('should insert with a null value', function() {
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        , description: null
        }
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email", "description") values ($1, $2, null)'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com']
      );
    });

    it('should do multi-insert', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: [
          { name: 'Bob', email: 'bob@bob.com' }
        , { name: 'Tom', email: 'tom@tom.com' }
        , { name: 'Pam', email: 'pam@pam.com' }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2), ($3, $4), ($5, $6)'
      );

      assert.deepEqual(
        query.values
      , [ query.original.values[0].name, query.original.values[0].email
        , query.original.values[1].name, query.original.values[1].email
        , query.original.values[2].name, query.original.values[2].email ]
      );
    });

    it('should do multi-insert with different keys', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: [
          { name: 'Bob', email: 'bob@bob.com' }
        , { name: 'Tom' }
        , { name: 'Pam', code: 'aas123' }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email", "code") values ($1, $2, null), ($3, null, null), ($4, null, $5)'
      );

      assert.deepEqual(
        query.values
      , [ query.original.values[0].name, query.original.values[0].email
        , query.original.values[1].name
        , query.original.values[2].name, query.original.values[2].code ]
      );
    });

    it('should throw an error from a blank array', function(){
      assert.throws(
        function(){
          builder.sql({
            type: 'insert'
          , table: 'users'
          , values: []
          });
        }
      , 'MoSQL.queryHelper.values - Invalid values array length `0`'
      );
    });

    it('should allow sub-expressions in returning', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: [
          'id'
        , { expression: '("orders"."datetime"::text) as datetime' }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2) returning "users"."id", ("orders"."datetime"::text) as datetime'
      );
    });

    it('should allow sub-expressions with alias in returning', function(){
      var query = builder.sql({
        type: 'insert'
      , table: 'users'
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: [
          'id'
        , { expression: '("orders"."datetime"::text)'
          , alias: 'datetime'
          }
        ]
      });

      assert.equal(
        query.toString()
      , 'insert into "users" ("name", "email") values ($1, $2) returning "users"."id", ("orders"."datetime"::text) as "datetime"'
      );
    });
  });
});

var assert  = require('assert');
var builder = require('../');

describe('Joins', function(){

  it ('should join', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , join: {
        // Surrounding a value with single-dollars prevents the parser
        // from parameterizing the value
        groups: { 'groups.id': '$users.id$' }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" join "groups" on "groups"."id" = "users"."id"'
    );
  });

  it ('should left join', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , leftJoin: {
        groups: { 'groups.id': '$users.id$' }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" left join "groups" on "groups"."id" = "users"."id"'
    );
  });

  it ('should inner join', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , innerJoin: {
        groups: { 'groups.id': '$users.id$' }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" inner join "groups" on "groups"."id" = "users"."id"'
    );
  });

  it ('should left outer join', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , leftOuterJoin: {
        groups: { 'groups.id': '$users.id$' }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" left outer join "groups" on "groups"."id" = "users"."id"'
    );
  });

  it ('should full outer join', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , fullOuterJoin: {
        groups: { 'groups.id': '$users.id$' }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" full outer join "groups" on "groups"."id" = "users"."id"'
    );
  });

  it ('should cross outer join', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , crossOuterJoin: {
        groups: { 'groups.id': '$users.id$' }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" cross outer join "groups" on "groups"."id" = "users"."id"'
    );
  });

  it ('should join on an arbitrary amount of conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , join: {
        groups: {
          'groups.id': '$users.id$'
        , 'groups.groupId': { $gt: 3 }
        , 'users.name': { $ne: 'Bob' }
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" join "groups" on "groups"."id" = "users"."id" and "groups"."groupId" > $1 and "users"."name" != $2'
    );

    assert.deepEqual(
      query.values
    , [3, 'Bob']
    );
  });

  it ('should allow an arbitrary amount of joins on an arbitrary amount of conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , join: {
        groups: {
          'groups.id': '$users.id$'
        , 'groups.groupId': { $gt: 3 }
        , 'users.name': { $ne: 'Bob' }
        }
      , tableB: {
          'tableB.id': '$users.tableBId$'
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" join "groups" on "groups"."id" = "users"."id" and "groups"."groupId" > $1 and "users"."name" != $2 join "tableB" on "tableB"."id" = "users"."tableBId"'
    );

    assert.deepEqual(
      query.values
    , [3, 'Bob']
    );
  });

  it ('should build joins from single joins query helper', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: {
        books: {
          type: 'left'
        , on: {
            userId: '$users.id$'
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should allow object syntax to override alias and provide a target', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: {
        booksJoin: {
          type: 'left'
        , alias: 'b'
        , target: 'books'
        , on: {
            userId: '$users.id$'
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" "b" on "b"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should allow sub-queries on targets', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: {
        books: {
          type: 'left'
        , target: {
            type: 'select'
          , table: 'books'
          }
        , on: {
            userId: '$users.id$'
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join (select "books".* from "books") "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should build joins using array syntax', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: "books"
        , on: {
            userId: '$users.id$'
          }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should build joins using array syntax with conditionals in a sub-select', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: "books"
        , on: {
            userId: '$users.id$'
          }
        }
      , {
          type: 'left'
        , alias: 'addresses'
        , on: { 'userId': '$users.id$' }
        , target: {
            type: 'select'
          , table: 'addresses'
          , columns: ['userId']
          , where: {
              id: { $gt: 7 }
            }
          }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" on "books"."userId" = "users"."id" '
      , 'left join ('
      ,   'select "addresses"."userId" from "addresses" where "addresses"."id" > $1'
      , ') "addresses" on "addresses"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , [7]
    );
  });

  it ('should build multiple joins from single joins query helper', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: {
        books: {
          type: 'left'
        , on: {
            userId: '$users.id$'
          }
        }
      , things: {
          type: 'left'
        , on: {
            userId: '$users.id$'
          }
        }
      }
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" "books" on "books"."userId" = "users"."id" '
      , 'left join "things" "things" on "things"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should build multiple joins using array syntax', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: "books"
        , on: {
            userId: '$users.id$'
          }
        }

      , {
          type: 'left'
        , target: "things"
        , on: {
            userId: '$users.id$'
          }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" on "books"."userId" = "users"."id" '
      , 'left join "things" on "things"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('throw an error for an invalid join type', function(){
    assert.throws(function(){
      builder.sql({
        type: 'select'
      , table: 'users'
      , joins: 1
      });
    }, Error);
  });

  it ('throw an error when missing target', function(){
    assert.throws(function(){
      builder.sql({
        type: 'select'
      , table: 'users'
      , joins: [
          {
            alias: 'c'
          , on: { id: '$users.id$' }
          }
        ]
      });
    }, Error);
  });

  it ('should left join using a value as a pivot', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , leftJoin: {
        groups: {
          'groups.id': '$users.id$'
        , 'groups.other': 'value'
        }
      }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" left join "groups" on "groups"."id" = "users"."id" and "groups"."other" = $1'
    );

    assert.deepEqual(
      query.values
    , ['value']
    );
  });

  it ('should join with array syntax', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: 'books'
        , alias: 'books'
        , on: { userId: '$users.id$' }
        }
      , {
          type: 'left'
        , target: 'things'
        , on: { userId: '$users.id$' }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "books" "books" on "books"."userId" = "users"."id" '
      , 'left join "things" on "things"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should join with schema specified in target', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: 'my_schema.books'
        , alias: 'books'
        , on: { userId: '$users.id$' }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "my_schema"."books" "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should join with schema specified as a separate field', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: 'books'
        , schema: 'my_schema'
        , alias: 'books'
        , on: { userId: '$users.id$' }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "my_schema"."books" "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should join with schema and database specified in target', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: 'my_database.my_schema.books'
        , alias: 'books'
        , on: { userId: '$users.id$' }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "my_database"."my_schema"."books" "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

  it ('should join with schema and database specified in separate fields', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , joins: [
        {
          type: 'left'
        , target: 'books'
        , schema: 'my_schema'
        , database: 'my_database'
        , alias: 'books'
        , on: { userId: '$users.id$' }
        }
      ]
    });

    assert.equal(
      query.toString()
    , [
        'select "users".* from "users" '
      , 'left join "my_database"."my_schema"."books" "books" on "books"."userId" = "users"."id"'
      ].join('')
    );

    assert.deepEqual(
      query.values
    , []
    );
  });

});
/**
 * Really should never fail unless run with the browser tests
 */

var assert  = require('assert');

describe('Normalize', function(){
  it ('should have defined Buffer', function(){
    assert.equal( typeof Buffer, 'function' );
  });
});
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

var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: select', function(){

    it ('should build a query selecting on users', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users"'
      );
    });

    it ('should specify columns', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , columns: ['id', 'name']
      });

      assert.equal(
        query.toString()
      , 'select "users"."id", "users"."name" from "users"'
      );
    });

    it ('should specify columns with schema', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'private.users'
      , columns: ['private.users.id', 'private.users.name']
      });

      assert.equal(
        query.toString()
      , 'select "private"."users"."id", "private"."users"."name" from "private"."users"'
      );
    });

    it ('should specify columns with schema even for simple column names', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'private.users'
      , columns: ['id', 'name']
      });

      assert.equal(
        query.toString()
      , 'select "private"."users"."id", "private"."users"."name" from "private"."users"'
      );
    });

    it ('should specify columns that are objects', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , columns: [
          { name: 'id', alias: 'user_id' }
        , 'name'
        , { name: 'test', table: 'things' }
        ]
      });

      assert.equal(
        query.toString()
      , 'select "users"."id" as "user_id", "users"."name", "things"."test" from "users"'
      );
    });

    it ('should specify columns and use functions', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , columns: ['max(version) as max']
      });

      assert.equal(
        query.toString()
      , 'select max(version) as max from "users"'
      );
    });

    it ('should specify columns and use a sub-query', function(){
      var query = builder.sql({
        type: 'select'
      , columns: [
          {
            type: 'select'
          , table: 'consumers'
          , columns: ['id']
          , as: 'u'
          }
        ]
      });

      assert.equal(
        query.toString()
      , 'select (select "consumers"."id" from "consumers") as "u"'
      );
    });

    it ('should specify multiple tables', function(){
      var query = builder.sql({
        type: 'select'
      , table: ['users', 'groups']
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users", "groups"'
      );
    });

    it ('should specify multiple tables and columns '
      + 'from both tables assuming that if a table '
      + 'name is not specified in the column definition, '
      + 'then the first table is default', function(){

      var query = builder.sql({
        type: 'select'
      , table: ['users', 'groups']
      , columns: ['id', 'name', 'groups.name']
      });

      assert.equal(
        query.toString()
      , 'select "users"."id", "users"."name", "groups"."name" from "users", "groups"'
      );
    });

    it ('should specify multiple tables and columns '
      + 'from both tables assuming that if a table '
      + 'name is not specified in the column definition, '
      + 'then the first table is default, using an object'
      + 'as the column definition', function(){

      var query = builder.sql({
        type: 'select'
      , table: ['users', 'groups']
      , columns: {
          'id':           'id'
        , 'name':         'name'
        , 'groups.name':  'group'
        }
      });

      assert.equal(
        query.toString()
      , 'select "users"."id" as "id", "users"."name" as "name", "groups"."name" as "group" from "users", "groups"'
      );
    });

    it ('group by string', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , groupBy:  'id'
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" group by "users"."id"'
      );
    });

    it ('group by array', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , groupBy:  ['id', 'name']
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" group by "users"."id", "users"."name"'
      );
    });

    it ('order by string', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , order:    'id desc'
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" order by id desc'
      );
    });

    it ('should put order before limit', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , order:    'id desc'
      , limit:    5
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" order by id desc limit $1'
      );
    });

    it ('order by array', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , order:    ['id desc', 'name asc']
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" order by id desc, name asc'
      );
    });

    it ('order by object', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , order:    { id: 'desc' }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" order by "users"."id" desc'
      );
    });

    it ('order by object, multiple', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , order:    { id: 'desc', name: 'asc' }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" order by "users"."id" desc, "users"."name" asc'
      );
    });

    it ('order by object, multiple tables', function(){
      var query = builder.sql({
        type:     'select'
      , table:    ['users', 'groups']
      , order:    { id: 'desc', 'groups.id': 'asc' }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users", "groups" order by "users"."id" desc, "groups"."id" asc'
      );
    });

    it ('limit', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , limit:    10
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" limit $1'
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it ('limit all', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , limit:    'all'
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" limit all'
      );
    });


    it ('invalid limit throws error', function(){
      assert.throws(function() {
        builder.sql({
          type:     'select'
        , table:    'users'
        , limit:    'qwerty'
        });
      }, Error );
    });

    it ('offset', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , offset:    10
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" offset $1'
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it ('should support with', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , with: {
          otherUsers: {
            type: 'select'
          , table: 'users'
          , where: {
              columnA: 'other'
            }
          }
        }
      , where: {
          id: {
            $nin: {
              type: 'select'
            , table: 'otherUsers'
            , columns: ['id']
            }
          }
        }
      });

      assert.equal(
        query.toString()
      , [
          'with "otherUsers" as ('
          , 'select "users".* from "users" '
            , 'where "users"."columnA" = $1'
          , ') '
        , 'select "users".* from "users" '
        , 'where "users"."id" not in ('
          , 'select "otherUsers"."id" from "otherUsers"'
        , ')'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , ['other']
      );
    });

    it ('should support multiple withs', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , with: {
          otherUsers: {
            type: 'select'
          , table: 'users'
          , where: {
              columnA: 'other'
            }
          }
        , otherUsers2: {
            type: 'select'
          , table: 'users'
          , where: {
              columnA: 'other2'
            }
          }
        }
      , where: {
          id: {
            $nin: {
              type: 'select'
            , table: 'otherUsers'
            , columns: ['id']
            }
          }
        }
      });

      assert.equal(
        query.toString()
      , [
          'with "otherUsers" as ('
          , 'select "users".* from "users" '
            , 'where "users"."columnA" = $1'
          , '), '
        , '"otherUsers2" as ('
          , 'select "users".* from "users" '
            , 'where "users"."columnA" = $2'
          , ') '
        , 'select "users".* from "users" '
        , 'where "users"."id" not in ('
          , 'select "otherUsers"."id" from "otherUsers"'
        , ')'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , ['other', 'other2']
      );
    });

    it ('should support multiple withs in array syntax', function(){
      var query = builder.sql({
        type:     'select'
      , table:    'users'
      , with: [
          {
            type: 'select'
          , table: 'users'
          , name: 'otherUsers'
          , where: {
              columnA: 'other'
            }
          }
        , {
            type: 'select'
          , table: 'users'
          , name: 'otherUsers2'
          , where: {
              columnA: 'other2'
            }
          }
        , {
            type: 'select'
          , table: 'users'
          , name: 'otherUsers3'
          , where: {
              columnA: 'other3'
            }
          }
        ]
      , where: {
          id: {
            $nin: {
              type: 'select'
            , table: 'otherUsers'
            , columns: ['id']
            }
          }
        }
      });

      assert.equal(
        query.toString()
      , [
          'with "otherUsers" as ('
          , 'select "users".* from "users" '
            , 'where "users"."columnA" = $1'
          , '), '
        , '"otherUsers2" as ('
          , 'select "users".* from "users" '
            , 'where "users"."columnA" = $2'
          , '), '
        , '"otherUsers3" as ('
          , 'select "users".* from "users" '
            , 'where "users"."columnA" = $3'
          , ') '
        , 'select "users".* from "users" '
        , 'where "users"."id" not in ('
          , 'select "otherUsers"."id" from "otherUsers"'
        , ')'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , ['other', 'other2', 'other3']
      );
    });

    it ('should select distinct', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , distinct: true
      });

      assert.equal(
        query.toString()
      , 'select distinct "users".* from "users"'
      );
    });

    it ('should not select distinct', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , distinct: false
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users"'
      );
    });

    it ('should select distinct on single', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , distinct: ['id']
      , order: ['id asc']
      });

      assert.equal(
        query.toString()
      , 'select distinct on ("id") "users".* from "users" order by id asc'
      );
    });

    it ('should select distinct on multilpe', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , distinct: ['id', 'name']
      , order: ['id asc', 'name asc']
      });

      assert.equal(
        query.toString()
      , 'select distinct on ("id", "name") "users".* from "users" order by id asc, name asc'
      );
    });

    it ('should not select distinct on', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , distinct: []
      , order: ['id asc']
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" order by id asc'
      );
    });

    it ('allow sub-queries on table', function(){
      var query = builder.sql({
        type: 'select'
      , table: {
          type: 'select'
        , table: 'users'
        , alias: 'u'
        }
      });

      assert.equal(
        query.toString()
      , 'select "u".* from (select "users".* from "users") "u"'
      );
    });

    it ('allow arbitrary sub-queries on table', function(){
      var query = builder.sql({
        type: 'select'
      , table: {
          type: 'select'
        , table: {
            type: 'select'
          , table: {
              type: 'select'
            , table: 'users'
            , alias: 'uuu'
            }
          , alias: 'uu'
          }
        , alias: 'u'
        }
      });

      assert.equal(
        query.toString()
      , [
          'select "u".* from '
        , '(select "uu".* from '
        , '(select "uuu".* from '
        , '(select "users".* from "users") "uuu") "uu") "u"'
        ].join('')
      );
    });

    it ('select expression', function(){
      var query = builder.sql({
        type: 'select'
      , expression: {
          type: 'unnest'
        , expression: 'users.jobs'
        }
      });

      assert.equal(
        query.toString()
      , 'select unnest( users.jobs )'
      );
    });

    it ('select expression with parameters', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'tbl'
      , columns: [
          { expression: { expression: '$1, $2', values: [ 3, 4 ] } }
        ]
      , where: { col: 'bob' }
      });

      assert.equal(
        query.toString()
      , 'select $1, $2 from "tbl" where "tbl"."col" = $3'
      );

      assert.deepEqual(
        query.values
      , [ 3, 4, 'bob' ]
      );
    });

    // TODO: make this test pass
    // it ('should allow an empty over clause with string', function() {
    //   var query = builder.sql({
    //     type: 'select'
    //   , table: 'foo'
    //   , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
    //   , over: ''
    //   });

    //   assert.equal(
    //     query.toString()
    //   , 'select "foo"."bar", avg( baz ) over () from "foo"'
    //   );
    // });

    it ('should allow an over clause with arbitrary string', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
      , over: 'completely arbitrary'
      });

      assert.equal(
        query.toString()
      , 'select "foo"."bar", avg( baz ) over (completely arbitrary) from "foo"'
      );
    });

    it ('should allow an empty over clause with object', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
      , over: {}
      });

      assert.equal(
        query.toString()
      , 'select "foo"."bar", avg( baz ) over () from "foo"'
      );
    });

    it ('should allow over clause with partition', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
      , over: {partition: 'bar'}
      });

      assert.equal(
        query.toString()
      , 'select "foo"."bar", avg( baz ) over (partition by "foo"."bar") from "foo"'
      );
    });

    it ('should allow over clause with order', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
      , over: {order: 'bar'}
      });

      assert.equal(
        query.toString()
      , 'select "foo"."bar", avg( baz ) over (order by bar) from "foo"'
      );
    });

    it ('should allow over clause with partition and order', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
      , over: {
          partition: 'bar'
        , order: 'bar asc'
        }
      });

      assert.equal(
        query.toString()
      , 'select "foo"."bar", avg( baz ) over (partition by "foo"."bar" order by bar asc) from "foo"'
      );
    });

    it ('should allow over clause with array partition', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: ['bar', {type: 'function', function: 'avg', expression: 'baz'}]
      , over: {
          partition: ['bar', 'another']
        }
      });

      assert.equal(
        query.toString()
      , 'select "foo"."bar", avg( baz ) over (partition by "foo"."bar", "foo"."another") from "foo"'
      );
    });

    it ('should declare a window as an existing window', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , window: {
          name: 'f'
        , as: {
            existing: 'b'
          }
        }
      });

      assert.equal(
        query.toString()
      , 'select "foo".* from "foo" window "f" as ( "b" )'
      );
    });

    it ('should declare a window as a partition by expression', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , window: {
          name: 'f'
        , as: {
            partition: 'b'
          }
        }
      });

      assert.equal(
        query.toString()
      , 'select "foo".* from "foo" window "f" as ( partition by "foo"."b" )'
      );
    });

    it ('should declare a window as a partition by expression and order', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , window: {
          name: 'f'
        , as: {
            partition: 'b'
          , order: { id: 'desc' }
          }
        }
      });

      assert.equal(
        query.toString()
      , 'select "foo".* from "foo" window "f" as ( partition by "foo"."b" order by "foo"."id" desc )'
      );
    });

    it ('should let parenthesis in expressions be explicit', function() {
      var query = builder.sql({
        type: 'select'
      , table: 'foo'
      , columns: [
          { expression: 'bar' }
        , {
            expression: {
              expression: 'bar - baz'
            , parenthesis: true
            }
          , alias: 'blah'
          }
        ]
      });

      assert.equal(
        query.toString()
      , 'select bar, ( bar - baz ) as "blah" from "foo"'
      );
    });
  });
});
var assert  = require('assert');
var builder = require('../');

describe('Table Aliasing', function(){
  it('should make an aliased select', function(){
    var query = {
      type: 'select'
    , alias: 'bobs'
    , table: 'users'
    , where: {
        name: { $ilike: 'Bob' }
      }
    };

    var result = builder.sql(query);

    assert.equal(
      result.toString()
    , 'select "bobs".* from "users" "bobs" where "bobs"."name" ilike $1'
    );

    assert.deepEqual(
      result.values
    , ['Bob']
    );
  });
});

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

var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: update', function(){

    it('should update', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should not do funkiness with empty updates obj', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {}
      });

      assert.equal(
        query.toString()
      , 'update "users" where "users"."id" = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should update and return', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: ['id']
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id"'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should allow sub-expressions in returning', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: [
          'id'
        , { expression: '("orders"."datetime"::text) as datetime' }
        ]
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id", ("orders"."datetime"::text) as datetime'
      );
    });

    it('should allow sub-expressions with alias in returning', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: [
          'id'
        , { expression: '("orders"."datetime"::text)'
          , alias: 'datetime'
          }
        ]
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id", ("orders"."datetime"::text) as "datetime"'
      );
    });

    it('should throw error with invalid returning input', function(){
      assert.throws(
        function(){
          builder.sql({
            type: 'update'
          , table: 'users'
          , where: {
              id: 7
            }
          , updates: {
              name: 'Bob'
            , email: 'bob@bob.com'
            }
          , returning: 'id'
          });
        }
      , Error
      );
    });

    it('$inc', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          $inc: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" + $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('$dec', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          $dec: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" - $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('from string', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , from: 'other'
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 from "other"');
    });

    it('from array', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , from: ['other1', 'other2']
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 from "other1", "other2"');
    });

    it('should update with null value', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , updates: {
          name: 'Bob'
        , email: 'bob@bob.com'
        , description: null
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2, "description" = null where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

  });

  describe('Type: update with values', function(){

    it('should update', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('should not do funkiness with empty values obj', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {}
      });

      assert.equal(
        query.toString()
      , 'update "users" where "users"."id" = $1'
      );

      assert.deepEqual(
        query.values
      , [7]
      );
    });

    it('should update and return', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        }
      , returning: ['id']
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2 where "users"."id" = $3 returning "users"."id"'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });

    it('$inc', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          $inc: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" + $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('$dec', function(){
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          $dec: { count: 5 }
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "count" = "users"."count" - $1 where "users"."id" = $2'
      );

      assert.deepEqual(
        query.values
      , [5, 7]
      );
    });

    it('should update with null value', function() {
      var query = builder.sql({
        type: 'update'
      , table: 'users'
      , where: {
          id: 7
        }
      , values: {
          name: 'Bob'
        , email: 'bob@bob.com'
        , description: null
        }
      });

      assert.equal(
        query.toString()
      , 'update "users" set "name" = $1, "email" = $2, "description" = null where "users"."id" = $3'
      );

      assert.deepEqual(
        query.values
      , ['Bob', 'bob@bob.com', 7]
      );
    });


  });
});

}).call(this,require("buffer").Buffer)
},{"../":38,"assert":50,"buffer":53}],2:[function(require,module,exports){
/**
 * Actions
 */

// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     action [, ... ]
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME [ COLUMN ] column_name TO new_column_name
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME CONSTRAINT constraint_name TO new_constraint_name
// ALTER TABLE [ IF EXISTS ] name
//     RENAME TO new_name
// ALTER TABLE [ IF EXISTS ] name
//     SET SCHEMA new_schema

// where action is one of:

//     ADD [ COLUMN ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
//     DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
//     ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
//     ALTER [ COLUMN ] column_name SET DEFAULT expression
//     ALTER [ COLUMN ] column_name DROP DEFAULT
//     ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
//     ALTER [ COLUMN ] column_name SET STATISTICS integer
//     ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
//     ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
//     ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
//     ADD table_constraint [ NOT VALID ]
//     ADD table_constraint_using_index
//     VALIDATE CONSTRAINT constraint_name
//     DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
//     DISABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE REPLICA TRIGGER trigger_name
//     ENABLE ALWAYS TRIGGER trigger_name
//     DISABLE RULE rewrite_rule_name
//     ENABLE RULE rewrite_rule_name
//     ENABLE REPLICA RULE rewrite_rule_name
//     ENABLE ALWAYS RULE rewrite_rule_name
//     CLUSTER ON index_name
//     SET WITHOUT CLUSTER
//     SET WITH OIDS
//     SET WITHOUT OIDS
//     SET ( storage_parameter = value [, ... ] )
//     RESET ( storage_parameter [, ... ] )
//     INHERIT parent_table
//     NO INHERIT parent_table
//     OF type_name
//     NOT OF
//     OWNER TO new_owner
//     SET TABLESPACE new_tablespace

// and table_constraint_using_index is:

//     [ CONSTRAINT constraint_name ]
//     { UNIQUE | PRIMARY KEY } USING INDEX index_name
//     [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var actions = require('../lib/action-helpers');
  var queryHelpers = require('../lib/query-helpers');
  var utils = require('../lib/utils');

  actions.add('renameTable', function(value, values, query){
    return 'rename to "' + value + '"';
  });

  actions.add('rename', function(value, values, query){
    return actions.get('renameTable').fn(value, values, query);
  });

  actions.add('renameConstraint', function(value, values, query){
    return (
      "rename constraint "
    + utils.quoteObject(value.from)
    + " to "
    + utils.quoteObject(value.to)
    );
  });

  actions.add('renameColumn', function(value, values, query){
    return (
      "rename column "
    + utils.quoteObject(value.from)
    + " to "
    + utils.quoteObject(value.to)
    );
  });

  actions.add('setSchema', function(value, values, query){
    return 'set schema "' + value + '"';
  });

  actions.add('addColumn', function(value, values, query){
    var output = ["add column"];

    output.push( utils.quoteObject(value.name) );
    output.push( value.type );

    output.push( queryHelpers.get('columnConstraint').fn(value, values, query) );

    return output.join(' ');
  });

  actions.add('dropColumn', function(value, values, query){
    if ( Array.isArray(value) ){
      return value.map( function( v ){
        return actions.get('dropColumn').fn( v, values, query );
      }).join(', ');
    }

    var output = ["drop column"];

    if (value.ifExists)
      output.push( 'if exists' );

    output.push( utils.quoteObject(value.name) );

    if (value.restrict)
      output.push( 'restrict' );

    else if (value.cascade)
      output.push( 'cascade' );

    return output.join(' ');
  });

  actions.add('alterColumn', function(value, values, query){
    if ( Array.isArray(value) ){
      return value.map( function( v ){
        return actions.get('alterColumn').fn( v, values, query );
      }).join(', ');
    }

    var output = ["alter column"];

    output.push( utils.quoteObject(value.name) );

    if (value.type)
      output.push( 'type ' + value.type );

    if (value.collation)
      output.push( 'collate ' + value.collation );

    if (value.using)
      output.push( 'using (' + value.using + ')' );

    if (value.default)
      output.push( 'set default ' + value.default );

    if (value.dropDefault)
      output.push( 'drop default' );

    if (value.notNull == true)
      output.push( 'set not null' );

    if (value.notNull == false)
      output.push( 'drop not null' );

    if (value.statistics)
      output.push( 'set statistics $' + values.push(value.statistics) );

    if (value.storage)
      output.push( 'set storage ' + value.storage );

    return output.join(' ');
  });

  actions.add( 'dropConstraint', function( value, values, query ){
    if ( !value ) return;

    var out = ['drop constraint'];

    if ( typeof value === 'object' ){
      if ( value.ifExists ) out.push('if exists');
      if ( value.name )     out.push('"' + value.name + '"');
      if ( value.cascade )  out.push('cascade');
      if ( value.restrict ) out.push('restrict');
    } else if ( typeof value === 'string' ){
      out.push('"' + value + '"');
    } else return;

    return out.join(' ');
  });

  actions.add( 'addConstraint', function( constraint, values, query ){
    return [
      'add constraint'
    , utils.quoteObject( constraint.name )
    , queryHelpers.get('columnConstraint').fn( constraint, values, query )
    ,
    ].join(' ');
  });

  // Single Parameter actions
  [
    { name: 'enableReplicaTrigger', text: 'enable replica trigger' }
  , { name: 'enableAlwaysTrigger',  text: 'enable always trigger' }
  , { name: 'disableRule',          text: 'disable rule' }
  , { name: 'enableRule',           text: 'enable rule' }
  , { name: 'enableReplicaRule',    text: 'enable replica rule' }
  , { name: 'enableAlwaysRule',     text: 'enable always rule' }
  , { name: 'clusterOn',            text: 'cluster on' }
  , { name: 'inherit',              text: 'inherit' }
  , { name: 'noInherit',            text: 'no inherit' }
  , { name: 'of',                   text: 'of' }
  , { name: 'notOf',                text: 'not of' }
  , { name: 'ownerTo',              text: 'owner to' }
  , { name: 'setTableSpace',        text: 'set tablespace' }
  ].forEach(function(action){
    actions.add( action.name, function(value, values, query){
      return action.text + " " + utils.quoteObject(value);
    });
  });

  // Same text booleans
  [
    { name: 'setWithoutCluster',  text: 'set without cluster' }
  , { name: 'setWithOids',        text: 'set with oids' }
  , { name: 'setWithoutOids',     text: 'set without oids' }
  ].forEach(function(action){
    actions.add( action.name, function(value, values, query){
      return value ? action.text : '';
    });
  });
});

},{"../lib/action-helpers":39,"../lib/query-helpers":46,"../lib/utils":49}],3:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var utils = require('../lib/utils');
  var defs = require('../lib/column-def-helpers');
  var conditional = require('../lib/condition-builder');

  defs.add('type', function(type, values, query){
    return type;
  });

  defs.add('primaryKey', function(primaryKey, values, query){
    if ( !primaryKey ) return '';

    var out = 'primary key';

    if ( typeof primaryKey === 'string' ){
      out += ' ("' + primaryKey + '")';
    } else if ( Array.isArray( primaryKey ) ){
      out += ' ("' + primaryKey.join('", "') + '")';
    }

    return out;
  });

  defs.add('references', function(reference, values, query){
    var output = "references ";
    if (typeof reference == 'string')
      return output + '"' + reference + '"';

    output += '"' + reference.table + '"';

    if (reference.column)
      output += '("' + reference.column + '")';

    if (reference.onDelete)
      output += ' on delete ' + reference.onDelete;

    if (reference.onUpdate)
      output += ' on update ' + reference.onUpdate;

    if (reference.match)
      output += ' match ' + reference.match;

    return output;
  });

  defs.add('notNull', function(notNull, values, query){
    return notNull ? 'not null' : 'null';
  });

  defs.add('null', function($null, values, query){
    if ($null == true) return 'null';
    if ($null == false) return 'not null';
    return '';
  });

  defs.add('unique', function(unique, values, query){
    if (unique == true) return 'unique';

    if ( typeof unique === 'string' ) return 'unique ("' + unique + '")';

    if (Array.isArray(unique))
      return 'unique (' + unique.map(function(column){
        return utils.quoteObject(column)
      }).join(', ') + ')';

    return '';
  });

  defs.add('default', function(def, values, query){
    return def ? ('default ' + def) : '';
  });

  defs.add('check', function(check, values, query){
    return 'check (' + conditional(check, query.__defaultTable, values) + ')';
  });

  defs.add('noInherit', function(noInherit, values, query){
    if (noInherit) return 'no inherit';
    return '';
  });
});
},{"../lib/column-def-helpers":40,"../lib/condition-builder":41,"../lib/utils":49}],4:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  /**
   * Conditionals
   * TODO: update comments :/
   */

  var conditionals = require('../lib/conditional-helpers');
  var queryBuilder = require('../lib/query-builder');

  /**
   * Querying where column is equal to a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be equal to
   */
  conditionals.add('$equals', function(column, value, values, collection){
    var equator = '=';

    return column + ' ' + ((value == 'true' || value == 'false') ? 'is' : '=') + ' ' + value;
  });

  /**
   * Querying where column is not equal to a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be equal to
   */
  conditionals.add('$ne', function(column, value, values, collection){
    return column + ' != ' + value;
  });

  /**
   * Querying where column is greater than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be greater than
   */
  conditionals.add('$gt', function(column, value, values, collection){
    return column + ' > ' + value;
  });

  /**
   * Querying where column is greater than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be greater than
   */
  conditionals.add('$gte', function(column, value, values, collection){
    return column + ' >= ' + value;
  });

  /**
   * Querying where column is less than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be less than
   */
  conditionals.add('$lt', function(column, value, values, collection){
    return column + ' < ' + value;
  });

  /**
   * Querying where column is less than or equal to a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be lte to
   */
  conditionals.add('$lte', function(column, value, values, collection){
    return column + ' <= ' + value;
  });

  /**
   * Querying where value is null
   * @param column {String}  - Column name either table.column or column
   */
  conditionals.add('$null', function(column, value, values, collection){
    return column + ' is null';
  });

  /**
   * Querying where value is null
   * @param column {String}  - Column name either table.column or column
   */
  conditionals.add('$notNull', function(column, value, values, collection){
    return column + ' is not null';
  });

  /**
   * Querying where column is like a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be like
   */
  conditionals.add('$like', function(column, value, values, collection){
    return column + ' like ' + value;
  });

  /**
   * Querying where column is like a value (case insensitive)
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be like
   */
  conditionals.add('$ilike', function(column, value, values, collection){
    return column + ' ilike ' + value;
  });

  /**
   * Querying where column is in a set
   *
   * Values
   * - String, no explaination necessary
   * - Array, joins escaped values with a comma
   * - Function, executes function, expects string in correct format
   *  |- Useful for sub-queries
   *
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - String|Array|Function
   */
  conditionals.add('$in', { cascade: false }, function(column, set, values, collection){
    if (Array.isArray(set)) {
      return column + ' in (' + set.map( function(val){
        return '$' + values.push( val );
      }).join(', ') + ')';
    }

    return column + ' in (' + queryBuilder(set, values).toString() + ')';
  });

  /**
   * Querying where column is not in a set
   *
   * Values
   * - String, no explaination necessary
   * - Array, joins escaped values with a comma
   * - Function, executes function, expects string in correct format
   *  |- Useful for sub-queries
   *
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - String|Array|Function
   */
  conditionals.add('$nin', { cascade: false }, function(column, set, values, collection){
    if (Array.isArray(set)) {
      return column + ' not in (' + set.map( function(val){
        return '$' + values.push( val );
      }).join(', ') + ')';
    }

    return column + ' not in (' + queryBuilder(set, values).toString() + ')';
  });

  conditionals.add('$custom', { cascade: false }, function(column, value, values, collection){
    if (Array.isArray(value))
      return conditionals.get('$custom_array').fn( column, value, values, collection );

    if (typeof value == 'object')
      return conditionals.get('$custom_object').fn( column, value, values, collection );

    throw new Error('Invalid Custom Value Input');
  });

  conditionals.add('$custom_array', { cascade: false }, function(column, value, values, collection){
    var output = value[0];

    for (var i = 1, l = value.length; i < l; ++i){
      output = output.replace(
        RegExp('(\\$)' + i + '(\\W|$)','g')
      , '$1' + values.push(value[i]) + '$2'
      );
    }

    return output;
  });

  conditionals.add('$custom_object', { cascade: false }, function(column, value, values, collection){
    return conditionals.get('$custom_array').fn(column, [value.value].concat(value.values), values, collection);
  });

  conditionals.add('$years_ago', function(column, value, values, collection){
    return column + " >= now() - interval " + value + " year";
  });

  conditionals.add('$months_ago', function(column, value, values, collection){
    return column + " >= now() - interval " + value + " month";
  });

  conditionals.add('$days_ago', function(column, value, values, collection){
    return column + " >= now() - interval " + value + " day";
  });

  conditionals.add('$hours_ago', function(column, value, values, collection){
    return column + " >= now() - interval " + value + " hour";
  });

  conditionals.add('$minutes_ago', function(column, value, values, collection){
    return column + " >= now() - interval " + value + " minute";
  });

  conditionals.add('$seconds_ago', function(column, value, values, collection){
    return column + " >= now() - interval " + value + " second";
  });
});
},{"../lib/conditional-helpers":42,"../lib/query-builder":45}],5:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryTypes = require('../lib/query-types');

  queryTypes.add( 'select', [
    '{with} select {expression} {distinct}'
  , '{columns} {over} {table} {alias}'
  , '{joins} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin}'
  , '{where} {groupBy} {window} {order} {limit} {offset}'
  ].join(' '));

  queryTypes.add(
    'insert'
  , '{with} insert into {table} {columns} {values} {expression} {returning}'
  );

  queryTypes.add(
    'update'
  , '{with} update {table} {values} {updates} {from} {where} {returning}'
  );

  queryTypes.add(
    'delete'
  , '{with} delete from {table} {where} {returning}'
  );

  queryTypes.add(
    'remove'
  , '{with} delete from {table} {alias} {where} {returning}'
  );

  queryTypes.add(
    'create-table'
  , '{with} create table {ifNotExists} {table} ({definition})'
  );

  queryTypes.add(
    'drop-table'
  , '{with} drop table {ifExists} {table} {cascade}'
  );

  queryTypes.add(
    'alter-table'
  , 'alter table {ifExists} {only} {table} {action}'
  );

  queryTypes.add(
    'create-view'
  , 'create {orReplace} {temporary} view {view} {columns} as {expression}'
  );

  queryTypes.add(
    'union'
  , '{with} {queries}'
  );

  queryTypes.add(
    'intersect'
  , '{with} {queries}'
  );

  queryTypes.add(
    'except'
  , '{with} {queries}'
  );

  queryTypes.add('function', '{function}( {expression} )');
  queryTypes.add('expression', '{expression}');
});

},{"../lib/query-types":47}],6:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var actionsHelpers = require('../../lib/action-helpers');
  var utils = require('../../lib/utils');

  helpers.register('action', function(actions, values, query){

    if ( !Array.isArray(actions) ) actions = [actions];

    return actions.map( function( action ){
      var output = "";

      for (var key in action){
        if (actionsHelpers.has(key)){
          output += actionsHelpers.get(key).fn(action[key], values, query);
        }
      }

      return output;
    }).join(', ');


  });

  return module.exports;
});
},{"../../lib/action-helpers":39,"../../lib/query-helpers":46,"../../lib/utils":49}],7:[function(require,module,exports){
/**
 * Query Type: Alias
 *
 * NOTE: This reuqired some special behavior inside of the 
 *       main query-builder. If you're aliasing an expression
 *       then the alias should become the __defaultTable on
 *       the current query.
 */

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var actions = require('../../lib/action-helpers');
  var utils = require('../../lib/utils');

  helpers.register('alias', function(alias, values, query){
    query.__defaultTable = query.alias;
    return '"' + alias + '"';
  });

  return module.exports;
});
},{"../../lib/action-helpers":39,"../../lib/query-helpers":46,"../../lib/utils":49}],8:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var bools = {
    orReplace:  'or replace'
  , temporary:  'temporary'
  , all:        'all'
  };

  Object.keys( bools ).forEach( function( key ){
    helpers.register( key, function( bool, values ){
      return bool ? bools[ key ] : '';
    });
  });

  return module.exports;
});
},{"../../lib/query-helpers":46}],9:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('cascade', function(cascade, values, query){
    return cascade ? 'cascade' : null;
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],10:[function(require,module,exports){
// [ CONSTRAINT constraint_name ]
// { NOT NULL |
//   NULL |
//   CHECK ( expression ) [ NO INHERIT ] |
//   DEFAULT default_expr |
//   UNIQUE index_parameters |
//   PRIMARY KEY index_parameters |
//   REFERENCES reftable [ ( refcolumn ) ] [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ]
//     [ ON DELETE action ] [ ON UPDATE action ] }
// [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers     = require('../../lib/query-helpers');
  var conditional = require('../../lib/condition-builder');
  var columnDefs  = require('../../lib/column-def-helpers');
  var utils       = require('../../lib/utils');

  helpers.register('columnConstraint', function(constraint, values, query){
    var output = [];

    // Null/Not Null
    if (constraint.null)
      output.push( columnDefs.get('null').fn(constraint.null, values, query) )
    if (constraint.notNull)
      output.push( columnDefs.get('notNull').fn(constraint.notNull, values, query) )

    // Check
    if (constraint.check)
      output.push( columnDefs.get('check').fn(constraint.check, values, query) )

    // No Inherit
    if (constraint.noInherit)
      output.push( columnDefs.get('noInherit', true, values, query) )

    // Default expression
    if (constraint.default)
      output.push( columnDefs.get('default').fn(constraint.default, values, query) )

    // Unique
    if (constraint.unique)
      output.push( columnDefs.get('unique').fn(constraint.unique, values, query) )

    // Primary key
    if (constraint.primaryKey)
      output.push( columnDefs.get('primaryKey').fn(constraint.primaryKey, values, query) )

    // Reference
    if (constraint.references)
      output.push( columnDefs.get('references').fn(constraint.references, values, query) );

    // Foreign Key
    if (constraint.foreignKey){
      output.push(
        'foreign key (' + utils.quoteObject( constraint.foreignKey.column ) + ')'
      );

      output.push(
        columnDefs.get('references').fn(
          constraint.foreignKey.references, values, query
        )
      );
    }

    // Single word booleans
    [
      { name: 'deferrable',         text: 'deferrable' }
    , { name: 'notDeferrable',      text: 'not deferrable' }
    , { name: 'initiallyDeferred',  text: 'initially deferred' }
    , { name: 'initiallyImmediate', text: 'initially immediate' }
    ].forEach(function(item){
      if (constraint[item.name])
        output.push( item.text )
    });

    return output.join(' ');
  });

  return module.exports;
});
},{"../../lib/column-def-helpers":40,"../../lib/condition-builder":41,"../../lib/query-helpers":46,"../../lib/utils":49}],11:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryBuilder  = require('../../lib/query-builder');
  var helpers       = require('../../lib/query-helpers');
  var utils         = require('../../lib/utils');

  helpers.register('columns', function(columns, values, query){
    if (typeof columns != 'object') throw new Error('Invalid columns input in query properties');

    if (['insert', 'create-view'].indexOf(query.type) > -1){
      return '(' + columns.map(function(col){
        return utils.quoteObject( col );
      }).join(', ') + ')';
    }

    var output = "";

    if (Array.isArray(columns)){
      for (var i = 0, l = columns.length; i < l; ++i){
        if (typeof columns[i] == 'object' && 'type' in columns[i] && !('expression' in columns[i]))
          output += '(' + queryBuilder( columns[i], values ).toString() + ')';
        else if (typeof columns[i] == 'object' && 'expression' in columns[i])
          output += queryBuilder( columns[i], values ).toString();
        else if (typeof columns[i] == 'object')
          output += utils.quoteObject(columns[i].name, columns[i].table || query.__defaultTable);
        else if (columns[i].indexOf('(') > -1)
          output += columns[i];
        else
          output += utils.quoteObject(columns[i], query.__defaultTable);

        if ( typeof columns[i] == 'object' && ('as' in columns[i] || 'alias' in columns[i]))
          output += ' as "' + (columns[i].as || columns[i].alias) + '"';

        output += ", ";
      }
    } else {
      for (var key in columns){
        if (key.indexOf('(') > -1)
          output += key + ', ';
        else
          output += (
            typeof columns[key] == 'object' && ('table' in columns[key])
          ) ? '(' + queryBuilder( columns[key], values ).toString() + ') as "' + key + '", '
            : typeof columns[key] == 'object' && ('type' in columns[key])
            ? queryBuilder( columns[key], values ).toString() + ' as "' + key + '", '
            : utils.quoteObject(key, query.__defaultTable) + ' as "' + columns[key] + '", ';
      }
    }

    if (output.length > 0) output = output.substring(0, output.length - 2);

    return output;
  });

  return module.exports;
});

},{"../../lib/query-builder":45,"../../lib/query-helpers":46,"../../lib/utils":49}],12:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var defs    = require('../../lib/column-def-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('definition', function(definition, values, query){
    if (typeof definition == 'string') return definition;

    var output = "";

    for (var k in definition){
      output += utils.quoteObject(k);

      for (var j in definition[k])
        if (defs.has(j))
          output += ' ' + defs.get(j).fn(definition[k][j], values, query, j);

      output +=  ", ";
    }

    return output.substring(0, output.length - 2);
  });

  return module.exports;
});
},{"../../lib/column-def-helpers":40,"../../lib/query-helpers":46,"../../lib/utils":49}],13:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('distinct', function(distinct, values, query){
    if (typeof distinct != 'boolean' && !Array.isArray(distinct))
      throw new Error('Invalid distinct type: ' + typeof distinct);

    // distinct on
    if (Array.isArray(distinct)) {
       if(distinct.length == 0) return '';

      return 'distinct on (' + distinct.map(function(col){
        return utils.quoteObject( col );
      }).join(', ') + ')';
    }

    // distinct
    return (distinct) ? 'distinct ': '';
  });

  return module.exports;
});

},{"../../lib/query-helpers":46,"../../lib/utils":49}],14:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('expression', function(exp, values, query){
    if (Array.isArray(exp)) return exp.join(', ');
    if (query.type == 'insert' && typeof exp == 'object')
      return '(' + queryBuilder(exp, values) + ')';
    if (typeof exp == 'object'){
      var val = [
        exp.parenthesis === true ? '( ' : ''
      , queryBuilder(exp, values)
      , exp.parenthesis === true ? ' )' : ''
      ].join('');

      if (Array.isArray(exp.values)){
        for (var i = 0, l = exp.values.length; i < l; ++i){
          val = val.replace(
            RegExp('(\\$)' + (i+1) + '(\\W|$)','g')
          , '$1' + values.push(exp.values[i]) + '$2'
          );
        }
      }

      return val;
    }
    return exp;
  });

  return module.exports;
});
},{"../../lib/query-builder":45,"../../lib/query-helpers":46}],15:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('from', function(from, values, query){
    if (typeof from === 'string') from = [from];
    if (!Array.isArray(from)) throw new Error('Invalid from type: ' + typeof from);

    for (var i = 0, l = from.length; i < l; ++i)
      if (from[i].indexOf('"') == -1) from[i] = '"' + from[i] + '"';

    return 'from ' + from.join(', ');
  });

  return module.exports;
});

},{"../../lib/query-helpers":46,"../../lib/utils":49}],16:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('function', function(fn, values, query){
    return fn;
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],17:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('groupBy', function(groupBy, values, query){
    if (!Array.isArray(groupBy) && typeof groupBy != 'string')
      throw new Error('Invalid groupBy type: ' + typeof groupBy);

    var output = "group by ";

    if (!Array.isArray(groupBy)) groupBy = [groupBy];

    for (var i = 0, l = groupBy.length; i < l; ++i){
      output += utils.quoteObject(groupBy[i], query.__defaultTable) + ', ';
    }

    if (output.indexOf(', ') > -1) output = output.substring(0, output.length - 2);

    return output;
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],18:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('ifExists', function(ifExists, values, query){
    return ifExists ? 'if exists' : null;
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],19:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('ifNotExists', function(ifNotExists, values, query){
    return ifNotExists ? 'if not exists' : null;
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],20:[function(require,module,exports){
/**
 * These query helpers are now deprecated!
 * Please use query helper: joins
 */

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var conditionBuilder = require('../../lib/condition-builder');

  var buildJoin = function(type, joins, values){
    var output = "";
    for (var table in joins){
      output += ' ' + type + ' join "' + table + '" on ';
      output += conditionBuilder(joins[table], table, values);
    }
    return output;
  };

  helpers.register('join', function(join, values, query){
    return " " + buildJoin('', join, values);
  });

  helpers.register('innerJoin', function(join, values, query){
    return " " + buildJoin('inner', join, values);
  });

  helpers.register('leftJoin', function(join, values, query){
    return " " + buildJoin('left', join, values);
  });

  helpers.register('leftOuterJoin', function(join, values, query){
    return " " + buildJoin('left outer', join, values);
  });

  helpers.register('fullOuterJoin', function(join, values, query){
    return " " + buildJoin('full outer', join, values);
  });

  helpers.register('crossOuterJoin', function(join, values, query){
    return " " + buildJoin('cross outer', join, values);
  });

  return module.exports;
});
},{"../../lib/condition-builder":41,"../../lib/query-helpers":46}],21:[function(require,module,exports){
/**
 * Query Helper: Joins
 */

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var conditionBuilder = require('../../lib/condition-builder');
  var queryBuilder = require('../../lib/query-builder');
  var utils = require('../../lib/utils')

  var buildJoin = function(join, values, query){
    // Require a target
    if ( !join.target )
      throw new Error('Invalid join.target type `' + typeof join.target + '` for query helper `joins`');

    // Allow for strings or objects for join.on
    if ( !join.on || ( typeof join.on !== 'string' && typeof join.on !== 'object' ) )
      throw new Error('Invalid join.on type `' + typeof join.on + '` for query helper `joins`');

    var output = ( join.type ? ( join.type + ' ' ) : '' ) + "join ";

    if ( typeof join.target === 'object' ) output += '(' + queryBuilder( join.target, values ) + ') ';
    else {
      output += utils.quoteObject.apply( null, [
        join.target
      , join.schema
      , join.database
      ].filter( function( a ){ return !!a; }) ) + ' ';
    }

    if ( join.alias ) output += '"' + join.alias + '" ';

    if ( typeof join.on === 'string' ) output += 'on ' + join.on;
    else output += 'on ' + conditionBuilder( join.on, join.alias || join.target, values );

    return output;
  };

  helpers.register('joins', function(joins, values, query){
    if ( Array.isArray( joins ) ){
      return joins.map( function( join ){
        return buildJoin( join, values, query );
      }).join(' ');
    }

    if ( typeof joins === 'object' ) {
      return Object.keys( joins ).map(function( val ){
        // For objects, the key is the default alias and target
        if ( !joins[ val ].alias )  joins[ val ].alias = val;
        if ( !joins[ val ].target ) joins[ val ].target = val;

        return buildJoin( joins[ val ], values, query );
      }).join(' ');
    }

    throw new Error('Invalid type `' + typeof joins + '` for query helper `joins`');
  });
});
},{"../../lib/condition-builder":41,"../../lib/query-builder":45,"../../lib/query-helpers":46,"../../lib/utils":49}],22:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');

  helpers.register('limit', function(limit, values){
    if ( typeof limit === 'number' )
      return " limit $" + values.push(limit);
    else if ( typeof limit === 'string' && limit.toLowerCase() === "all" )
      return " limit all";
    else
      throw new Error('Invalid limit type `' + typeof limit  + '` for query helper `limit`. Limit must be number or \'all\'');
  });

  return module.exports;
});
},{"../../lib/query-helpers":46}],23:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');

  helpers.register('offset', function(offset, values){
    return " offset $" + values.push(offset);
  });

  return module.exports;
});
},{"../../lib/query-helpers":46}],24:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('only', function(only, values, query){
    if (only) return "only";
    return "";
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],25:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('order', function(order, values, query){
    var output = "order by ";

    if (typeof order == 'string') return output + order;

    if (Array.isArray(order)) return output + order.join(', ');

    for (var key in order){
      output += utils.quoteObject(key, query.__defaultTable) + ' ' + order[key] + ', ';
    }

    if (output == "order by ") return "";

    return output.substring(0, output.length - 2);;
  });

  return module.exports;
});
},{"../../lib/query-helpers":46,"../../lib/utils":49}],26:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module) {
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('over', function(over, values, query) {
    if (over == null) return '';

    var order = helpers.get('order').fn;
    var partition = helpers.get('partition').fn;
    var clause = (typeof over === 'object') ?
      [
        over.partition ? partition(over.partition, values, query) : ''
      , over.order ? order(over.order, values, query) : ''
      ].join(' ').trim()
    : (over||'').toString();
    return 'over (' + clause + ')';
  });
});

},{"../../lib/query-helpers":46,"../../lib/utils":49}],27:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module) {
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('partition', function(partition, values, query) {
    if (!Array.isArray(partition)) {
      var val = (partition||'').toString();
      partition = val ? [val] : [];
    }

    var clause = partition.map(function(col) {
      return utils.quoteObject(col, query.__defaultTable);
    }).join(', ')

    return clause ? 'partition by ' + clause : '';
  });
});

},{"../../lib/query-helpers":46,"../../lib/utils":49}],28:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register( 'queries', function( queries, values, query ){
    var allowedCombinations = [ 'union', 'intersect', 'except' ];
    var joiner = query.joiner || ' ';

    if ( allowedCombinations.indexOf( query.type ) > -1 ){
      joiner = query.type;

      if ( query.all ){
        joiner += ' ' + helpers.get('all').fn( query.all, values, query );
      }

      joiner = ' ' + joiner + ' ';
    }

    return queries.map( function( q ){
      return queryBuilder( q, values );
    }).join( joiner );
  });

  return module.exports;
});
},{"../../lib/query-builder":45,"../../lib/query-helpers":46}],29:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('returning', function(returning, values, query){
    if ( !Array.isArray(returning) ) throw new Error('Invalid returning input in query properties');
    var oldType = query.type;
    query.type = 'select';
    var output = "returning " + helpers.get('columns').fn(returning, values, query);
    query.type = oldType;
    return output;
  });

  return module.exports;
});

},{"../../lib/query-helpers":46,"../../lib/utils":49}],30:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');
  var utils = require('../../lib/utils');

  helpers.register('table', function(table, values, query){
    if ( typeof table == 'object' && 'type' in table && !('alias' in table))
      throw new Error('Sub query table selects must have an `alias` specified');

    if (typeof table != 'string' && typeof table != 'object') throw new Error('Invalid table type: ' + typeof table);

    if ( typeof table == 'object' && !Array.isArray(table)){
      var alias = table.alias;

      // Remove alias because we're going to consume that property here
      delete table.alias;

      return 'from (' + queryBuilder(table, values) + ') "' + alias + '"';
    }

    if (!Array.isArray(table)) table = [table];

    for (var i = 0, l = table.length; i < l; ++i)
      if (table[i].indexOf('"') == -1) table[i] = utils.quoteObject( table[i] );

    return (query.type === 'select' ? 'from ' : '') + table.join(', ');
  });

  return module.exports;
});
},{"../../lib/query-builder":45,"../../lib/query-helpers":46,"../../lib/utils":49}],31:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryTypes = require('../../lib/query-helpers');
  var updateHelpers = require('../../lib/update-helpers');
  var utils = require('../../lib/utils');

  queryTypes.register('updates', function($updates, values, query){
    var output = "set ";

    var result = Object.keys( $updates ).map( function( key ){
      if (updateHelpers.has(key))
        return updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
      if ($updates[key] === null)
        return utils.quoteObject(key) + ' = null';
      return utils.quoteObject(key) + ' = $' + values.push($updates[key]);
    });

    return result.length > 0 ? ('set ' + result.join(', ')) : '';
  });

  return module.exports;
});

},{"../../lib/query-helpers":46,"../../lib/update-helpers":48,"../../lib/utils":49}],32:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('values', function(values, valuesArray, query){
    if (typeof values != 'object') throw new Error('Invalid values input in query properties')

    if (query.type === 'update')
      return helpers.get('updates').fn(values, valuesArray, query);

    if ( !Array.isArray( values ) ) values = [ values ];

    if ( values.length == 0 ) throw new Error('MoSQL.queryHelper.values - Invalid values array length `0`');

    // Build object keys union
    var keys = [], checkKeys = function( k ){
      if ( keys.indexOf( k ) > -1 ) return;
      keys.push( k );
    };

    for ( var i = 0, l = values.length; i < l; ++i ) {
      Object.keys( values[i] ).forEach( checkKeys )
    }

    var allValues = values.map( function( value ){
      var result = [];
      for ( var i = 0, l = keys.length; i < l; ++i ){
        if (value[ keys[i] ] === null || value[ keys[i] ] === undefined) {
          result.push('null');
        } else if (typeof value[ keys[i] ] == 'object' && 'type' in value[ keys[i] ]){
          result.push('(' + queryBuilder( value[ keys[i] ], valuesArray ) + ')');
        } else {
          result.push('$' + valuesArray.push(value[keys[i]]));
        }
      }
      return '(' + result.join(', ') + ')';
    }).join(', ')

    return '("' + keys.join('", "') + '") values ' + allValues;
  });

  return module.exports;
});

},{"../../lib/query-builder":45,"../../lib/query-helpers":46}],33:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');

  helpers.register('view', function(view, values, query){
    return '"' + view + '"';
  });

  return module.exports;
});
},{"../../lib/query-helpers":46}],34:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var conditionBuilder = require('../../lib/condition-builder');

  helpers.register('where', function(where, values, query){
    var output = conditionBuilder(where, query.__defaultTable, values);
    if (output.length > 0) output = 'where ' + output;
    return output;
  });

  return module.exports;
});
},{"../../lib/condition-builder":41,"../../lib/query-helpers":46}],35:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module) {
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register( 'window', function(win, values, query) {
    var out = ['window'];

    if ( win.name ){
      out.push( utils.quoteObject( win.name ) )
    }

    if ( typeof win.as === 'object' ){
      out.push('as (');

      if ( win.as.existing ){
        out.push( utils.quoteObject( win.as.existing ) );
      } else {
        // Supported sub-types in window expression
        [
          'partition'
        , 'order'
        , 'groupBy'
        ].forEach( function( type ){
          if ( win.as[ type ] ){
            out.push( helpers.get( type ).fn( win.as[ type ], values, query ) );
          }
        });
      }

      out.push(')');
    }

    return out.join(' ');
  });
});

},{"../../lib/query-helpers":46,"../../lib/utils":49}],36:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('with', function(withObj, values, query){
    if (typeof withObj != 'object') return '';

    // Avoid mutating objects by storing objSyntax names in this array.
    // Indices match up with the newly created withObj array
    var names = [];

    // Convert Object syntax to array syntax, pushing to names
    if ( !Array.isArray( withObj ) ){
      withObj = Object.keys( withObj ).map( function( name ){
        names.push( name );
        return withObj[ name ];
      });
    }

    var output = withObj.map( function( obj, i ){
      var name = 'name' in obj ? obj.name : names[ i ];

      if ( !name ) throw new Error('MoSQL.queryHelper.with requires property `name`');

      return '"' + name + '"' + ' as (' + queryBuilder( obj, values ) + ')';
    }).join(', ');

    return output ? ( 'with ' + output) : '';
  });

  return module.exports;
});
},{"../../lib/query-builder":45,"../../lib/query-helpers":46}],37:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  /**
   * Update Behaviors
   */

  var helpers = require('../lib/update-helpers');
  var utils = require('../lib/utils');

  /**
   * Increment column
   * Example:
   *  { $inc: { clicks: 1 } }
   * @param  {Object} Hash whose keys are the columns to inc and values are how much it will inc
   */
  helpers.add('$inc', function(value, values, collection){
    var output = "";

    for (var key in value){
      output += utils.quoteObject(key) + ' = ' + utils.quoteObject(key, collection) + ' + $' + values.push(value[key]);
    }

    return output;
  });

  /**
   * Decrement column
   * Example:
   *  { $dec: { clicks: 1 } }
   * @param  {Object} Hash whose keys are the columns to dec and values are how much it will inc
   */
  helpers.add('$dec', function(value, values, collection){
    var output = "";

    for (var key in value){
      output += utils.quoteObject(key) + ' = ' + utils.quoteObject(key, collection) + ' - $' + values.push(value[key]);
    }

    return output;
  });
});
},{"../lib/update-helpers":48,"../lib/utils":49}],38:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  require('./lib/normalize');

  var
    build               = require('./lib/query-builder')
  , queryTypes          = require('./lib/query-types')
  , queryHelpers        = require('./lib/query-helpers')
  , conditionalHelpers  = require('./lib/conditional-helpers')
  , updateHelpers       = require('./lib/update-helpers')
  , actionHelpers       = require('./lib/action-helpers')
  , columnDefHelpers    = require('./lib/column-def-helpers')
  , quoteObject         = require('./lib/utils').quoteObject
  ;

  // Register query types
  require('./helpers/query-types');

  // Register query helpers
  require('./helpers/query/columns');
  require('./helpers/query/group-by');
  require('./helpers/query/joins');
  require('./helpers/query/joins-dep');
  require('./helpers/query/order');
  require('./helpers/query/updates');
  require('./helpers/query/where');
  require('./helpers/query/limit');
  require('./helpers/query/offset');
  require('./helpers/query/returning');
  require('./helpers/query/values');
  require('./helpers/query/table');
  require('./helpers/query/if-not-exists');
  require('./helpers/query/if-exists');
  require('./helpers/query/definition');
  require('./helpers/query/cascade');
  require('./helpers/query/with');
  require('./helpers/query/only');
  require('./helpers/query/action');
  require('./helpers/query/column-constraint');
  require('./helpers/query/alias');
  require('./helpers/query/expression');
  require('./helpers/query/from');
  require('./helpers/query/distinct');
  require('./helpers/query/boolean-helpers');
  require('./helpers/query/view');
  require('./helpers/query/function');
  require('./helpers/query/partition');
  require('./helpers/query/over');
  require('./helpers/query/window');
  require('./helpers/query/queries');

  // Register conditional helpers
  require('./helpers/conditional');

  // Register update helpers
  require('./helpers/update');

  // Register column definition helpers
  require('./helpers/column-definitions')

  // Register column action helpers
  require('./helpers/actions')

  module.exports.sql = build;
  module.exports.toQuery = function() {
    return build.apply(build, arguments).toQuery();
  };

  module.exports.queryTypes = queryTypes;
  module.exports.registerQueryType = queryTypes.add;

  module.exports.queryHelpers = queryHelpers;
  module.exports.registerQueryHelper = function(name, options, fn){
    return queryHelpers.add(name, options, fn);
  };

  module.exports.conditionalHelpers = conditionalHelpers;
  module.exports.registerConditionalHelper = function(name, options, fn){
    return conditionalHelpers.add(name, options, fn);
  };

  module.exports.actionHelpers = actionHelpers;
  module.exports.registerActionHelper = function(name, options, fn){
    return actionHelpers.add(name, options, fn);
  };

  module.exports.updateHelpers = updateHelpers;
  module.exports.registerUpdateHelper = function(name, options, fn){
    return updateHelpers.add(name, options, fn);
  };

  module.exports.columnDefHelpers = columnDefHelpers;
  module.exports.registerColumnDefHelper = function(name, options, fn){
    return columnDefHelpers.add(name, options, fn);
  };

  module.exports.quoteObject = quoteObject;
  // Legacy support
  module.exports.quoteColumn = quoteObject;

  return module.exports;
});

},{"./helpers/actions":2,"./helpers/column-definitions":3,"./helpers/conditional":4,"./helpers/query-types":5,"./helpers/query/action":6,"./helpers/query/alias":7,"./helpers/query/boolean-helpers":8,"./helpers/query/cascade":9,"./helpers/query/column-constraint":10,"./helpers/query/columns":11,"./helpers/query/definition":12,"./helpers/query/distinct":13,"./helpers/query/expression":14,"./helpers/query/from":15,"./helpers/query/function":16,"./helpers/query/group-by":17,"./helpers/query/if-exists":18,"./helpers/query/if-not-exists":19,"./helpers/query/joins":21,"./helpers/query/joins-dep":20,"./helpers/query/limit":22,"./helpers/query/offset":23,"./helpers/query/only":24,"./helpers/query/order":25,"./helpers/query/over":26,"./helpers/query/partition":27,"./helpers/query/queries":28,"./helpers/query/returning":29,"./helpers/query/table":30,"./helpers/query/updates":31,"./helpers/query/values":32,"./helpers/query/view":33,"./helpers/query/where":34,"./helpers/query/window":35,"./helpers/query/with":36,"./helpers/update":37,"./lib/action-helpers":39,"./lib/column-def-helpers":40,"./lib/conditional-helpers":42,"./lib/normalize":44,"./lib/query-builder":45,"./lib/query-helpers":46,"./lib/query-types":47,"./lib/update-helpers":48,"./lib/utils":49}],39:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var HelperManager = require('./helper-manager');
  return module.exports = new HelperManager();
});
},{"./helper-manager":43}],40:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var HelperManager = require('./helper-manager');
  module.exports = new HelperManager();

  return module.exports;
});
},{"./helper-manager":43}],41:[function(require,module,exports){
(function (Buffer){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var
    utils   = require('./utils')
  , helpers = require('./conditional-helpers')
  ;

  module.exports = function(where, table, values){
    var buildConditions = function(where, condition, column, joiner){
      joiner = joiner || ' and ';
      if (column) column = utils.quoteObject(column, table);

      var conditions = [], result;

      for (var key in where){

        // If the value is null, send a $null helper through the condition builder
        if ( where[key] == null ){
          var tmp = {};
          tmp[key] = { $null: true };
          conditions.push( buildConditions(tmp, condition, column, joiner) );
          continue;
        }

        if (typeof where[key] == 'object' && !(where[key] instanceof Date) && !Buffer.isBuffer(where[key])){

          // Key is conditional block
          if (helpers.has(key)){
            // If it cascades, run it through the builder using the helper key
            // as the current condition
            // If it doesn't cascade, run the helper immediately
            if (helpers.get(key).options.cascade)
              (result = buildConditions(where[key], key, column)) && conditions.push(result)
            else
              (result = helpers.get(key).fn(column, where[key], values, table)) && conditions.push(result);
          }

          // Key is Joiner
          else if (key == '$or')
            (result = buildConditions(where[key], condition, column, ' or ')) && conditions.push(result);
          else if (key == '$and')
            (result = buildConditions(where[key], condition, column)) && conditions.push(result);

          // Key is array index
          else if (+key >= 0)
            (result = buildConditions(where[key], condition, column)) && conditions.push(result);

          // Key is column
          else
            (result = buildConditions(where[key], condition, key)) && conditions.push(result);

          continue;
        }

        // Key is a helper, use that for this value
        if (helpers.has(key))
          conditions.push(
            helpers.get(key).fn(
              column
            , utils.parameterize(where[key], values)
            , values
            , table
            )
          );

        // Key is an array index
        else if (+key >= 0)
          conditions.push(
            helpers.get(condition).fn(
              column
            , utils.parameterize(where[key], values)
            , values
            , table
            )
          );

        // Key is a column
        else
          conditions.push(
            helpers.get(condition).fn(
              utils.quoteObject(key, table)
            , utils.parameterize(where[key], values)
            , values
            , table
            )
          );
      }

      if (conditions.length > 1) return '(' + conditions.join(joiner) + ')';
      if (conditions.length == 1) return conditions[0];
    };

    // Always remove outer-most parenthesis
    var result = buildConditions(where, '$equals');
    if (!result) return '';
    if (result[0] == '(') return result.substring(1, result.length - 1);
    return result;
  };

  return module.exports;
});

}).call(this,require("buffer").Buffer)
},{"./conditional-helpers":42,"./utils":49,"buffer":53}],42:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var HelperManager = require('./helper-manager');

  module.exports = new HelperManager({ cascade: true });

  return module.exports;
});
},{"./helper-manager":43}],43:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var HelperManager = function(defaults){
    this.defaults = defaults || {};
    this.helpers = {};
    return this;
  };

  HelperManager.prototype.get = function(name){
    if (!this.has(name)) throw new Error('Cannot find helper: ' + name);
    return this.helpers[name];
  };

  HelperManager.prototype.has = function(name){
    return this.helpers.hasOwnProperty(name);
  };

  HelperManager.prototype.add = function(name, options, fn){
    if (typeof options == 'function'){
      fn = options;
      options = {};
    }

    options = options || {};

    for (var key in this.defaults){
      if (!(key in options)) options[key] = this.defaults[key];
    }

    this.helpers[name] = { fn: fn, options: options };

    return this;
  };

  HelperManager.prototype.register = function(name, options, fn){
    return this.add(name, options, fn);
  };

  module.exports = HelperManager;

  return module.exports;
});
},{}],44:[function(require,module,exports){
(function (Buffer){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  // When condition builder is checking sub-objects, one of the
  // steps is to make sure we're not traversing a buffer
  if ( typeof Buffer === 'undefined' ){
    window.Buffer = function(){};
    window.Buffer.isBuffer = function(){
      return false;
    };
  }
});
}).call(this,require("buffer").Buffer)
},{"buffer":53}],45:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryTypes = require('./query-types');
  var queryHelpers = require('./query-helpers');

  /**
   * Main SQL Building function
   * @param  {Object} query
   * @param  {Array}  values
   * @return {String}
   */
  module.exports = function(query, values){
    if (!query.type){
      query.type = 'expression';
    } else if (!queryTypes.has(query.type)){
      query.function = query.type;
      query.type = 'function';
    }

    var
      type      = queryTypes.get(query.type)
    , variables = type.match(/\{\w+\}/g)
    , values    = values || []
    ;

    query.__defaultTable = Array.isArray(query.table) ? query.table[0] : query.table;

    // Table was a sub-query, use alias of the sub-query
    if ( typeof query.__defaultTable == 'object' ){
      query.__defaultTable = query.__defaultTable.alias;
    }

    if (query.alias) query.__defaultTable = query.alias;

    if (!query.columns && query.type == 'select' && query.table){
      query.columns = ['*'];
    }

    for (var i = 0, l = variables.length, key; i < l; ++i){
      // If there exists a builder function and input in the options
      // corresponding to the query helper name, then run that
      // helper function with the value of the query->helper_key
      type = type.replace(
        variables[i]
      , queryHelpers.has(key = variables[i].substring(1, variables[i].length - 1)) && query[key]
        ? queryHelpers.get(key).fn(query[key], values, query)
        : ''
      );
    }

    var result = {
      query :   type.trim().replace(/\s+/g, " ")
    , values:   values
    , original: query
    };

    result.toString = function(){ return result.query; };
    result.toQuery = function() { return { text: result.query, values: result.values } };

    return result;
  };

  return module.exports;
});

},{"./query-helpers":46,"./query-types":47}],46:[function(require,module,exports){
module.exports=require(40)
},{"./helper-manager":43}],47:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var types = {};

  module.exports.add = function(type, query){
    types[type] = query;
  };

  module.exports.get = function(type){
    return types[type];
  };

  module.exports.has = function(type){
    return types.hasOwnProperty(type);
  };

  Object.defineProperty(module.exports, 'list', {
    get: function() {
      return Object.keys(types);
    }
  });

  return module.exports;
});
},{}],48:[function(require,module,exports){
module.exports=require(42)
},{"./helper-manager":43}],49:[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var utils = module.exports = {};
  var regs = {
    dereferenceOperators: /[-#=]+>+/g
  , endsInCast: /::\w+$/
  };

  utils.parameterize = function(value, values){
    if (typeof value == 'boolean') return value ? 'true' : 'false';
    if (value[0] != '$') return '$' + values.push(value);
    if (value[value.length - 1] != '$') return '$' + values.push(value);
    return utils.quoteObject(value.substring(1, value.length - 1));
  };

  utils.quoteColumn = utils.quoteObject = function(field, collection){
    var period;
    var rest = Array.prototype.slice.call( arguments, 1 );
    var split;

    // Wierdly on phantomjs Number.isNaN is undefined
    // FIXME: find the root cause
    var checkIsNaN = Number.isNaN || isNaN;

    // Split up database and/or schema definition
    for(var i=0;i<rest.length;++i) {
      if(rest[i].indexOf('.')) {
        split = rest[i].split('.');
        rest.splice(i,1);
        split.forEach(function(s) {
          rest.splice(i,0,s);
        });
      }
    }

    // They're casting
    if ( regs.endsInCast.test( field ) ){
      return utils.quoteObject.apply(
        null
      , [ field.replace( regs.endsInCast, '' ) ].concat( rest )
      ) + field.match( regs.endsInCast )[0];
    }

    // They're using JSON/Hstore operators
    if ( regs.dereferenceOperators.test( field ) ){
      var operators = field.match( regs.dereferenceOperators );

      // Split on operators
      return field.split(
        regs.dereferenceOperators
      // Properly quote each part
      ).map( function( part, i ){
        if ( i === 0 ) return utils.quoteObject.apply( null, [ part ].concat( rest ) );

        if ( checkIsNaN( parseInt( part ) ) && part.indexOf("'") === -1 ){
          return "'" + part + "'";
        }

        return part;
      // Re-join fields and operators
      }).reduce( function( a, b, i ){
        return [ a, b ].join( operators[ i - 1 ] );
      });
    }

    // Just using *, no collection
    if (field.indexOf('*') == 0 && collection)
      return '"' + collection + '".*';

    // Using *, specified collection, used quotes
    else if (field.indexOf('".*') > -1)
      return field;

    // Using *, specified collection, didn't use quotes
    else if (field.indexOf('.*') > -1)
      return '"' + field.split('.')[0] + '".*';

    // No periods specified in field, use explicit `table[, schema[, database] ]`
    else if (field.indexOf('.') === -1)
      return '"' + ( rest.reverse() ).concat( field.replace( /\"/g, '' ) ).join('"."') + '"';

    // Otherwise, a `.` was in there, just quote whatever was specified
    else
      return '"' + field.replace( /\"/g, '' ).split('.').join('"."') + '"';
  };

  utils.quoteValue = function(value){
    var num = parseInt(value), isNum = (typeof num == 'number' && (num < 0 || num > 0));
    return isNum ? value : "$$" + value + "$$";
  };

  /**
   * Returns a function that when called, will call the
   * passed in function with a specific set of arguments
   */
  utils.with = function(fn){
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){ fn.apply({}, args); };
  };


  return module.exports;
});

},{}],50:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":52}],51:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],52:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":51,"_process":57,"inherits":56}],53:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
var TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    if (encoding === 'base64')
      subject = base64clean(subject)
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str.toString()
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.compare = function (a, b) {
  assert(Buffer.isBuffer(a) && Buffer.isBuffer(b), 'Arguments must be Buffers')
  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) {
    return -1
  }
  if (y < x) {
    return 1
  }
  return 0
}

// BUFFER INSTANCE METHODS
// =======================

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end === undefined) ? self.length : Number(end)

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = asciiSlice(self, start, end)
      break
    case 'binary':
      ret = binarySlice(self, start, end)
      break
    case 'base64':
      ret = base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

Buffer.prototype.equals = function (b) {
  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.compare = function (b) {
  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  if (TYPED_ARRAY_SUPPORT) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return readUInt16(this, offset, false, noAssert)
}

function readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return readInt16(this, offset, false, noAssert)
}

function readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return readInt32(this, offset, false, noAssert)
}

function readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return readFloat(this, offset, false, noAssert)
}

function readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
  return offset + 1
}

function writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
  return offset + 2
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  return writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  return writeUInt16(this, value, offset, false, noAssert)
}

function writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
  return offset + 4
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  return writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  return writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
  return offset + 1
}

function writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
  return offset + 2
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  return writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  return writeInt16(this, value, offset, false, noAssert)
}

function writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
  return offset + 4
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  return writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  return writeInt32(this, value, offset, false, noAssert)
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":54,"ieee754":55}],54:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],55:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],56:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],57:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[1]);
