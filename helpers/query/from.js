
var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('from', function(from, values, query){
  if (typeof from === 'string') from = [from];
  if (!Array.isArray(from)) throw new Error('Invalid from type: ' + typeof from);

  for (var i = 0, l = from.length; i < l; ++i)
    if (from[i].indexOf('"') == -1) from[i] = '"' + from[i] + '"';

  return 'from ' + from.join(', ');
});
