
var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('groupBy', function(groupBy, values, query){
  if (!Array.isArray(groupBy) && typeof groupBy != 'string')
    throw new Error('Invalid groupBy type: ' + typeof groupBy);

  if (typeof groupBy === 'string' ) {
    groupBy = [groupBy]
  }

  return 'group by ' + helpers.get('columns').fn(groupBy, values, query)
});
