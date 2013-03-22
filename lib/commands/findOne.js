/**
 * collection.findOne
 */

var
  sql       = require('sql')
, db        = require('./connection')
, builders  = require('./builders')
;


/**
 * collection.findOne - Find and return a single document
 *
 * Various argument possibilities
 *  - callback?
 *  - selector, callback?,
 *  - selector, fields, callback?
 *  - selector, options, callback?
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
 * @param  {Function} callback optional callback for results
 */
module.exports = function($query, options, callback){
  var defaults = {
    fields: ['"' + this.collection + '".*']
  , count: true
  };

  if (typeof options === "function"){
    callback = options;
    options = defaults;
  } else {
    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  if (typeof $query !== "object") $query = { id: $query };

  var query = sql.query('select {fields} from {collection} {joins} {where} {order} {groupBy}');

  if (Array.isArray(options.fields)) query.fields = options.fields.join(', ');
  else if (typeof options.fields === "object"){
    var n = 0, column;
    query.fields = "";
    for (var key in options.fields){
      // Using a function
      if (key.indexOf('(') > -1){
        // NO MAGIC FOR NOW :(
        // column = key.match(/\(([^()]+)\)/g)[0];
        // column = column.substring(1, column.length - 1);
        // column = key.replace(/\(([^()]+)\)/g, '("' + m.split('.').join('"."') + '")');
        column = key;
      } else column = '"' + key.split('.').join('"."') + '"';
      query.fields += (n++ > 0 ? ', ' : ' ') + column + ' as "' + options.fields[key] + '"';
    }
  }

  query.collection = '"' + this.collection + '"';
  if (options.collections) query.collection += ', "' + options.collections.join('", "') + '"';

  if (options.$join)          query.joins += " " + builder.join('inner',        options.$join);
  if (options.$innerJoin)     query.joins += " " + builder.join('inner',        options.$innerJoin);
  if (options.$leftJoin)      query.joins += " " + builder.join('left',         options.$leftJoin);
  if (options.$leftOuterJoin) query.joins += " " + builder.join('left outer',   options.$leftOuterJoin);
  if (options.$fullOuterJoin) query.joins += " " + builder.join('full outer',   options.$fullOuterJoin);
  if (options.$crossJoin)     query.joins += " " + builder.join('cross outer',  options.$crossJoin);

  query.where = sql.where();
  builders.where($query, query);

  var buildWhere = function($query) {
    var clauses = [];
    for (var key in $query){
      if (key === '$or') {
        clauses.push($query[key].map(buildWhere).join(' OR '));
      } else {
        clauses.push('"' + key.split('.').join('"."') + '" = ' + '$' + key);
        query.$(key, $query[key]);
      }
    }
    return clauses;
  };
  query.where = 'WHERE '+buildWhere($query).join(' AND ');

  if (options.$groupBy) query.groupBy = 'group by ' + options.$groupBy.join(', ');

  if (options.order) query.order = options.order;

  db.getClient(function(error, client){
    if (error) return callback(error);

    client.query(query.toString(), query.$values, function(error, result){
      if (error) return callback(error);

      callback(null, result.rows.length > 0 ? result.rows[0] : null, result);
    });
  });
};