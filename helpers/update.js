
/**
 * Update Behaviors
 */

var helpers = require('../lib/update-helpers');
var utils = require('../lib/utils');

/**
 * Increment column
 * Example:
 *  { $inc: { clicks: 1 } }
 * @param  {Object} Hash whose keys are the columns to inc and values are how much it will inc
 */
helpers.add('$inc', function(value, values, collection) {
  return Object.keys(value).map(function (key) {
    return utils.quoteObject(key) + ' = ' + utils.quoteObject(key, collection) + ' + $' + values.push(value[key]);
  }).join(', ');
});

/**
 * Decrement column
 * Example:
 *  { $dec: { clicks: 1 } }
 * @param  {Object} Hash whose keys are the columns to dec and values are how much it will inc
 */
helpers.add('$dec', function(value, values, collection){
  var output = "";

  for (var key in value){
    output += utils.quoteObject(key) + ' = ' + utils.quoteObject(key, collection) + ' - $' + values.push(value[key]);
  }

  return output;
});

/**
 * Creates a custom helper on the fly, much like in the conditional helper system.
 * Example:
 *   $custom: {
 *     images: ['$1::jsonb || images', JSON.stringify([image])],
 *     number_of_images: 'jsonb_array_length(images) + 1',
 *   }
 * @param {Object} Hash whose keys are the columns to be assigned to the custom helper
 */
helpers.add('$custom', function(value, values) {
  return Object.keys(value)
    .map(function(key) {
      var localToGlobalValuesIndices = {};
      var newValue = !Array.isArray(value[key])
        ? value[key]
        : value[key][0].replace(/\$\d+/g, function(match) {
            var localIndex = match.slice(1);
            var globalIndex =
              localIndex in localToGlobalValuesIndices
                ? localToGlobalValuesIndices[localIndex]
                : values.push(value[key][localIndex]);
            localToGlobalValuesIndices[localIndex] = globalIndex;
            return '$' + globalIndex;
          });
      return utils.quoteObject(key) + ' = ' + newValue;
    })
    .join(', ');
});
