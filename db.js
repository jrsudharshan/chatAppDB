'use strict';

var Redis = require('ioredis');
var redis = new Redis();

redis.on('connect', function(err){
  if(err){
    console.log('Cannot connect to DB');
  }
  else{
    console.log('Connected to DB');
  }
});

module.exports.saveToDb = function(socketName, userName, message, callback){
  redis.get(socketName, function(err, data){
    if(!data){
      data = {
        messages: []
      };
    }
    else{
      data = JSON.parse(data);
    }

    data.messages.push({userName: userName, message: message});
    var multi = redis.multi();
    
    multi.set(socketName, JSON.stringify(data));
    redis.expire('1', 43200);
    multi.exec(callback);
  });
};

module.exports.getMessage = function(socketName, callback){
  redis.get(socketName, function(err, data){
    if(err){
      callback(err);
    }
    else{
      if(data){
        data = JSON.parse(data);
        callback(null, data.messages);
      }
      else{
        callback(null);
      }
    }
  });
};

module.exports.saveUsers = function(data,err){
  if(err){
    console.log('Error in pushing user name on to the DB');
  }
  else{
    redis.lpush('usersInRoom',data.nick);
  }
}
  
module.exports.removeUsers = function(data,err){
  if(err){
    console.log('Error in deleting user name from the DB');
  }
  else{
    redis.lrem('usersInRoom',data.nick);
  }
}