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