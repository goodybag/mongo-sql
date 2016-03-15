
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
    if ( typeof from == 'object' && 'type' in from && !('alias' in from) ){
      throw new Error('Sub query from selects must have an `alias` specified');
    }

    var alias = utils.quoteObject( from.alias );

    // Remove alias because we're going to consume that property here
    delete from.alias;

    return 'from (' + queryBuilder( from, values ) + ') ' + alias;
  }

  throw new Error('Invalid from type: ' + typeof from);
});
