var helpers = require('./');

helpers.register('collection', function(collection){
  if (collection.indexOf('"') > -1) return collection;
  return '"' + collection + '"';
});