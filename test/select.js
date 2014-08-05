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

    it ('should specify multiple tables and columns ' +
        'from both tables assuming that if a table ' +
        'name is not specified in the column definition, ' +
        'then the first table is default', function(){

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

    it ('should specify multiple tables and columns ' +
        'from both tables assuming that if a table ' +
        'name is not specified in the column definition, ' +
        'then the first table is default, using an object' +
        'as the column definition', function(){

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