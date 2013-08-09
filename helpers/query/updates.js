if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryTypes = require('../../lib/query-helpers');
  var updateHelpers = require('../../lib/update-helpers');
  var utils = require('../../lib/utils');

  queryTypes.register('updates', function($updates, values, query){
    var output = "set ";

    var result = Object.keys( $updates ).map( function( key ){
      if (updateHelpers.has(key))
        return updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
      return utils.quoteColumn(key) + ' = $' + values.push($updates[key]);
    });

    return result.length > 0 ? ('set ' + result.join(', ')) : '';
  });

  return module.exports;
});