/**
 * Query Type: Alias
 *
 * NOTE: This reuqired some special behavior inside of the
 *       main query-builder. If you're aliasing an expression
 *       then the alias should become the __defaultTable on
 *       the current query.
 */

var helpers = require('../../lib/query-helpers');
var actions = require('../../lib/action-helpers');
var utils = require('../../lib/utils');

helpers.register('alias', function(alias, values, query){
  query.__defaultTable = query.alias;
  return '"' + alias + '"';
});
