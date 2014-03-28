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