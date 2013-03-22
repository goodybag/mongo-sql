var
  db = require('./lib/connection')
, mongopg = require('./lib/mongo-pg')
;

module.exports = {};

for (var key in db){
  module.exports[key] = db[key];
}

for (var key in mongopg){
  module.exports[key] = mongopg[key];
}