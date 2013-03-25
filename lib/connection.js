
/**
 * PG Connection
 */

var
  pg      = require('pg')
, pooler  = require('generic-pool')

  // Promise to fullfil this variable!
, client  = null

, activePoolIds = {}
;

exports.init = function(config){
  exports.pool = pooler.Pool({
    name: config.poolName || 'postgres'

  , max: config.maxConnections || 10

  , create: config.function(callback){
      new pg.Client(config.connectionString).connect(function(error, client){

        if (error) return callback(error);

        client.on('error', function(e){
          exports.pool.emit('error', e, client);
          pool.destroy(client);
        });

        client.on('drain', function(){
          if (client.assignedPoolId){
            delete activePoolIds[client.assignedPoolId];
          }

          pool.release(client);
        });

        callback(null, client);
      });
    }

  , destroy: function(client){
      client.end();
    }

  , max: 30

  , idleTimeoutMillis: 30 * 1000

  , reapIntervalMillis: 1000
  })
};

exports.getClient = function(callback){
  return pool.acquire(function(error, client){
    if (config.outputActivePoolIds && client) client.assignedPoolId = id;
    if (client) client.logTags = logTags;
    
    callback(error, client);
  });
};

exports.execute = function(query, callback){
  var plan = function(cb){
    // If that yet again has no callback, just return the sql
    if (!cb) return query;
    
    db.getClient(function(error, client){
      if (error) return cb(error);

      client.query(builder.query(query, queryProps), function(error, result){
        if (error) return cb(error);

        cb(result.rows);
      });
    });
  };

  if (!callback) return plan;

  return plan(callback);
}