/**
 * Query Behaviors
 */

module.exports = {
  /**
   * Querying where value is null
   * @param  {Array}  value Array of keys to be null
   * @param  {Object} query Sql generator query object
   */
  $null: function(value, query){
    for (var i = 0, l = value.length; i < l; ++i){
      query.where.and('"' + value[i].split('.').join('"."') + '" is null');
    }
  }

  /**
   * Querying where value is null
   * @param  {Array}  value Array of keys to be null
   * @param  {Object} query Sql generator query object
   */
, $notNull: function(value, query){
    for (var i = 0, l = value.length; i < l; ++i){
      query.where.and('"' + value[i].split('.').join('"."') + '" is not null');
    }
  }
};