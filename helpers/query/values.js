var helpers = require('../../lib/query-helpers');

helpers.register('values', function(columns, valuesArray, query){
  if (typeof columns != 'object') throw new Error('Invalid values input in query properties')

  var output = "";

  for (var key in columns) output += "$" + valuesArray.push(columns[key]) + ", ";

  if (output.length > 0) output = output.substring(0, output.length - 2);

  return output;
});