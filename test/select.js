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
  });
});