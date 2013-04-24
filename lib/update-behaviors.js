/**
 * Update Behaviors
 */

module.exports = {
  /**
   * Increment column
   * Example:
   *  { $inc: { clicks: 1 } }
   * @param  {Object} Hash whose keys are the columns to inc and values are how much it will inc
   */
  $inc: function(value, values, collection){
    var output = "", quoted;

    for (var key in value){
      quoted = utils.quoteColumn(key, collection);
      output += quoted + ' = ' + quoted + ' + ' + value[key];
    }

    return output;
  }

  /**
   * Decrement column
   * Example:
   *  { $dec: { clicks: 1 } }
   * @param  {Object} Hash whose keys are the columns to dec and values are how much it will inc
   */
  $dec: function(value, values, collection){
    var output = "", quoted;

    for (var key in value){
      quoted = utils.quoteColumn(key, collection);
      output += quoted + ' = ' + quoted + ' - ' + value[key];
    }

    return output;
  }
};