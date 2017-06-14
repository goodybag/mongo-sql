
var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');
var utils = require('../../lib/utils');

helpers.register('table', function(table, values, query){

  if (typeof table != 'string' && typeof table != 'object') throw new Error('Invalid table type: ' + typeof table);

  if ( typeof table == 'object' && !Array.isArray(table)){
    if ('alias' in query) {
      return 'from (' + queryBuilder(table, values) + ')';
    } else {
      throw new Error("Sub query needs an alias")
    }
  }

  if (!Array.isArray(table)) table = [table];

  for (var i = 0, l = table.length; i < l; ++i)
    if (table[i].indexOf('"') == -1) table[i] = utils.quoteObject( table[i] );

  return (query.type === 'select' ? 'from ' : '') + table.join(', ');
});
