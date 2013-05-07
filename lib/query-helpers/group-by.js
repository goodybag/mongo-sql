var helpers = require('./');

helpers.register('groupBy', function(groupBy){
  if (Array.isArray(groupBy)) groupBy = groupBy.join(', ');

  return 'group by ' + groupBy;
});