var helpers = require('./');

helpers.register('collections', function(collections){
  if (!Array.isArray(collections)) throw new Error('Invalid collections input in query properties');
  return '"' + collections.join('", "') + '"';
});