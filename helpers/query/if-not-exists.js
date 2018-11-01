
var helpers = require('../../lib/query-helpers');

helpers.register('ifNotExists', function(ifNotExists, values, query){
  return ifNotExists ? 'if not exists' : null;
});
