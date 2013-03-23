/****************************************
{
  $or: [
    { $and: { a: 1, b: 2 } }
  , { $and: { c: 3, d: 4 } }
  ]
}

{
  id:       { $gt: 1 }
, $lt:      { date: 'now()', clicks: 5 }
, $or:      { something: { $gte: 5 } }
, $order:   { id: 'desc' }
, $limit:   100
, $offset:  200
, $group:   ['id', 'something']
}
*****************************************/

var
  conditionals = require('./conditionals')
;

module.exports = {
  join: function(type, joins){
    var query = "", ons;
    for (var table in joins){
      ons = 0;

      query += ' ' + type + ' join "' + table + '"';

      for (var column in joins[table]){
        query += ' '   + (ons++ === 0 ?  'on' : 'and') + ' '
              +  '"'   + column.split('.').join('"."') + '"'
              +  ' = ' +  '"'   + joins[table][column].split('.').join('"."') + '"';
      }
    }
    return query;
  }

// , where: function($query, query){
//     for (var key in $query){
//       if (key in queryBehaviors) queryBehaviors[key]($query[key], query);
//       else {
//         query.where.and('"' + key + '" = ' + '$' + key);
//         query.$(key, $query[key]);
//       }
//     }
//   }

, where: function($query, joiner, condition){
    joiner    = joiner || ' and ';
    condition = conditions[condition] ? condition : '$equals';

    var wheres = [];

    for (var key in $query){
      // If value is array/object, iterate through children
      // using correct joiner and conditional
      if (typeof $query[key] === "object")
        wheres.push(exports.where(
          $query[key]
        , key === '$or' ? ' or ' : ' and '
        , conditionals[key] ? key : '$equals')
        );
      else 
        wheres.push(conditionals[condition](key, $query[key]));
    }

    return '(' + wheres.join(joiner) + ')';
  }

, update: function($updates, query){
    query.updates = sql.fields();
    var updates = {};

    // Use update behavior, otherwise just use standard
    for (var key in $updates){
      if (key in updateBehaviors) updateBehaviors[key]($updates[key], query);
      else updates[key] = $updates[key];
    }

    query.updates.addUpdateMap(updates, query);
  }
};