var
  queryTypes    = require('./lib/types')
, queryHelpers  = require('./lib/query-helpers')
;

// Dirrrrty require query-helpers... need to re-organize!
require('./lib/query-helpers/collection');
require('./lib/query-helpers/columns');
require('./lib/query-helpers/group-by');
require('./lib/query-helpers/joins');
require('./lib/query-helpers/order');
require('./lib/query-helpers/updates');
require('./lib/query-helpers/where');
require('./lib/query-helpers/collections');
require('./lib/query-helpers/fields');
require('./lib/query-helpers/index');
require('./lib/query-helpers/limit');
require('./lib/query-helpers/returning');
require('./lib/query-helpers/values');

module.exports.sql = require('./query-builder');

module.exports.registerQueryType = queryTypes.registerQueryType;

module.exports.registerQueryHelper = function(name, fn){

};