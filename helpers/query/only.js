
var helpers = require('../../lib/query-helpers');

helpers.register('only', function(only, values, query){
  if (only) return "only";
  return "";
});
