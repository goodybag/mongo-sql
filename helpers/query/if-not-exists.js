
var helpers = require('../../lib/query-helpers');

helpers.register('ifNotExists', function(ifNotExists) {
  return ifNotExists ? 'if not exists' : null;
});
