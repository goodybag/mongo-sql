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
 *  db.usersGroups.findOne({ "usersGroups.userId": 7 }, {
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
 *  });
 */

var
  commands = {
    find          : require('./commands/find')
  , findOne       : require('./commands/findOne')
  , insert        : require('./commands/insert')
  , update        : require('./commands/update')
  }

, QueryBuilder = function(collection){
    this.collection = collection;
  }
;

for (var key in commands){
  QueryBuilder.prototype[key] = commands[key];
}

module.exports = QueryBuilder;