
var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('ifNotExists', function(ifNotExists, values, query){
  return ifNotExists ? 'if not exists' : null;
});
