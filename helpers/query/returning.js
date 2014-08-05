
var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('returning', function(returning, values, query){
  if ( !Array.isArray(returning) ) throw new Error('Invalid returning input in query properties');
  var oldType = query.type;
  query.type = 'select';
  var output = "returning " + helpers.get('columns').fn(returning, values, query);
  query.type = oldType;
  return output;
});
