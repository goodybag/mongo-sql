var
  assert        = require('assert')
, utils         = require('../lib/utils')
, QueryBuilder  = require('../lib/query-builder')
, collection    = new QueryBuilder('collection')
;

utils.requireDir('./commands');