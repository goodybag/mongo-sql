var assert  = require('assert');
var builder = require('../../');

describe('Built-In Query Types', function(){

  describe('Type: select', function(){

    it ('should build a query selecting on users', function(){
      assert(
        builder.sql({
          type: 'select'
        , table: 'users'
        })
      , 'select "users".* from "users"'
      );
    });

    it ('should specify columns', function(){
      assert(
        builder.sql({
          type: 'select'
        , table: 'users'
        , columns: ['id', 'name']
        })
      , 'select "users"."id", "users"."name" from "users"'
      );
    });

    it ('should specify multiple tables', function(){
      assert(
        builder.sql({
          type: 'select'
        , tables: ['users', 'groups']
        })
      , 'select * from "users", "groups"'
      );
    });

    it ('should specify multiple tables and columns '
      + 'from both tables assuming that if a table '
      + 'name is not specified in the column definition, '
      + 'then the first table is default', function(){
      assert(
        builder.sql({
          type: 'select'
        , table: ['users', 'groups']
        , columns: ['id', 'name', 'groups.name']
        })
      , 'select "users"."id", "users"."name", "groups"."name" from "users", "groups"'
      );
    });

    it ('should specify multiple tables and columns '
      + 'from both tables assuming that if a table '
      + 'name is not specified in the column definition, '
      + 'then the first table is default, using an object'
      + 'as the column definition', function(){
      assert(
        builder.sql({
          type: 'select'
        , table: ['users', 'groups']
        , columns: {
            'id':           'id'
          , 'name':         'name'
          , 'groups.name':  'group'
          }
        })
      , 'select "users"."id", "users"."name", "groups"."name" from "users", "groups"'
      );
    });

  });

});