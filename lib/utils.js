var utils = module.exports = {};

utils.parameterize = function(value, values){
  if (typeof value == 'boolean') return value ? 'true' : 'false';
  if (value[0] != '$') return '$' + values.push(value);
  if (value[value.length - 1] != '$') return '$' + values.push(value);
  return utils.quoteColumn(value.substring(1, value.length - 1));
};

utils.quoteColumn =  function(field, collection){
  var period;
  
  // Just using *, no collection
  if (field.indexOf('*') == 0 && collection)
    return '"' + collection + '".*';

  // Using *, specified collection, used quotes
  else if (field.indexOf('".*') > -1)
    return field;

  // Using *, specified collection, didn't use quotes
  else if (field.indexOf('.*') > -1)
    return '"' + field.split('.')[0] + '".*';

  // They already quoted both and specified
  else if (field.indexOf('"."') > -1)
    return field;

  // They quoted collection, but not field
  else if ((period = field.indexOf('".')) > -1)
    return field.substring(0, period + 2) + '"' + field.substring(period + 2) + '"';

  // Included collection, but didn't quote anything
  else if ((period = field.indexOf(".")) > -1)
    return '"' + field.substring(0, period) + '"."' + field.substring(period + 1) + '"'

  // Didn't include collection, but did quote
  else if (field.indexOf('"') > -1 && collection)
    return '"' + collection + '".' + field;

  // No collection, no quotes
  else if (collection)
    return '"' + collection + '"."' + field + '"';

  // No collection, no quotes and no collection provided
  else
    return '"' + field + '"';
};

utils.quoteValue = function(value){
  var num = parseInt(value), isNum = (typeof num == 'number' && (num < 0 || num > 0));
  return isNum ? value : "$$" + value + "$$";
};

/**
 * Returns a function that when called, will call the
 * passed in function with a specific set of arguments
 */
utils.with = function(fn){
  var args = Array.prototype.slice.call(arguments, 1);
  return function(){ fn.apply({}, args); };
};
