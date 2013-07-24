if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  /**
   * Main SQL Building function
   * @param  {Object} query
   * @param  {Array}  values
   * @return {String}
   */
  module.exports = function(query, values){
    if (!queryTypes.has(query.type)) throw new Error('Cannot find query type ' + query.type);

    var
      query     = queryTypes.get(query.type)
    , variables = query.match(/\{\w+\}/g)
    , values    = values || []
    ;

    for (var i = 0, l = variables.length, key; i < l; ++i){
      // If there exists a builder function and input in the options
      // corresponding to the query helper name, then run that
      // helper function with the value of the query->helper_key
      query = query.replace(
        '{' + (key = variables[i].substring(1, variables[i].length - 1)) + '}'
      , queryHelpers.has(key) && query[key]
        ? queryHelpers.get(key)(query[key], values, query)
        : ''
      );
    }

    return query.trim().replace(/\s+/g, " ");
  };

  return module.exports;
});