/**
 * Wrapper ORM for our sql library and node-sql
 * Beware, if your query is HUGE, this does have to perform at least
 * one operation per ANYTHING in the query. That means included fields,
 * joins, fields on joins, groupBys, etc. It will automatically quote
 * most things for you. This basically involves doing this:
 *
 *   '"' + column.split('.').join('"."') + '"'
 *
 * Not terrible because the strings are so small, but it would be nice
 * to have an option to disable quoting in lou of doing it yourself.
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
 */

var
  // Dependencies
  sql             = require('sql')
, Events          = require('event-emitter')

  // Internal
, db              = require('./db')
, queryBehaviors  = require('./query-behaviors')
, updateBehaviors = require('./update-behaviors')

, Api = function(collection){
    this.collection = collection;
    this.currentLogTags = null;
  }
;

Api.prototype = new Events();
Api.prototype.trigger = Api.prototype.emit;

Api.prototype.findOne = function($query, options, callback){
  var TAGS = this.consumeLogTags();
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

  if (options.$join)          query.joins += " " + getJoin('inner',        options.$join);
  if (options.$innerJoin)     query.joins += " " + getJoin('inner',        options.$innerJoin);
  if (options.$leftJoin)      query.joins += " " + getJoin('left',         options.$leftJoin);
  if (options.$leftOuterJoin) query.joins += " " + getJoin('left outer',   options.$leftOuterJoin);
  if (options.$fullOuterJoin) query.joins += " " + getJoin('full outer',   options.$fullOuterJoin);
  if (options.$crossJoin)     query.joins += " " + getJoin('cross outer',  options.$crossJoin);

  // query.where = sql.where();

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

  db.getClient(TAGS, function(error, client){
    if (error) return callback(error);

    client.query(query.toString(), query.$values, function(error, result){
      if (error) return callback(error);

      callback(null, result.rows.length > 0 ? result.rows[0] : null, result);
    });
  });
};

Api.prototype.find = function($query, options, callback){
  var TAGS = this.consumeLogTags();
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

  if (options.$join)          query.joins += " " + getJoin('inner',        options.$join);
  if (options.$innerJoin)     query.joins += " " + getJoin('inner',        options.$innerJoin);
  if (options.$leftJoin)      query.joins += " " + getJoin('left',         options.$leftJoin);
  if (options.$leftOuterJoin) query.joins += " " + getJoin('left outer',   options.$leftOuterJoin);
  if (options.$fullOuterJoin) query.joins += " " + getJoin('full outer',   options.$fullOuterJoin);
  if (options.$crossJoin)     query.joins += " " + getJoin('cross outer',  options.$crossJoin);

  query.where = sql.where();

  buildQuery($query, query);

  if (options.$groupBy) query.groupBy = 'group by ' + options.$groupBy.join(', ');

  if (options.order) query.order = options.order;

  db.getClient(TAGS, function(error, client){
    if (error) return callback(error);

    client.query(query.toString(), query.$values, function(error, result){
      if (error) return callback(error);

      var meta = {};
      if (options.count){
        meta.total = (result.rows[0]) ? result.rows[0].metaTotal : 0;
      }

      callback(null, result.rows, meta);
    });
  });
};

Api.prototype.insert = function(inputs, options, callback){
  var TAGS = this.consumeLogTags();
  var defaults = {
    returning: [this.collection + '.id']
  };
  options = options || {};
  callback = callback || function(){};

  if (typeof options === "function"){
    callback = options;
    options = defaults;
  } else {
    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  var query = sql.query('insert into "{collection}" ({fields}) values ({values}) {returning}');

  query.collection = this.collection;
  query.fields = sql.fields().addObjectKeys(inputs);
  query.values = sql.fields().addObjectValues(inputs, query);

  if (options.returning){
    // Escape returning fields
    for (var i = options.returning.length - 1, period, ret; i >= 0; i--){
      ret = '"' + options.returning[i];

      if ((period = ret.indexOf(".")) > -1){
        ret = ret.substring(0, period) + '"."' + ret.substring(period + 1);
      }

      options.returning[i] = ret + '"';
    };

    query.returning = "returning " + options.returning;
  }

  db.getClient(TAGS, function(error, client){
    if (error) return callback(error);

    client.query(query.toString(), query.$values, function(error, result){
      if (error) return callback(error);

      callback(null, result.rows, result);
    });
  });
};

Api.prototype.update = function($query, $update, options, callback){
  var TAGS = this.consumeLogTags();
  var defaults = {};

  if (typeof options === "function"){
    callback = options;
    options = defaults;
  } else {
    for (var key in defaults){
      if (!(key in options)) options[key] = defaults[key];
    }
  }

  if (typeof $query !== "object") $query = { id: $query };

  var query = sql.query('update "{collection}" set {updates} {where} {returning}');
  query.collection = this.collection;
  query.where = sql.where();

  buildQuery($query, query);
  buildUpdate($update, query);

  if (options.returning){
    // Escape returning fields
    for (var i = options.returning.length - 1, period, ret; i >= 0; i--){
      ret = '"' + options.returning[i];

      if ((period = ret.indexOf(".")) > -1){
        ret = ret.substring(0, period) + '"."' + ret.substring(period + 1);
      }

      options.returning[i] = ret + '"';
    };

    query.returning = "returning " + options.returning;
  }
  db.getClient(TAGS, function(error, client){
    if (error) return callback(error);

    client.query(query.toString(), query.$values, function(error, result){
      if (error) return callback(error);

      callback(null, result.rows, result);
    });
  });
};

Api.prototype.remove = function(id, callback){
  var TAGS = this.consumeLogTags();
  var query = sql.query('delete from {collection} where id = $1');
  query.collection = this.collection;

  db.getClient(TAGS, function(error, client){
   if (error) return callback(error);

   client.query(query.toString(), [id], callback);
  });
};

module.exports = Api;