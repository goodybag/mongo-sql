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

  it ('$gt', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: { id: { $gt: 5 } }
    });

    assert.equal(
      query.toString()
    , 'select "users".* from "users" where ("users"."id" > $1)'
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
    , 'select "users".* from "users" where ("users"."id" > $1 and "users"."name" > $2)'
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
    , 'select "users".* from "users" where ("users"."id" >= $1)'
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
    , 'select "users".* from "users" where ("users"."id" >= $1 and "users"."name" >= $2)'
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
    , 'select "users".* from "users" where ("users"."id" < $1)'
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
    , 'select "users".* from "users" where ("users"."id" < $1 and "users"."name" < $2)'
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
    , 'select "users".* from "users" where ("users"."id" <= $1)'
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
    , 'select "users".* from "users" where ("users"."id" <= $1 and "users"."name" <= $2)'
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
    , 'select "users".* from "users" where ("users"."id" is null)'
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
    , 'select "users".* from "users" where ("users"."id" is not null)'
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
    , 'select "users".* from "users" where ("users"."name" like $1)'
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
    , 'select "users".* from "users" where ("users"."name" ilike $1)'
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
    , 'select "users".* from "users" where ('
      + '"users"."id" in ('
        + 'select "groups"."userId" from "groups" where ('
          + '"groups"."groupId" = $1)))'
    );

    assert.deepEqual(
      query.values
    , [5]
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
    , 'select "users".* from "users" where ('
      + '"users"."id" not in ('
        + 'select "groups"."userId" from "groups" where ('
          + '"groups"."groupId" = $1)))'
    );

    assert.deepEqual(
      query.values
    , [5]
    );
  });

  it ('should allow an arbitrary amount of conditions', function(){
    var query = builder.sql({
      type: 'select'
    , table: 'users'
    , where: {
        name: 'Bob'
      , id: { $lt: 500 }
      , $or: { groupId: [7, 8] }
      }
    });
console.log(query.toString())
    assert.equal(
      query.toString()
    , 'select "users".* from "users" where ("users"."name" = $1 and ("users"."id" < $2) and ("users"."groupId" = $3 or "users."groupId" = $4))'
    );

    assert.deepEqual(
      query.values
    , ['Bob', 500, 7, 8]
    );
  });

});