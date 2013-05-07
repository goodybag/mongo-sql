var helpers = require('./');

helpers.register('columns', function(columns, values, query){
  if (typeof columns != 'object') throw new Error('Invalid columns input in query properties');

  var output = "";

  for (var key in columns)
    output += (key.indexOf('"') == -1 ? ('"' + key + '"') : key) + ", ";

  if (output.length > 0) output = output.substring(0, output.length - 2);

  return output;
});