var queryTypes = require('../../lib/query-helpers');
var updateHelpers = require('../../lib/update-helpers');
var utils = require('../../lib/utils');
var queryBuilder = require('../../lib/query-builder');

queryTypes.register('updates', function($updates, values, query){
  var output = "set ";

  var result = Object.keys( $updates ).map( function( key ){
    if (updateHelpers.has(key)){
      return updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
    }

    if ($updates[key] === null){
      return utils.quoteObject(key) + ' = null';
    }

    if (typeof $updates[ key ] == 'object' && 'type' in $updates[ key ]){
      return utils.quoteObject(key) + ' = ( ' + queryBuilder( $updates[ key ], values ) + ' )';
    }
    return utils.quoteObject(key) + ' = $' + values.push($updates[key]);
  });

  return result.length > 0 ? ('set ' + result.join(', ')) : '';
});
