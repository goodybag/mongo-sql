module.exports = {
  join: function(type, joins){
    var query = "", ons;
    for (var table in joins){
      ons = 0;

      query += ' ' + type + ' join "' + table + '"';

      for (var column in joins[table]){
        query += ' '   + (ons++ === 0 ?  'on' : 'and') + ' '
              +  '"'   + column.split('.').join('"."') + '"'
              +  ' = ' +  '"'   + joins[table][column].split('.').join('"."') + '"';
      }
    }
    return query;
  }

, where: function($query, query){
    for (var key in $query){
      if (key in queryBehaviors) queryBehaviors[key]($query[key], query);
      else {
        query.where.and('"' + key + '" = ' + '$' + key);
        query.$(key, $query[key]);
      }
    }
  }

, update: function($updates, query){
    query.updates = sql.fields();
    var updates = {};

    // Use update behavior, otherwise just use standard
    for (var key in $updates){
      if (key in updateBehaviors) updateBehaviors[key]($updates[key], query);
      else updates[key] = $updates[key];
    }

    query.updates.addUpdateMap(updates, query);
  }
};