if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');
  var utils = require('../../lib/utils');

  helpers.register('table', function(table, values, query){
    if ( typeof table == 'object' && 'type' in table && !('alias' in table))
      throw new Error('Sub query table selects must have an `alias` specified');

    if (typeof table != 'string' && typeof table != 'object') throw new Error('Invalid table type: ' + typeof table);

    if ( typeof table == 'object' && !Array.isArray(table)){
      var alias = table.alias;

      // Remove alias because we're going to consume that property here
      delete table.alias;

      return 'from (' + queryBuilder(table, values) + ') "' + alias + '"';
    }

    if (!Array.isArray(table)) table = [table];

    for (var i = 0, l = table.length; i < l; ++i)
      if (table[i].indexOf('"') == -1) table[i] = '"' + table[i] + '"';

    return (query.type === 'select' ? 'from ' : '') + table.join(', ');
  });

  return module.exports;
});