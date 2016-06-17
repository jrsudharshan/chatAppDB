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
	redis.hset('1', 'data', JSON.stringify(data));
	redis.expire('1', 43200);
	}	
}

exports.getMessage = function(data,err){ 
   	if(err)
    	console.log('Error in retriving data obj -> name:msg');
    else{

    	redis.hget('1', 'data', function(err, data){
  			if(err) throw err;
  			else{
    		console.log("name: "+ JSON.parse(data).name+ " msg: "+JSON.parse(data).msg);
  			}
		});
    }

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