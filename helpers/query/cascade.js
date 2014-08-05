
var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('cascade', function(cascade, values, query){
  return cascade ? 'cascade' : null;
});
