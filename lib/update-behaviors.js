/**
 * Update Behaviors
 */

module.exports = {
  /**
   * Increment column
   * Example:
   *  { $inc: { clicks: 1 } }
   * @param  {Object} Hash whose keys are the columns to inc and values are how much it will inc
   * @param  {Object} query Sql generator query object
   */
  $inc: function(value, query){
    for (var key in value)
      query.updates.fields.push('"' + key + '" = "' + key + '" + ' + value[key]);
  }
};