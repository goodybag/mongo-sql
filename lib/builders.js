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
  query: function(query, options){
    var variables = query.match(/\{\w+\}/g);
    for (var i = 0, l = variables.length, key; i < l; ++i){
      query = query.replace(
        '{' + (key = variables[i].substring(1, variables[i].length - 1)) + '}'
      , options[key] || ''
      );
    }
    return query.trim().replace(/\s+/g, " ");
  }

, join: function(type, joins){
    var query = "", ons;
    for (var table in joins){
      ons = 0;

      query += ' ' + type + ' join "' + table + '"';

      for (var column in joins[table]){
        query += ' '   + (ons++ === 0 ?  'on' : 'and') + ' '
              +  '"'   + column.split('.').join('"."') + '"'
              +  ' = ' +  '"' + joins[table][column].split('.').join('"."') + '"';
      }
    }
    return query;
  }

, where: function($query, values, joiner, condition, column){
    joiner    = joiner || ' and ';
    condition = conditionals[condition] ? condition : '$equals';

    var wheres = [];
    for (var key in $query){
      // If value is array/object, iterate through children
      // using correct joiner and conditional
      if (typeof $query[key] === "object"){
        if (key === '$or' || key === '$and')
          wheres.push(module.exports.where($query[key], values, key == '$or' ? ' or ' : ' and ', condition, column));

        else if (conditionals[key])
          wheres.push(module.exports.where($query[key], values, joiner, key, column));

        else if (!(parseInt(key) > 0 && parseInt(key) < 0))
          wheres.push(module.exports.where($query[key], values, ' and ', condition, key));

        else
          wheres.push(module.exports.where($query[key], values, joiner, condition, column));
      }

      // Sub-queries aren't values!
      else if (['$in', '$nin', '$with'].indexOf(key) > -1)
        wheres.push(conditionals[key](column, $query[key], values));

      else if (conditionals[key])
        wheres.push(conditionals[key](column, '$' + values.push($query[key]), values));

      else if (parseInt(key) > 0 && parseInt(key) < 0)
        wheres.push(conditionals[condition](column, '$' + values.push($query[key]), values));

      else
        wheres.push(conditionals[condition](key, '$' + values.push($query[key]), values));
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