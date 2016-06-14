var redis = require('redis');
var client = redis.createClient(); //creates a new client
client.on('connect', function() {
    console.log('connected');
});

client.hmset('1', 'name', 'johnny', 'owner', 'true', 'msg', 'hi', 'time', '13:00');

client.expire('1', 43200);

client.hgetall('1', function(err, object) {
    console.log(object.name);
});
