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
    if (typeof exp == 'object'){
      var val = [
        exp.parenthesis === true ? '( ' : ''
      , queryBuilder(exp, values)
      , exp.parenthesis === true ? ' )' : ''
      ].join('');

      if (Array.isArray(exp.values)){
        for (var i = 0, l = exp.values.length; i < l; ++i){
          val = val.replace(
            RegExp('(\\$)' + (i+1) + '(\\W|$)','g')
          , '$1' + values.push(exp.values[i]) + '$2'
          );
        }
      }

      return val;
    }
    return exp;
  });

  return module.exports;
});