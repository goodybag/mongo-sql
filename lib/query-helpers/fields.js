var helpers = require('./');

helpers.register('fields', function(fields){
  if (Array.isArray(fields)) return fields.join(', ');
  if (typeof fields != 'object') throw new Error('Invalid fields input in query properties');

  var n = 0, output = "", column;

  for (var key in fields){

    // Using a function
    if (key.indexOf('(') > -1) column = key;
    else column = '"' + key.split('.').join('"."') + '"';

    output += (n++ > 0 ? ', ' : ' ') + column + ' as "' + fields[key] + '"';
  }

  return output;
});