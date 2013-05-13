var helpers = require('../../lib/query-helpers');

helpers.register('limit', function(limit, values){
  return " limit $" + values.push(limit);
});