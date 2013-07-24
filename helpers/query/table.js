if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('table', function(table, values, collection){
    if (typeof table != 'string' && !Array.isArray(table)) throw new Error('Invalid table type: ' + typeof table);

    if (!Array.isArray(table)) table = [table];

    for (var i = 0, l = table.length; i < l; ++i)
      if (table[i].indexOf('"') == -1) table[i] = '"' + table[i] + '"';
    
    return table.join(', ');
  });

  return module.exports;
});