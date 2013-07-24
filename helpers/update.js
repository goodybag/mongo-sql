if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
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
  helpers.add('$inc', function(value, values, collection){
    var output = "";

    for (var key in value){
      output += utils.quoteColumn(key) + ' = ' + utils.quoteColumn(key, collection) + ' + $' + values.push(value[key]);
    }

    return output;
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
      output += utils.quoteColumn(key) + ' = ' + utils.quoteColumn(key, collection) + ' - $' + values.push(value[key]);
    }

    return output;
  });
});