
var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('function', function(fn, values, query){
  return fn;
});
