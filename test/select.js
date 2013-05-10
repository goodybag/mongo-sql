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

    it ('should build a query selecting on users where id = $1', function(){
      var query = builder.sql({
        type: 'select'
      , table: 'users'
      , where: { id: 5 }
      });

      assert.equal(
        query.toString()
      , 'select "users".* from "users" where ("users"."id" = $1)'
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
      , 'select "users".* from "users" where ("users"."id" = $1 and "users"."name" = $2)'
      );

      assert.deepEqual(
        query.values
      , [5, 'Bob']
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
      , 'select "users".* from "users" where ("users"."id" = $1 or "users"."name" = $2)'
      );

      assert.deepEqual(
        query.values
      , [5, 'Bob']
      );
    });
  });
});