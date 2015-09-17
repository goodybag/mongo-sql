
var helpers = require('../../lib/query-helpers');
var conditionBuilder = require('../../lib/condition-builder');

helpers.register('having', function(having, values, query){
  var output = conditionBuilder(having, query.__defaultTable, values);
  if (output.length > 0) output = 'having ' + output;
  return output;
});
