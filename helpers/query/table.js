var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('table', function(table, values, collection){
  if (typeof table != 'string' && !Array.isArray(table)) throw new Error('Invalid table type: ' + typeof table);

  if (!Array.isArray(table)) table = [table];

  for (var i = 0, l = table.length; i < l; ++i)
    if (table[i].indexOf('"') == -1) table[i] = '"' + table[i] + '"';
  
  return table.join(', ');
});