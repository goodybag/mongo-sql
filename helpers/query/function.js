
var helpers = require('../../lib/query-helpers');

helpers.register('function', function(fn, values, query){
  return fn;
});
