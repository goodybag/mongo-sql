if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('with', function(withObj, values, query){
    if (typeof withObj != 'object') return '';

    var output = Object.keys( withObj ).map( function( alias ){
      return '"' + alias + '"' + ' as (' + queryBuilder( withObj[ alias ], values ) + ')';
    }).join(', ');

    return output ? ( 'with ' + output) : '';
  });

  return module.exports;
});