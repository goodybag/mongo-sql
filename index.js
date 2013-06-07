var
  build               = require('./lib/query-builder')
, queryTypes          = require('./lib/query-types')
, queryHelpers        = require('./lib/query-helpers')
, conditionalHelpers  = require('./lib/conditional-helpers')
;

// Register query types
require('./helpers/query-types');

// Register query helpers
require('./helpers/query/columns');
require('./helpers/query/group-by');
require('./helpers/query/joins');
require('./helpers/query/order');
require('./helpers/query/updates');
require('./helpers/query/where');
require('./helpers/query/limit');
require('./helpers/query/offset');
require('./helpers/query/returning');
require('./helpers/query/values');
require('./helpers/query/table');
require('./helpers/query/if-not-exists');
require('./helpers/query/if-exists');
require('./helpers/query/definition');
require('./helpers/query/cascade');
require('./helpers/query/with');

// Register conditional helpers
require('./helpers/conditional');

// Register update helpers
require('./helpers/update');

// Register column definition helpers
require('./helpers/column-definitions')

module.exports.sql = build;
module.exports.registerQueryType = queryTypes.add;

module.exports.registerQueryHelper = function(name, options, fn){
  return queryHelpers.add(name, options, fn);
};

module.exports.registerConditionalHelper = function(name, options, fn){
  return conditionalHelpers.add(name, options, fn);
};
