/**
 * collection.find
 */

var builders  = require('../builders');

/**
 * collection.find - Find and return some documents
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
 *  - groupBy
 *  - join
 *  - innerJoin
 *  - leftJoin
 *  - leftOuterJoin
 *  - fullOuterJoin
 *  - crossJoin
 *
 * Example:
 *
 *  db.api.usersGroups.find({ "usersGroups.userId": { $gt: 7 } }, {
 *    fields: {
 *      'consumers.id'            : 'consumerId'
 *    , 'managers.id'             : 'managerId'
 *    , 'cashiers.id'             : 'cashierId'
 *    , 'array_agg(groups.name)'  : 'groups'
 *    }
 *
 *  , leftJoin: {
 *      groups:     { "usersGroups.userId": "groups.id" }
 *    , consumers:  { "usersGroups.userId": "consumers.userId" }
 *    , managers:   { "usersGroups.userId": "managers.userId" }
 *    , cashiers:   { "usersGroups.userId": "cashiers.userId" }
 *    }
 *
 *  , groupBy: ['consumers.id', 'managers.id', 'cashiers.id']
 *  });
 *
 * @param  {Object}   $query   The query document
 * @param  {Object}   options  Optional - addiontal options during query
 */
module.exports = function($query, options){
  // query by id shorthand
  if (typeof $query !== "object") $query = { id: $query };

  var
    query = 'select {fields} from {collections} {joins} {where} {limit} {order} {groupBy}'

  , defaults = {
      fields: ['"' + this.collection + '".*']
    , count: true
    }

  , queryProps = {
      where:        $query
    , collections:  [this.collection]
    , collection:   this.collection
    , joins:        {}
    }

  , values
  , result
  ;

  if (!options) options = defaults;
  else {
    // Save plan for later use
    if (options.defer){
      var this_ = this;

      // Don't defer again
      options.defer = false;

      // As long as the deferred function is eventually called
      // This shouldn't be leaky
      return function(values){
        if (values) options.values = values;
        return module.exports.call(this_, $query, options);
      };
    }

    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  values = options.values || [];

  queryProps.fields  = options.fields;
  queryProps.order   = options.order;
  queryProps.limit   = options.limit;
  queryProps.groupBy = options.groupBy;

  // May be selecting from multiple collections
  if (Array.isArray(options.collections))
    Array.prototype.push.apply(queryProps.collections, options.collections);

  // Check for joins
  if (options.join)          queryProps.joins.join          = options.join;
  if (options.innerJoin)     queryProps.joins.innerJoin     = options.innerJoin;
  if (options.leftJoin)      queryProps.joins.leftJoin      = options.leftJoin;
  if (options.leftOuterJoin) queryProps.joins.leftOuterJoin = options.leftOuterJoin;
  if (options.fullOuterJoin) queryProps.joins.fullOuterJoin = options.fullOuterJoin;
  if (options.crossJoin)     queryProps.joins.crossJoin     = options.crossJoin;

  // Provide interface that node-pg likes to work with
  // TODO: fairly sure this toString function is leaky
  result = {
    query:    builders.query(query, values, queryProps, this.collection)
  , values:   values
  , toString: function(){ return result.query; }
  , toQuery:  function(){ return result.query; }
  };

  return result;
};