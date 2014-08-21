
var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('distinct', function(distinct, values, query){
  if (typeof distinct != 'boolean' && !Array.isArray(distinct))
    throw new Error('Invalid distinct type: ' + typeof distinct);

  // distinct on
  if (Array.isArray(distinct)) {
     if(distinct.length === 0) return '';

    return 'distinct on (' + distinct.map(function(col){
      return utils.quoteObject( col );
    }).join(', ') + ')';
  }

  // distinct
  return (distinct) ? 'distinct ': '';
});
