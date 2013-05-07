var
  queryTypes    = require('./lib/queryTypes')
, queryHelpers  = require('./lib/query-helpers')
;

module.exports.sql = require('./query-builder');

module.exports.registerQueryType = queryTypes.registerQueryType;

module.exports.registerQueryHelper = function(name, fn){

};