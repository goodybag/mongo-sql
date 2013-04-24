/**
 * Builders
 */

var
  utils           = require('./utils')
  conditionals    = require('./conditionals')
  updateBehaviors = require('./update-behaviors')

  builders = {
    query: function(query, values, options){
      var variables = query.match(/\{\w+\}/g);
      for (var i = 0, l = variables.length, key; i < l; ++i){
        // If there exists a builder function and input in the options
        // corresponding to the query variable name, then run that
        // builder function with the options
        query = query.replace(
          '{' + (key = variables[i].substring(1, variables[i].length - 1)) + '}'
        , builders[key] && options[key] ? builders[key](options[key], values, options.collection) : ''
        );
      }

      return query.trim().replace(/\s+/g, " ");
    }

  , columns: function(columns){
      if (typeof columns != 'object') throw new Error('Invalid columns input in query properties')

      var output = "";

      for (var key in columns)
        output += (key.indexOf('"') == -1 ? ('"' + key + '"') : key) + ", ";

      if (output.length > 0) output = output.substring(0, output.length - 2);

      return output;
    }

  , values: function(columns, valuesArray){
      if (typeof columns != 'object') throw new Error('Invalid values input in query properties')

      var output = "";

      for (var key in columns) output += "$" + valuesArray.push(columns[key]) + ", ";

      if (output.length > 0) output = output.substring(0, output.length - 2);

      return output;
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

  , join: function(type, joins, collection){
      var output = "", ons;
      for (var table in joins){
        ons = 0;

        output += ' ' + type + ' join "' + table + '" on ';
        output += builders.conditionsI(joins[table], table);
      }
      return output;
    }

  , joins: function(joins, collection){
      var output = "";
      if (joins.join)          output += " " + builders.join('',             joins.join);
      if (joins.innerJoin)     output += " " + builders.join('inner',        joins.innerJoin);
      if (joins.leftJoin)      output += " " + builders.join('left',         joins.leftJoin);
      if (joins.leftOuterJoin) output += " " + builders.join('left outer',   joins.leftOuterJoin);
      if (joins.fullOuterJoin) output += " " + builders.join('full outer',   joins.fullOuterJoin);
      if (joins.crossJoin)     output += " " + builders.join('cross outer',  joins.crossJoin);

      return output;
    }

  , where: function($query, values, collection){
      var output = builders.conditionsI($query, collection, values);
      if (output.length > 0) output = 'where ' + output;
      return output;
    }

  , conditionsI: function($query, collection, values){
      var
        joiners     = [' and ']
      , queue       = [$query]
      , conditions  = []
      , results     = []
      , condition   = '$equals'
      , column

      , current
      ;

      while (current = queue.shift()){

        for (var key in current){
          if (typeof current[key] == 'object'){
            
            // Object is query joiner
            if (key === '$or' || key === '$and')
              joiners.push(key == '$or' ? ' or ' : ' and ');

            // Object is a conditional block
            else if (conditionals[key])
              condition = key;

            // Value is array, key is index
            else if (parseInt(key) >= 0)
              joiners.push(' and ');

            // Object is typical query object and key is a column
            else column = key;

            queue.push(current[key]);

            continue;
          }

          // Things that don't make values
          if (['$in', '$nin', '$with', '$null', '$notNull'].indexOf(key) > -1)
            conditions.push(conditionals[key](column, current[key], values, collection));

          // Conditional function
          else if (conditionals[key]){
            conditions.push(
              conditionals[key](
                column
                // If using values, use $ syntax. No values means val is a column
              , values ? ('$' + values.push(current[key])) : utils.quoteColumn(current[key])
              , values
              , collection
              )
            );
          }

          // Key is an array key - use the current column
          else if (parseInt(key) > 0 && parseInt(key) < 0){
            conditions.push(
              conditionals[condition](
                column
                // If using values, use $ syntax. No values means val is a column
              , values ? ('$' + values.push(current[key])) : utils.quoteColumn(current[key])
              , values
              , collection
              )
            );
          }

          // Standard key->value
          else {
            conditions.push(
              conditionals[condition](
                key
                // If using values, use $ syntax. No values means val is a column
              , values ? ('$' + values.push(current[key])) : utils.quoteColumn(current[key])
              , values
              , collection
              )
            );
          }
        }
        if (conditions.length > 0){
          results.push('(' + conditions.join(joiners.pop()) + ')');
          conditions = [];
        }

      }
      return results.length == 0 ? "" : (
        results.length > 1 ? results.join( joiners.pop() ) : results[0]
      );
    }

  , conditions: function($query, values, collection, joiner, condition, column){
      joiner    = joiner || ' and ';
      condition = conditionals[condition] ? condition : '$equals';

      var conditions = [];
      for (var key in $query){
        // If value is array/object, iterate through children
        // using correct joiner and conditional
        if (typeof $query[key] === "object"){
          // Object is query joiner
          if (key === '$or' || key === '$and')
            conditions.push(builders.conditions($query[key], values, collection, key == '$or' ? ' or ' : ' and ', condition, column));

          // Object is a conditional block
          else if (conditionals[key])
            conditions.push(builders.conditions($query[key], values, collection, joiner, key, column));

          // $query is array
          else if (parseInt(key) >= 0 || parseInt(key) < 0)
            conditions.push(builders.conditions($query[key], values, collection, ' and ', condition, column));

          // Object is typical query object and key is a column
          else
            conditions.push(builders.conditions($query[key], values, collection, joiner, condition, key));
        }

        // Things that don't make values
        else if (['$in', '$nin', '$with', '$null', '$notNull'].indexOf(key) > -1)
          conditions.push(conditionals[key](column, $query[key], values, collection));

        else if (conditionals[key])
          conditions.push(conditionals[key](column, '$' + values.push($query[key]), values, collection));

        else if (parseInt(key) > 0 && parseInt(key) < 0)
          conditions.push(conditionals[condition](column, '$' + values.push($query[key]), values, collection));

        else
          conditions.push(conditionals[condition](key, '$' + values.push($query[key]), values, collection));
      }

      if (conditions.length == 0) return "";

      return '(' + conditions.join(joiner) + ')';
    }

  , updates: function($updates, values, collection){
      var output = "set ";

      // Use update behavior, otherwise just use standard
      for (var key in $updates){
        if (key in updateBehaviors) output += updateBehaviors[key]($updates[key], values, collection);
        else output += utils.quoteColumn(key) + ' = $' + values.push($updates[key]);

        output += ", ";
      }

      output = output.substring(0, output.length - 2);

      return output;
    }

  , returning: function(fields, values, collection){
      var output = "returning ";

      for (var i = 0, l = fields.length, period; i < l; ++i){
        output += utils.quoteColumn(fields[i], collection);

        if (i != l - 1) output += ", ";
      }

      return output;
    }
  }
;

module.exports = builders;