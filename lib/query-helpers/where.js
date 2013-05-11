var helpers = require('./');
var conditionBuilder = require('../condition-builder');

helpers.register('where', function(where, values, query){
  var output = conditionBuilder(where, query.__defaultTable, values);
  if (output.length > 0) output = 'where ' + output;
  return output;
});