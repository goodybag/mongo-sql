
var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register( 'queries', function( queries, values, query ){
  var allowedCombinations = [ 'union', 'intersect', 'except' ];
  var joiner = query.joiner || ' ';

  if ( allowedCombinations.indexOf( query.type ) > -1 ){
    joiner = query.type;

    if ( query.all ){
      joiner += ' ' + helpers.get('all').fn( query.all, values, query );
    }

    joiner = ' ' + joiner + ' ';
  }

  return queries.map( function( q ){
    return queryBuilder( q, values );
  }).join( joiner );
});
