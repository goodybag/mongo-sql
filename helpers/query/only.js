
var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('only', function(only, values, query){
  if (only) return "only";
  return "";
});
