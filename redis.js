var Redis = require('ioredis');
var redis = new Redis(); 
redis.on('connect', function(err) {
    if(err)
		console.log('Cannot connect to DB');
	else
    	console.log('connected to DB');
});

redis.hmset('1', 'name', 'johnny', 'owner', 'true', 'msg', 'hi', 'time', '13:00');

redis.expire('1', 105);

redis.hgetall('1', function(err, object) {
    if(err)
   		console.log('Error in retriving data');
   	else
   		console.log(object.msg);
});


