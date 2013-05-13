var queryTypes = require('../../lib/query-helpers');
var updateHelpers = require('../../lib/update-helpers');
var utils = require('../../lib/utils');

queryTypes.register('updates', function($updates, values, query){
  var output = "set ";
  
  // Use update behavior, otherwise just use standard
  for (var key in $updates){
    if (updateHelpers.has(key)) output += updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
    else output += utils.quoteColumn(key) + ' = $' + values.push($updates[key]);

    output += ", ";
  }

  output = output.substring(0, output.length - 2);

  return output;
});