if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('expression', function(exp, values, query){
    if (Array.isArray(exp)) return exp.join(', ');
    if (query.type == 'insert' && typeof exp == 'object')
      return '(' + queryBuilder(exp, values) + ')';
    if (typeof exp == 'object') return queryBuilder(exp, values);
    return exp;
  });

  return module.exports;
});