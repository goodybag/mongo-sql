//// {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin}
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
    , 'select "users".* from "users" join "groups" on ("groups"."id" = "users"."id")'
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
    , 'select "users".* from "users" left join "groups" on ("groups"."id" = "users"."id")'
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
    , 'select "users".* from "users" inner join "groups" on ("groups"."id" = "users"."id")'
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
    , 'select "users".* from "users" left outer join "groups" on ("groups"."id" = "users"."id")'
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
    , 'select "users".* from "users" full outer join "groups" on ("groups"."id" = "users"."id")'
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
    , 'select "users".* from "users" cross outer join "groups" on ("groups"."id" = "users"."id")'
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

    console.log(query.toString());

    assert.equal(
      query.toString()
    , 'select "users".* from "users" join "groups" on ("groups"."id" = "users"."id") and ("groups"."groupId" > $1) and ("users"."name" != $2)'
    );

    assert.deepEqual(
      query.values
    , [3, 'Bob']
    );
  });

});