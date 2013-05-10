var
  utils = require('./utils')
, helpers = require('./helpers')
;

module.exports = function($query, collection, values){
  var
    joiners     = [' and ']
  , queue       = [$query]
  , conditions  = []
  , results     = []
  , condition   = '$equals'
  , column

  , isHelper
  , isCascading
  , current
  ;

  while (current = queue.shift()){

    for (var key in current){
      isHelper = helpers.conditional.has(key) || helpers.value.has(key);

      isCascading = isHelper && (
        (helpers.conditional.has(key) && !!helpers.conditional.getOptions(key).cascade) ||
        (helpers.value.has(key) && !!helpers.value.getOptions(key).cascade)
      );

      // Current is an object and isn't a custom value
      if (typeof current[key] == 'object'){
        
        // Object is query joiner
        if (key == '$or' || key == '$and')
          joiners.push(key == '$or' ? ' or ' : ' and ');

        // Object is a conditional block
        else if (helpers.conditional.has(key))
          condition = key;

        // Value is array, key is index
        else if (parseInt(key) >= 0)
          joiners.push(' and ');

        // Object is typical query object and key is a column
        else if (!isHelper) column = key;

        if (isHelper) {
          if (isCascading) {
            queue.push(current[key]);
            continue;
          }
        } else {
          queue.push(current[key]);
          continue;
        }
      }

      // Custom conditional behavior
      if (helpers.conditional.has(key)){
        conditions.push(
          helpers.conditional.get(key)(
            utils.quoteColumn(column, collection)

            // If using values
          , values ? (

              // Either use custom value syntax or default $
              helpers.conditional.getOptions(key).customValues ? (
                current[key]
              ) : ('$' + values.push(current[key]))

              // Otherwise it's probably a column, so quote it
            ) : utils.quoteColumn(current[key])

          , values
          , collection
          )
        );
      }

      // Custom value behavior
      else if (helpers.value.has(key)){
        conditions.push(
          helpers.conditional.get(condition)(
            utils.quoteColumn(column, collection)

          , helpers.value.get(key)(
              utils.quoteColumn(column, collection)

              // If using values
            , values ? (

                // Either use custom value syntax or default $
                helpers.value.getOptions(key).customValues ? (
                  current[key]
                ) : ('$' + values.push(current[key]))

                // Otherwise it's probably a column, so quote it
              ) : utils.quoteColumn(current[key])

            , values
            , collection
            )
          , values
          , collection
          )
        );
      }

      // Key is an array key - use the current column
      else if (parseInt(key) > 0 && parseInt(key) < 0){
        conditions.push(
          helpers.conditional.get(condition)(
            utils.quoteColumn(column, collection)
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
          helpers.conditional.get(condition)(
            utils.quoteColumn(key, collection)
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
    results.length > 1 ? results.join( joiners.pop() || ' and ' ) : results[0]
  );
};