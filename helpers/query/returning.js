var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('returning', function(returning, values, query){
  var output = "returning ";

  for (var i = 0, l = returning.length, period; i < l; ++i){
    output += utils.quoteColumn(returning[i], query.__defaultTable);

    if (i != l - 1) output += ", ";
  }

  return output;
});