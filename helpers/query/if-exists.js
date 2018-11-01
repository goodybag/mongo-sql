
var helpers = require('../../lib/query-helpers');

helpers.register('ifExists', function(ifExists, values, query){
  return ifExists ? 'if exists' : null;
});
