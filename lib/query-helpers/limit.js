var helpers = require('./');

helpers.register('limit', function(limit){
  return " limit " + limit;
});