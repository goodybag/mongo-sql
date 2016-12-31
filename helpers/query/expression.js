var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register('expression', function(exp, values, query){
  if (Array.isArray(exp)) {
    var expObj = { expression: exp[0], values: exp.slice(1) }
    return helpers.get('expression').fn(expObj, values, query)
  }

  if (query.type == 'insert' && typeof exp == 'object')
    return '(' + queryBuilder(exp, values) + ')';
  if (typeof exp == 'object'){
    var expValues = Array.isArray(exp.values) ? exp.values : []

    var val = [
      exp.parenthesis === true ? '( ' : ''
    , queryBuilder(exp, expValues)
    , exp.parenthesis === true ? ' )' : ''
    ].join('');

    var localToGlobalValuesIndices = {}

    return val.replace(/\$\d+/g, function(match) {
      var i = +match.slice(1);

      var globalI = i in localToGlobalValuesIndices
        ? localToGlobalValuesIndices[i]
        : values.push(expValues[i - 1]);

      localToGlobalValuesIndices[i] = globalI;

      return '$' + globalI;
    });
  }

  return exp
});
