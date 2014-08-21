
var queryTypes = require('./query-types');
var queryHelpers = require('./query-helpers');

/**
 * Main SQL Building function
 * @param  {Object} query
 * @param  {Array}  values
 * @return {String}
 */
module.exports = function(query, values){
  if (!query.type){
    query.type = 'expression';
  } else if (!queryTypes.has(query.type)){
    query.function = query.type;
    query.type = 'function';
  }

  var
    type      = queryTypes.get(query.type)
  , variables = type.match(/\{\w+\}/g);

  values    = values || [];

  query.__defaultTable = Array.isArray(query.table) ? query.table[0] : query.table;

  // Table was a sub-query, use alias of the sub-query
  if ( typeof query.__defaultTable == 'object' ){
    query.__defaultTable = query.__defaultTable.alias;
  }

  if (query.alias) query.__defaultTable = query.alias;

  if (!query.columns && query.type == 'select' && query.table){
    query.columns = ['*'];
  }

  for (var i = 0, l = variables.length, key; i < l; ++i){
    // If there exists a builder function and input in the options
    // corresponding to the query helper name, then run that
    // helper function with the value of the query->helper_key
    type = type.replace(
      variables[i]
    , queryHelpers.has(key = variables[i].substring(1, variables[i].length - 1)) && query[key] ?
      queryHelpers.get(key).fn(query[key], values, query) : ''
    );
  }

  var result = {
    query :   type.trim().replace(/\s+/g, " ")
  , values:   values
  , original: query
  };

  result.toString = function(){ return result.query; };
  result.toQuery = function() { return { text: result.query, values: result.values }; };

  return result;
};
