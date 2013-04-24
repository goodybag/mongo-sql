var utils = module.exports = {};

utils.quoteColumn =  function(field, collection){
  var output = "", period;

  // They already quoted both and specified
  if (field.indexOf('"."') > -1)
    output += field;

  // They quoted collection, but not field
  else if ((period = field.indexOf('".')) > -1)
    output += field.substring(0, period + 2) + '"' + field.substring(period + 2) + '"';

  // Included collection, but didn't quote anything
  else if ((period = field.indexOf(".")) > -1)
    output += '"' + field.substring(0, period) + '"."' + field.substring(period + 1) + '"'

  // Didn't include collection, but did quote
  else if (field.indexOf('"') > -1 && collection)
    output += '"' + collection + '".' + field;

  // No collection, no quotes
  else if (collection)
    output += '"' + collection + '"."' + field + '"';

  // No collection, no quotes
  else
    output += '"' + field + '"';

  return output;
};

utils.quoteValue = function(value){
  var num = parseInt(value), isNum = (typeof num == 'number' && (num < 0 || num > 0));
  return isNum ? value : "$$" + value + "$$";
};

/**
 * Returns a function that when called, will call the
 * passed in function with a specific set of arguments
 */
utils.with = on(fn){
  var args = Array.prototype.slice.call(arguments, 1);
  return function(){ fn.apply({}, args); };
};
