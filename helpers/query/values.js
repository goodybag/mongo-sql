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

    var output = '("' + Object.keys(values).join('", "') + '") values (';

    for (var key in values){
      if (typeof values[ key ] == 'object' && 'type' in values[ key ]){
        output += '(' + queryBuilder( values[ key ], valuesArray ) + '), ';
      } else {
        output += '$' + valuesArray.push(values[key]) + ', ';
      }
    }

    if (output.length > 0) output = output.substring(0, output.length - 2);

    return output + ')';
  });

  return module.exports;
});