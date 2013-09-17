if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('values', function(values, valuesArray, query){
    if (typeof values != 'object') throw new Error('Invalid values input in query properties')

    if (query.type === 'update')
      return helpers.get('updates').fn(values, valuesArray, query);

    if ( !Array.isArray( values ) ) values = [ values ];

    if ( values.length == 0 ) throw new Error('MoSQL.queryHelper.values - Invalid values array length `0`');

    var allValues = values.map( function( value ){
      var result = [];
      for (var key in value){
        if (value[ key ] === null) {
          result.push('null');
        } else if (typeof value[ key ] == 'object' && 'type' in value[ key ]){
          result.push('(' + queryBuilder( value[ key ], valuesArray ) + ')');
        } else {
          result.push('$' + valuesArray.push(value[key]));
        }
      }
      return '(' + result.join(', ') + ')';
    }).join(', ')

    return '("' + Object.keys(values[0]).join('", "') + '") values ' + allValues;
  });

  return module.exports;
});
