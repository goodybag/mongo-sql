
var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('over', function(over, values, query) {
  if (over === null) return '';

  var order = helpers.get('order').fn;
  var partition = helpers.get('partition').fn;
  var clause = (typeof over === 'object') ?
    [
      over.partition ? partition(over.partition, values, query) : ''
    , over.order ? order(over.order, values, query) : ''
    ].join(' ').trim()
  : (over||'').toString();
  return 'over (' + clause + ')';
});
