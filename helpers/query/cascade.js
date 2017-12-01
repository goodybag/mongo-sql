
var helpers = require('../../lib/query-helpers');

helpers.register('cascade', function(cascade) {
  return cascade ? 'cascade' : null;
});
