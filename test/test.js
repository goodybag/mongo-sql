var
  assert        = require('assert')
, QueryBuilder  = require('../')
, collection    = new QueryBuilder('collection')
;

require('./commands/find');
require('./commands/findOne');
require('./commands/insert');
require('./commands/update');
require('./commands/remove');