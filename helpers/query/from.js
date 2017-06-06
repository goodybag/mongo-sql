
var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');
var utils = require('../../lib/utils');

helpers.register('from', function(from, values, query){
  if ( typeof from === 'string' ){
    return 'from ' + utils.quoteObject( from );
  }

  if ( Array.isArray( from ) ){
    return 'from ' + from.map( function( table ){
      return utils.quoteObject( table );
    }).join(', ');
  }

  if ( typeof from === 'object' ){
    if ('alias' in query) {
      return 'from (' + queryBuilder( from, values ) + ') "' + query.alias +'"';
    } else {
      throw new Error('Alias needs to be specified for sub query');
    }
  }

  throw new Error('Invalid from type: ' + typeof from);
});
