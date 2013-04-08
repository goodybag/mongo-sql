/**
 * Builders
 */

var
  conditionals = require('./conditionals')

, builders = {
    query: function(query, values, options){
      var variables = query.match(/\{\w+\}/g);
      for (var i = 0, l = variables.length, key; i < l; ++i){
        // If there exists a builder function and input in the options
        // corresponding to the query variable name, then run that
        // builder function with the options
        query = query.replace(
          '{' + (key = variables[i].substring(1, variables[i].length - 1)) + '}'
        , builders[key] && options[key] ? builders[key](options[key], values) : ''
        );
      }

      return query.trim().replace(/\s+/g, " ");
    }

  , groupBy: function(groupBy){
      return 'group by ' + groupBy;
    }

  , order: function(order){
      return 'order by ' + order;
    }

  , limit: function(limit){
      return 'limit ' + limit;
    }

  , fields: function(fields){
      if (Array.isArray(fields)) return fields.join(', ');
      if (typeof fields != 'object') throw new Error('Invalid fields input in query properties');

      var n = 0, output = "", column;

      for (var key in fields){
        // Using a function
        if (key.indexOf('(') > -1){
          // NO MAGIC FOR NOW :(
          // column = key.match(/\(([^()]+)\)/g)[0];
          // column = column.substring(1, column.length - 1);
          // column = key.replace(/\(([^()]+)\)/g, '("' + m.split('.').join('"."') + '")');
          column = key;
        } else column = '"' + key.split('.').join('"."') + '"';
        output += (n++ > 0 ? ', ' : ' ') + column + ' as "' + fields[key] + '"';
      }

      return output;
    }

  , collection: function(collection){
      if (collection.indexOf('"') > -1) return collection;
      return '"' + collection + '"';
    }

  , collections: function(collections){
      if (!Array.isArray(collections)) throw new Error('Invalid collections input in query properties');
      return '"' + collections.join('", "') + '"';
    }

  , join: function(type, joins){
      var output = "", ons;
      for (var table in joins){
        ons = 0;

        output += ' ' + type + ' join "' + table + '"';

        for (var column in joins[table]){
          output += ' '   + (ons++ === 0 ?  'on' : 'and') + ' '
                +  '"'   + column.split('.').join('"."') + '"'
                +  ' = ' +  '"' + joins[table][column].split('.').join('"."') + '"';
        }
      }
      return output;
    }

  , joins: function(joins){
      var output = "";

      if (joins.join)          output += " " + builders.join('inner',        joins.join);
      if (joins.innerJoin)     output += " " + builders.join('inner',        joins.innerJoin);
      if (joins.leftJoin)      output += " " + builders.join('left',         joins.leftJoin);
      if (joins.leftOuterJoin) output += " " + builders.join('left outer',   joins.leftOuterJoin);
      if (joins.fullOuterJoin) output += " " + builders.join('full outer',   joins.fullOuterJoin);
      if (joins.crossJoin)     output += " " + builders.join('cross outer',  joins.crossJoin);

      return output;
    }

  , where: function($query, values){
      return 'where ' + builders._where($query, values);
    }

  , _where: function($query, values, joiner, condition, column){
      joiner    = joiner || ' and ';
      condition = conditionals[condition] ? condition : '$equals';

      var wheres = [];
      for (var key in $query){
        // If value is array/object, iterate through children
        // using correct joiner and conditional
        if (typeof $query[key] === "object"){
          if (key === '$or' || key === '$and')
            wheres.push(builders._where($query[key], values, key == '$or' ? ' or ' : ' and ', condition, column));

          else if (conditionals[key])
            wheres.push(builders._where($query[key], values, joiner, key, column));

          else if (!(parseInt(key) > 0 && parseInt(key) < 0))
            wheres.push(builders._where($query[key], values, ' and ', condition, key));

          else
            wheres.push(builders._where($query[key], values, joiner, condition, column));
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

  , returning: function(){

    }
  }
;

module.exports = builders;