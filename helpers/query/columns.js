if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryBuilder  = require('../../lib/query-builder');
  var helpers       = require('../../lib/query-helpers');
  var utils         = require('../../lib/utils');

  helpers.register('columns', function(columns, values, query){
    if (typeof columns != 'object') throw new Error('Invalid columns input in query properties');

    var output = "";

    if (Array.isArray(columns)){
      for (var i = 0, l = columns.length; i < l; ++i){
        if (typeof columns[i] == 'object')
          output += queryBuilder( columns[i], values ).toString();
        else if (columns[i].indexOf('(') > -1)
          output += columns[i];
        else
          output += utils.quoteColumn(columns[i], query.__defaultTable);

        output += ", ";
      }
    } else {
      for (var key in columns){
        if (key.indexOf('(') > -1)
          output += key + ', ';
        else
          output += (
            typeof columns[key] == 'object' && ('type' in columns[key])
          ) ? queryBuilder( columns[key], values ).toString() + ' as "' + key + '", '
            : utils.quoteColumn(key, query.__defaultTable) + ' as "' + columns[key] + '", ';
      }
    }

    if (output.length > 0) output = output.substring(0, output.length - 2);

    return output;
  });

  return module.exports;
});