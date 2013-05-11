/**
 * Conditionals
 * TODO: update comments :/
 */

var helpers = require('../helper-manager').conditional;
var queryBuilder = require('../query-builder');

/**
 * Querying where column is equal to a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be equal to
 */
helpers.add('$equals', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' = ' + value;
});

/**
 * Querying where column is not equal to a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be equal to
 */
helpers.add('$ne', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' != ' + value;
});

/**
 * Querying where column is greater than a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be greater than
 */
helpers.add('$gt', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' > ' + value;
});

/**
 * Querying where column is greater than a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be greater than
 */
helpers.add('$gte', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' >= ' + value;
});

/**
 * Querying where column is less than a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be less than
 */
helpers.add('$lt', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' < ' + value;
});

/**
 * Querying where column is less than or equal to a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be lte to
 */
helpers.add('$lte', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' <= ' + value;
});

/**
 * Querying where value is null
 * @param column {String}  - Column name either table.column or column
 */
helpers.add('$null', { cascade: true, customValues: true }, function(column, value, values, collection){
  return column + ' is null';
});

/**
 * Querying where value is null
 * @param column {String}  - Column name either table.column or column
 */
helpers.add('$notNull', { cascade: true, customValues: true }, function(column, value, values, collection){
  return column + ' is not null';
});

/**
 * Querying where column is like a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be like
 */
helpers.add('$like', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' like ' + value;
});

/**
 * Querying where column is like a value (case insensitive)
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be like
 */
helpers.add('$ilike', { cascade: true, customValues: false }, function(column, value, values, collection){
  return column + ' ilike ' + value;
});

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
helpers.add('$in', { cascade: false, customValues: true }, function(column, set, values, collection){
  return column + ' in (' + queryBuilder(set, values).toString() + ')';
});

/**
 * Querying where column is not in a set
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
helpers.add('$nin', { cascade: false, customValues: true }, function(column, set, values, collection){
  return column + ' not in (' + queryBuilder(set, values).toString() + ')';
});