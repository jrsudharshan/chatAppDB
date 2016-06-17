var Redis = require('ioredis');
var redis = new Redis(); 

redis.on('connect', function(err) {
	if(err)
		console.log('Cannot connect to DB');
	else
    	console.log('Connected to DB');
});

exports.saveToDb = function(data,err){
	if(err){
		console.log('Error in saving name:msg to DB');
	}
	else{
	redis.hset('1', 'data', data);
	redis.expire('1', 43200);
	}	
}

exports.getMessage = function(data,err){
	redis.hget('1', function(data,err) {
   	if(err)
    	console.log('Error in retriving data obj -> name:msg');
    else
    	console.log(data.name +': '+data.msg);
	});
}

exports.saveUsers = function(data,err){
	if(err){
		console.log('Error in pushing user name on to the DB');
	}
	else{
		redis.lpush('usersInRoom',data.nick);
	}
}
  
exports.removeUsers = function(data,err){
	if(err){
		console.log('Error in deleting user name from the DB');
	}
	else{
		redis.lrem('usersInRoom',data.nick);
	}
}