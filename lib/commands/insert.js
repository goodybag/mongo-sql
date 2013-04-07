/**
 * collection.insert
 */

var builders  = require('../builders');

module.exports = function(inputs, options){
  var
    query = 'insert into "{collection}" ({fields}) values ({values}) {returning}'

  , defaults = {
      returning: ['"' + this.collection + '".id']
    }
  ;

  if (typeof options === "function"){
    callback = options;
    options = defaults;
  } else {
    // Save plan for later use
    if (options.defer){
      var this_ = this;

      // Don't defer again
      options.defer = false;

      // This is bound to be leaky :/
      return function(values){
        if (values) options.values = values;
        return module.exports.call(this_, $query, options);
      };
    }

    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  query.collection = this.collection;
  query.fields = sql.fields().addObjectKeys(inputs);
  query.values = sql.fields().addObjectValues(inputs, query);

  if (options.returning){
    // Escape returning fields
    for (var i = options.returning.length - 1, period, ret; i >= 0; i--){
      ret = '"' + options.returning[i];

      if ((period = ret.indexOf(".")) > -1){
        ret = ret.substring(0, period) + '"."' + ret.substring(period + 1);
      }

      options.returning[i] = ret + '"';
    };

    query.returning = "returning " + options.returning;
  }


};