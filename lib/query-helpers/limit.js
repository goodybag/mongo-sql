var helpers = require('./');

helpers.register('limit', function(limit, values){
  return " limit $" + values.push(limit);
});