var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register('values', function(values, valuesArray, query){
  if (typeof values != 'object') throw new Error('Invalid values input in query properties');

  if (query.type === 'update')
    return helpers.get('updates').fn(values, valuesArray, query);

  if ( !Array.isArray( values ) ) values = [ values ];

  if ( values.length === 0 ) throw new Error('MoSQL.queryHelper.values - Invalid values array length `0`');

  // Build object keys union
  var keys = [], checkKeys = function( k ){
    if ( keys.indexOf( k ) > -1 ) return;
    keys.push( k );
  };

  for ( var i = 0, l = values.length; i < l; ++i ) {
    Object.keys( values[i] ).forEach( checkKeys );
  }

  var allValues = values.map( function( value ) {
    var result = [];
    for ( var i = 0, l = keys.length; i < l; ++i ){
      if (value[ keys[i] ] === null || value[ keys[i] ] === undefined) {
        result.push('null');
      } else if (typeof value[ keys[i] ] == 'object' && 'type' in value[ keys[i] ]) {
        result.push('(' + queryBuilder( value[ keys[i] ], valuesArray ) + ')');
      } else {
        result.push('$' + valuesArray.push(value[keys[i]]));
      }
    }
    return '(' + result.join(', ') + ')';
  }).join(', ');

  return '("' + keys.join('", "') + '") values ' + allValues;
});
