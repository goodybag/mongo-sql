
var helpers = require('../../lib/query-helpers');

helpers.register('cascade', function(cascade, values, query){
  return cascade ? 'cascade' : null;
});
