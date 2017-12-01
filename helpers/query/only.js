
var helpers = require('../../lib/query-helpers');

helpers.register('only', function(only) {
  if (only) return 'only';
  return '';
});
