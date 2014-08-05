
var queryTypes = require('../../lib/query-helpers');
var updateHelpers = require('../../lib/update-helpers');
var utils = require('../../lib/utils');

queryTypes.register('updates', function($updates, values, query){
  var output = "set ";

  var result = Object.keys( $updates ).map( function( key ){
    if (updateHelpers.has(key))
      return updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
    if ($updates[key] === null)
      return utils.quoteObject(key) + ' = null';
    return utils.quoteObject(key) + ' = $' + values.push($updates[key]);
  });

  return result.length > 0 ? ('set ' + result.join(', ')) : '';
});
