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
 *  db.api.usersGroups.find({ "usersGroups.userId": { $gt: 7 } }, {
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
  var
    query = 'select {fields} from {collection} {joins} {where} {limit} {order} {groupBy}'

  , defaults = {
      fields: ['"' + this.collection + '".*']
    , count: true
    }

  , queryProps = {}
  , values = []
  , result
  ;

  if (!options){
    options = defaults;
  } else {
    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  if (typeof $query !== "object") $query = { id: $query };

  if (Array.isArray(options.fields)) queryProps.fields = options.fields.join(', ');
  else if (typeof options.fields === "object"){
    var n = 0, column;
    queryProps.fields = "";
    for (var key in options.fields){
      // Using a function
      if (key.indexOf('(') > -1){
        // NO MAGIC FOR NOW :(
        // column = key.match(/\(([^()]+)\)/g)[0];
        // column = column.substring(1, column.length - 1);
        // column = key.replace(/\(([^()]+)\)/g, '("' + m.split('.').join('"."') + '")');
        column = key;
      } else column = '"' + key.split('.').join('"."') + '"';
      queryProps.fields += (n++ > 0 ? ', ' : ' ') + column + ' as "' + options.fields[key] + '"';
    }
  }

  queryProps.collection = '"' + this.collection + '"';
  if (options.collections) queryProps.collection += ', "' + options.collections.join('", "') + '"';

  if (options.$join)          queryProps.joins += " " + builders.join('inner',        options.$join);
  if (options.$innerJoin)     queryProps.joins += " " + builders.join('inner',        options.$innerJoin);
  if (options.$leftJoin)      queryProps.joins += " " + builders.join('left',         options.$leftJoin);
  if (options.$leftOuterJoin) queryProps.joins += " " + builders.join('left outer',   options.$leftOuterJoin);
  if (options.$fullOuterJoin) queryProps.joins += " " + builders.join('full outer',   options.$fullOuterJoin);
  if (options.$crossJoin)     queryProps.joins += " " + builders.join('cross outer',  options.$crossJoin);

  queryProps.where = 'where ' + builders.where($query, values);

  if (options.$groupBy) queryProps.groupBy = 'group by ' + options.$groupBy.join(', ');

  if (options.order) queryProps.order = 'order by ' + options.order;
  if (options.limit) queryProps.limit = 'limit ' + options.limit;

  result = {
    query:  builders.query(query, queryProps)
  , values: values
  };

  result.toString = function(){ return result.query; };

  return result;
};