var defs = require('../lib/column-def-helpers');

defs.add('type', function(type, column, query){
  return type;
});

defs.add('primaryKey', function(primaryKey, column, query){
  return primaryKey ?  'primary key' : '';
});

defs.add('references', function(reference, column, query){
  return 'references ' + reference;
});

defs.add('notNull', function(notNull, column, query){
  return notNull ? 'not null' : 'null';
});

defs.add('unique', function(unique, column, query){
  return unique ? 'unique' : '';
});

defs.add('default', function(def, column, query){
  return def ? ('default ' + def) : '';
});