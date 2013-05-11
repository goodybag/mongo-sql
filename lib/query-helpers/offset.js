var helpers = require('./');

helpers.register('offset', function(offset, values){
  return " offset $" + values.push(offset);
});