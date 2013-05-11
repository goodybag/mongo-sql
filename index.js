var
  queryTypes    = require('./lib/types')
;

// Dirrrrty require query-helpers... need to re-organize!
require('./lib/query-helpers/columns');
require('./lib/query-helpers/group-by');
require('./lib/query-helpers/joins');
require('./lib/query-helpers/order');
require('./lib/query-helpers/updates');
require('./lib/query-helpers/where');
require('./lib/query-helpers/index');
require('./lib/query-helpers/limit');
require('./lib/query-helpers/offset');
require('./lib/query-helpers/returning');
require('./lib/query-helpers/values');
require('./lib/query-helpers/table');

module.exports.sql = require('./lib/query-builder');

module.exports.registerQueryType = queryTypes.registerQueryType;

module.exports.registerQueryHelper = function(name, fn){

};