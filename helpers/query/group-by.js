
var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('groupBy', function(groupBy, values, query){
  if (!Array.isArray(groupBy) && typeof groupBy != 'string')
    throw new Error('Invalid groupBy type: ' + typeof groupBy);

  var output = "group by ";

  if (!Array.isArray(groupBy)) groupBy = [groupBy];

  for (var i = 0, l = groupBy.length; i < l; ++i){
    output += utils.quoteObject(groupBy[i], query.__defaultTable) + ', ';
  }

  if (output.indexOf(', ') > -1) output = output.substring(0, output.length - 2);

  return output;
});
