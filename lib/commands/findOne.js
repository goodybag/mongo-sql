/**
 * collection.findOne
 */
 
/**
 * collection.findOne - Find and return a single document
 *
 * Various argument possibilities
 *  - callback?
 *  - selector, callback?,
 *  - selector, fields, callback?
 *  - selector, options, callback?
 *
 * $query
 * - $equals
 * - $lt, $lte
 * - $gt, $gte
 * - $null, $notNull
 * - $in, $nin
 *
 * Options
 *  - fields
 *  - order
 *  - offset
 *  - limit
 *  - $groupBy
 *  - $join
 *  - $innerJoin
 *  - $leftJoin
 *  - $leftOuterJoin
 *  - $fullOuterJoin
 *  - $crossJoin
 *
 * Example:
 *
 *  db.api.usersGroups.findOne({ "usersGroups.userId": 7 }, {
 *    fields: {
 *      'consumers.id'            : 'consumerId'
 *    , 'managers.id'             : 'managerId'
 *    , 'cashiers.id'             : 'cashierId'
 *    , 'array_agg(groups.name)'  : 'groups'
 *    }
 *
 *  , $leftJoin: {
 *      groups:     { "usersGroups.userId": "groups.id" }
 *    , consumers:  { "usersGroups.userId": "consumers.userId" }
 *    , managers:   { "usersGroups.userId": "managers.userId" }
 *    , cashiers:   { "usersGroups.userId": "cashiers.userId" }
 *    }
 *
 *  , $groupBy: ['consumers.id', 'managers.id', 'cashiers.id']
 *  }, function(error, results, queryResultObj){
 *    console.log(error, results, queryResultObj);
 *  });
 *
 * @param  {Object}   $query   The query document
 * @param  {Object}   options  Optional - addiontal options during query
 */
module.exports = function($query, options){
  if (!options) options = {};

  if (!options.hasOwnProperty('limit')) options.limit = 1;

  return this.find($query, options);
};