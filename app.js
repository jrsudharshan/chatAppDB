//Server Side
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	port = 3000,
	nicknames = [],									  //to store names
	messages = [],									  //to store messages
	sockets = [];								     
	
server.listen(port,function(){
	console.log("Server up and running");
	console.log("Server listening at port %d",port)
});

app.get('/', function(req, res){
	res.sendfile(__dirname + '/tchat.html');
});

//on connecting do the following
io.sockets.on('connection', function(socket){
	socket.on('new user', function(data, callback){
		if (nicknames.indexOf(data) != -1){           //name does not exist 
			callback(false);
		} else{
			callback(true);                        
			socket.nickname = data;                   //name exists
			nicknames.push(socket.nickname);		  //store the name in socket itself
			updateNicknames();
		}
	});
	
	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
	});
	
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;                 //when user did not enter name and quit 
		console.log(socket.nickname + " disconnected.");
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();

	});
});