
var helpers = require('../../lib/query-helpers');

helpers.register('offset', function(offset, values){
  return " offset $" + values.push(offset);
});
