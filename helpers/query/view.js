
var helpers = require('../../lib/query-helpers');

helpers.register('view', function(view) {
  return '"' + view + '"';
});
