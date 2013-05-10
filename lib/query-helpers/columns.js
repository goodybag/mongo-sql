var helpers = require('./');
var utils   = require('../utils');

helpers.register('columns', function(columns, values, query){
  if (typeof columns != 'object') throw new Error('Invalid columns input in query properties');

  var output = "";

  if (Array.isArray(columns)){
    for (var i = 0, l = columns.length; i < l; ++i)
      output += utils.quoteColumn(columns[i], query.__defaultTable) + ', ';
  } else {
    for (var key in columns)
      output += utils.quoteColumn(key, query.__defaultTable) + ' as "' + columns[key] + '", ';
  }

  if (output.length > 0) output = output.substring(0, output.length - 2);

  return output;
});