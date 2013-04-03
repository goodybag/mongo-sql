var
  assert        = require('assert')
, QueryBuilder  = require('../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

require('./commands/find');
require('./commands/findOne');