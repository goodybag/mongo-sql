/**
 * collection.delete
 */

var builders  = require('../builders');

module.exports = function($query, options){
  // query by id shorthand
  if (typeof $query !== "object") $query = { id: $query };
  
  var
    query = 'delete from {collection} {where}'

  , defaults = {}

  , queryProps = {
      collection: this.collection
    , where:      $query
    }

  , values
  , result
  ;

  if (!options) options = defaults;
  else {
    // Save plan for later use - like sub-queries
    if (options.defer){
      var this_ = this;

      // Don't defer again
      options.defer = false;

      // As long as the deferred function is eventually called
      // This shouldn't be leaky
      return function(values){
        if (values) options.values = values;
        return module.exports.call(this_, $query, options);
      };
    }

    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  values = options.values || [];

  // Provide interface that node-pg likes to work with
  // TODO: fairly sure this toString function is leaky
  result = {
    query:    builders.query(query, values, queryProps)
  , values:   values
  , toString: function(){ return result.query; }
  };

  return result;
};