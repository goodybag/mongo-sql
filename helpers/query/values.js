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

    var result = [];
    for (var key in values){
      if (values[ key ] === null) {
        result.push('null');
      } else if (typeof values[ key ] == 'object' && 'type' in values[ key ]){
        result.push('(' + queryBuilder( values[ key ], valuesArray ) + ')');
      } else {
        result.push('$' + valuesArray.push(values[key]));
      }
    }

    return '("' + Object.keys(values).join('", "') + '") values (' + result.join(', ') + ')';
  });

  return module.exports;
});
