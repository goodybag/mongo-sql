var
  utils   = require('./utils')
, helpers = require('./conditional-helpers')
;

module.exports = function(where, table, values){
  var buildConditions = function(where, condition, column, joiner){
    joiner = joiner || ' and ';
    if (column) column = utils.quoteObject(column, table);

    var conditions = [], result;

    for (var key in where) {

      // If the value is undefined, skip it
      if ( where[key] === undefined ) {
        continue;
      }

      if (typeof where[key] == 'object' && !(where[key] instanceof Date) && !Buffer.isBuffer(where[key]) && where[key] !== null) {

        // Key is conditional block
        if (helpers.has(key)) {
          // If it cascades, run it through the builder using the helper key
          // as the current condition
          // If it doesn't cascade, run the helper immediately
          if (helpers.get(key).options.cascade)
            (result = buildConditions(where[key], key, column)) && conditions.push(result);
          else
            (result = helpers.get(key).fn(column, where[key], values, table, where[key], buildConditions)) && conditions.push(result);
        }

        // Key is Joiner
        else if (key == '$or')
          (result = buildConditions(where[key], condition, column, ' or ')) && conditions.push(result);

        else if (key == '$and')
          (result = buildConditions(where[key], condition, column)) && conditions.push(result);

        // Key is array index
        else if (+key >= 0)
          (result = buildConditions(where[key], condition, column)) && conditions.push(result);

        // Key is column
        else
          (result = buildConditions(where[key], condition, key)) && conditions.push(result);

        continue;
      }

      // Key is a helper, use that for this value
      if (helpers.has(key))
        conditions.push(
          helpers.get(key).fn(
            column
          , where[key] === null ? null : utils.parameterize(where[key], values)
          , values
          , table
          , where[key]
          )
        );

      // Key is an array index
      else if (+key >= 0)
        conditions.push(
          helpers.get(condition).fn(
            column
          , where[key] === null ? null : utils.parameterize(where[key], values)
          , values
          , table
          , where[key]
          )
        );

      // Key is a column
      else
        conditions.push(
          helpers.get(condition).fn(
            utils.quoteObject(key, table)
          , where[key] === null ? null : utils.parameterize(where[key], values)
          , values
          , table
          , where[key]
          )
        );
    }

    if (conditions.length > 1) return '(' + conditions.join(joiner) + ')';
    if (conditions.length == 1) return conditions[0];
  };

  // Always remove outer-most parenthesis
  var result = buildConditions(where, '$equals');
  if (!result) return '';
  if (result[0] == '(') return result.substring(1, result.length - 1);
  return result;
};
