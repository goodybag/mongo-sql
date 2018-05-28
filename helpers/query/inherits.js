
var helpers = require('../../lib/query-helpers');
var quoteObject = require('../../lib/utils').quoteObject;

helpers.register('inherits', function(parents, values, query){
  if (typeof parents !== 'object') {
    throw new Error('Invalid values for inherits. It accepts array of strings');
  }
  return 'inherits ('
    + parents.map(function (item) {return quoteObject(item);}).join(',')
    + ')';
});