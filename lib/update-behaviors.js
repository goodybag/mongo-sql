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
  $inc: function(value){
    var output = "", quoted;

    for (var key in value){
      quoted = utils.quoteColumn(key);
      output += quoted + ' = ' + quoted + ' + ' + value[key];
    }
    
    return output;
  }
};