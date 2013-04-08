/**
 * Conditionals
 */

var
  utils = require('./utils')
;

module.exports = {
  /**
   * Querying where column is equal to a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be equal to
   */
  $equals: function(column, value){
    return utils.quoteColumn(column) + ' = ' + value;
  }

  /**
   * Querying where column is greater than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be greater than
   */
, $gt: function(column, value){
    return utils.quoteColumn(column) + ' > ' + value;
  }

  /**
   * Querying where column is greater than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be greater than
   */
, $gte: function(column, value){
    return utils.quoteColumn(column) + ' >= ' + value;
  }

  /**
   * Querying where column is less than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be less than
   */
, $lt: function(column, value){
    return utils.quoteColumn(column) + ' < ' + value;
  }

  /**
   * Querying where column is less than or equal to a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be lte to
   */
, $lte: function(column, value){
    return utils.quoteColumn(column) + ' <= ' + value;
  }

  /**
   * Querying where value is null
   * @param column {String}  - Column name either table.column or column
   */
, $null: function(column){
    return utils.quoteColumn(column) + ' is null';
  }

  /**
   * Querying where value is null
   * @param column {String}  - Column name either table.column or column
   */
, $notNull: function(column){
    return utils.quoteColumn(column) + ' is not null';
  }

  /**
   * Querying where column is like a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be like
   */
, $like: function(column, value){
    return utils.quoteColumn(column) + ' like ' + value;
  }

  /**
   * Querying where column is like a value (case insensitive)
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be like
   */
, $ilike: function(column, value){
    return utils.quoteColumn(column) + ' like ' + value;
  }

  /**
   * Querying where column is in a set
   *
   * Values
   * - String, no explaination necessary
   * - Array, joins escaped values with a comma
   * - Function, executes function, expects string in correct format
   *  |- Useful for sub-queries
   *
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - String|Array|Function
   */
, $in: function(column, set, values){
    // Set is actually a query-builder plan
    // So pass it the current set of values to build upon
    if (typeof set === "function")
      return utils.quoteColumn(column) + ' in (' + set(values) + ')';

    if (Array.isArray(set))
      return utils.quoteColumn(column) + ' in (' + set.join(', ') + ')';

    return utils.quoteColumn(column) + ' in (' + set + ')';
    
  }
};