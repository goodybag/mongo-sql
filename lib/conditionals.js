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
    return utils.quoteColumn(column) + ' = ' + utils.quoteValue(value);
  }

  /**
   * Querying where column is greater than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be greater than
   */
, $gt: function(column, value){
    return utils.quoteColumn(column) + ' > ' + utils.quoteValue(value);
  }

  /**
   * Querying where column is greater than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be greater than
   */
, $gte: function(column, value){
    return utils.quoteColumn(column) + ' >= ' + utils.quoteValue(value);
  }

  /**
   * Querying where column is less than a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be less than
   */
, $lt: function(column, value){
    return utils.quoteColumn(column) + ' < ' + utils.quoteValue(value);
  }

  /**
   * Querying where column is less than or equal to a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be lte to
   */
, $lte: function(column, value){
    return utils.quoteColumn(column) + ' <= ' + utils.quoteValue(value);
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
    return utils.quoteColumn(' is null');
  }

  /**
   * Querying where column is like a value
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be like
   */
, $like: function(column, value){
    return utils.quoteColumn(column) + ' like ' + utils.quoteValue(value);
  }

  /**
   * Querying where column is like a value (case insensitive)
   * @param column {String}  - Column name either table.column or column
   * @param value  {Mixed}   - What the column should be like
   */
, $ilike: function(column, value){
    return utils.quoteColumn(column) + ' like ' + utils.quoteValue(value);
  }
};