var helpers = require('../helper-manager').value;

helpers.add('$custom', function(column, value, values, collection){
  if (Array.isArray(value))
    return helpers.get('$custom_array')( column, value, values, collection );
  
  if (typeof value == 'object')
    return helpers.get('$custom_object')( column, value, values, collection );

  throw new Error('Invalid Custom Value Input');
});

helpers.add('$custom_array', function(column, value, values, collection){
  var output = value[0];

  for (var i = 1, l = value.length; i < l; ++i){
    output = output.replace(
      RegExp('(\\$)' + i + '(\\W|$)','g')
    , '$1' + values.push(value[i]) + '$2'
    );
  }

  return output;
});

helpers.add('$custom_object', { customValues: false }, function(column, value, values, collection){
  return helpers.get('$custom_array')(column, [value.value].concat(value.values), values, collection);
});

helpers.add('$time_ago', function(column, value, values, collection){
  return "now() - interval $" + values.push(value.value) + " " + value.type;
});

helpers.add('$years_ago', function(column, value, values, collection){
  return helpers.get('$time_ago')(column, { value: value, type: 'years' }, values, collection);
});

helpers.add('$months_ago', function(column, value, values, collection){
  return helpers.get('$time_ago')(column, { value: value, type: 'months' }, values, collection);
});

helpers.add('$days_ago', function(column, value, values, collection){
  return helpers.get('$time_ago')(column, { value: value, type: 'days' }, values, collection);
});

helpers.add('$hours_ago', function(column, value, values, collection){
  return helpers.get('$time_ago')(column, { value: value, type: 'hour' }, values, collection);
});

helpers.add('$minutes_ago', function(column, value, values, collection){
  return helpers.get('$time_ago')(column, { value: value, type: 'minutes' }, values, collection);
});

helpers.add('$seconds_ago', function(column, value, values, collection){
  return helpers.get('$time_ago')(column, { value: value, type: 'seconds' }, values, collection);
});