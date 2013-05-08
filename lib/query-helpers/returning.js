var helpers = require('./');
var valueHelpers = require('../helpers').value;
var utils = require('../utils')''

helpers.register('returning', function(returning, values, query){
  var output = "returning ";
  var table = query.table;

  if (!table && !query.tables && query.tables.length == 0)
    throw new Error('Cannot build update with no table specified')

  for (var i = 0, l = fields.length, period; i < l; ++i){
    output += utils.quoteColumn(fields[i], table);

    if (i != l - 1) output += ", ";
  }

  return output;
});