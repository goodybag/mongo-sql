var helpers = require('./');
var valueHelpers = require('../helpers').value;
var utils = require('../utils');

helpers.register('updates', function($updates, values, query){
  var output = "set ";
  var table = query.table;

  if (!table && !query.tables && query.tables.length == 0)
    throw new Error('Cannot build update with no table specified')

  // Use update behavior, otherwise just use standard
  for (var key in $updates){
    if (valueHelpers.has(key)) output += valueHelpers.get(key)($updates[key], values, table);
    else output += utils.quoteColumn(key, table) + ' = $' + values.push($updates[key]);

    output += ", ";
  }

  output = output.substring(0, output.length - 2);

  return output;
});