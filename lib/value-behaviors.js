module.exports = {
  $custom: function(column, value, values, collection){
    if (Array.isArray(value))
      return module.exports.$custom_array( column, value, values, collection );
    
    if (typeof value == 'object')
      return module.exports.$custom_object( column, value, values, collection );

    throw new Error('Invalid Custom Value Input');
  }

, $custom_array: function(column, value, values, collection){
    var output = value[0];

    for (var i = 1, l = value.length; i < l; ++i){
      output = output.replace(
        RegExp('(\\$)' + i + '(\\W|$)','g')
      , '$1' + values.push(value[i]) + '$2'
      );
    }

    return output;
  }

, $custom_object: function(column, value, values, collection){
    return module.exports.$custom_array(column, [value.value].concat(value.values), values, collection);
  }

, $time_ago: function(column, value, values, collection){
    return "now() - interval $" + values.push(value.value) + " " + value.type;
  }

, $years_ago: function(column, value, values, collection){
    return module.exports.$time_ago(column, { value: value, type: 'years' }, values, collection);
  }

, $months_ago: function(column, value, values, collection){
    return module.exports.$time_ago(column, { value: value, type: 'months' }, values, collection);
  }

, $days_ago: function(column, value, values, collection){
    return module.exports.$time_ago(column, { value: value, type: 'days' }, values, collection);
  }

, $hours_ago: function(column, value, values, collection){
    return module.exports.$time_ago(column, { value: value, type: 'hour' }, values, collection);
  }

, $minutes_ago: function(column, value, values, collection){
    return module.exports.$time_ago(column, { value: value, type: 'minutes' }, values, collection);
  }

, $seconds_ago: function(column, value, values, collection){
    return module.exports.$time_ago(column, { value: value, type: 'seconds' }, values, collection);
  }
};