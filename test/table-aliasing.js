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