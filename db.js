var Redis = require('ioredis');
var redis = new Redis(); 

redis.on('connect', function(err) {
	if(err)
		console.log('Cannot connect to DB');
	else
    	console.log('Connected to DB');
});

export.saveMessage = function(data,err){
	redis.hmset('1', 'name', data.nick, 'msg', data.msg);
	redis.expire('1', 43200);
}

export.getMessage = function(data,err){
	redis.hgetall('1', function(err, data) {
   	if(err)
    	console.log('Error in retriving data');
    else
    	console.log(data.name +': '+data.msg);
	});
}