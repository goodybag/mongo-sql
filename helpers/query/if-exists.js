
var helpers = require('../../lib/query-helpers');

helpers.register('ifExists', function(ifExists) {
  return ifExists ? 'if exists' : null;
});
