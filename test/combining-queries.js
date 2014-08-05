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
        'with "other_users2" as (select "users".* from "users") ' +
        'select "users".* from "users"'
      , 'select "other_users".* from "other_users"'
      , 'select "other_users2".* from "other_users2"'
      ].join(' union ')
    );
  });
});