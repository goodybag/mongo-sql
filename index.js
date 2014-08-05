
require('./lib/normalize');

var
  build               = require('./lib/query-builder')
, queryTypes          = require('./lib/query-types')
, queryHelpers        = require('./lib/query-helpers')
, conditionalHelpers  = require('./lib/conditional-helpers')
, updateHelpers       = require('./lib/update-helpers')
, actionHelpers       = require('./lib/action-helpers')
, columnDefHelpers    = require('./lib/column-def-helpers')
, quoteObject         = require('./lib/utils').quoteObject
;

// Register query types
require('./helpers/query-types');

// Register query helpers
require('./helpers/query/columns');
require('./helpers/query/group-by');
require('./helpers/query/joins');
require('./helpers/query/joins-dep');
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
require('./helpers/query/only');
require('./helpers/query/action');
require('./helpers/query/column-constraint');
require('./helpers/query/alias');
require('./helpers/query/expression');
require('./helpers/query/from');
require('./helpers/query/distinct');
require('./helpers/query/boolean-helpers');
require('./helpers/query/view');
require('./helpers/query/function');
require('./helpers/query/partition');
require('./helpers/query/over');
require('./helpers/query/window');
require('./helpers/query/queries');

// Register conditional helpers
require('./helpers/conditional');

// Register update helpers
require('./helpers/update');

// Register column definition helpers
require('./helpers/column-definitions');

// Register column action helpers
require('./helpers/actions');

module.exports.sql = build;
module.exports.toQuery = function() {
  return build.apply(build, arguments).toQuery();
};

module.exports.queryTypes = queryTypes;
module.exports.registerQueryType = queryTypes.add;

module.exports.queryHelpers = queryHelpers;
module.exports.registerQueryHelper = function(name, options, fn){
  return queryHelpers.add(name, options, fn);
};

module.exports.conditionalHelpers = conditionalHelpers;
module.exports.registerConditionalHelper = function(name, options, fn){
  return conditionalHelpers.add(name, options, fn);
};

module.exports.actionHelpers = actionHelpers;
module.exports.registerActionHelper = function(name, options, fn){
  return actionHelpers.add(name, options, fn);
};

module.exports.updateHelpers = updateHelpers;
module.exports.registerUpdateHelper = function(name, options, fn){
  return updateHelpers.add(name, options, fn);
};

module.exports.columnDefHelpers = columnDefHelpers;
module.exports.registerColumnDefHelper = function(name, options, fn){
  return columnDefHelpers.add(name, options, fn);
};

module.exports.quoteObject = quoteObject;
// Legacy support
module.exports.quoteColumn = quoteObject;
